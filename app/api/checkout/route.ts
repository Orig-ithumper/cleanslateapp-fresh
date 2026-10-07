import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import Stripe from "stripe";
import {
  californiaConfig,
  californiaCounties,
  isAdultDateOfBirth,
  serviceFees,
  type ServiceType,
} from "../../../lib/intake-config";

export const runtime = "nodejs";
export const maxDuration = 10;

type IntakePayload = {
  serviceType: ServiceType;
  state: string;
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  caseNumber: string;
  county: string;
  year: string;
  charge: string;
  disposition: string;
  flags: Record<string, boolean>;
  acknowledged: boolean;
  intakeToken: string;
};

const flagNames = [
  "warrants",
  "pending",
  "priorExpungements",
  "federal",
  "sexOffense",
  "violentOffense",
];

function isIntakePayload(value: unknown): value is IntakePayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (
    typeof v.serviceType !== "string" ||
    !Object.prototype.hasOwnProperty.call(serviceFees, v.serviceType) ||
    typeof v.state !== "string" ||
    typeof v.fullName !== "string" ||
    typeof v.dob !== "string" ||
    typeof v.email !== "string" ||
    typeof v.phone !== "string" ||
    typeof v.caseNumber !== "string" ||
    typeof v.county !== "string" ||
    typeof v.year !== "string" ||
    typeof v.charge !== "string" ||
    typeof v.disposition !== "string" ||
    v.acknowledged !== true ||
    typeof v.intakeToken !== "string" ||
    !/^[\w-]{8,80}$/.test(v.intakeToken) ||
    !v.flags ||
    typeof v.flags !== "object" ||
    Array.isArray(v.flags)
  ) {
    return false;
  }

  const flags = v.flags as Record<string, unknown>;
  return flagNames.every((name) => typeof flags[name] === "boolean");
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = 2500
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function syncToFilingEngine(params: {
  recordId: string;
  payload: IntakePayload;
}): Promise<boolean> {
  const baseUrl = process.env.CASE_MASTER_API_URL;
  const serviceToken = process.env.SERVICE_TOKEN;
  if (!baseUrl || !serviceToken) return false;

  const { recordId, payload } = params;
  const headers = {
    "Content-Type": "application/json",
    "X-Service-Token": serviceToken,
  };

  let intakeId: number;
  try {
    const res = await fetchWithTimeout(`${baseUrl.replace(/\/+$/, "")}/intake/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        answers: {
          notionRecordId: recordId,
          serviceType: payload.serviceType,
          state: payload.state,
          county: payload.county,
          caseNumber: payload.caseNumber,
          year: payload.year,
          charge: payload.charge,
          disposition: payload.disposition,
          dob: payload.dob,
          waiver: String(californiaConfig.waiverAvailable),
          flags: payload.flags,
        },
      }),
    });

    if (!res.ok) {
      console.error(`[checkout] Filing engine intake sync failed (${res.status})`);
      return false;
    }
    const intake = (await res.json()) as { id?: unknown };
    if (typeof intake.id !== "number" || !Number.isFinite(intake.id)) {
      console.error("[checkout] Filing engine returned an invalid intake ID");
      return false;
    }
    intakeId = intake.id;
  } catch (err) {
    console.error("[checkout] Filing engine intake sync error:", err);
    return false;
  }

  try {
    const res = await fetchWithTimeout(`${baseUrl.replace(/\/+$/, "")}/filing/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        intake_id: intakeId,
        case_type: payload.serviceType,
        county: payload.county,
        court_filing_fee: californiaConfig.filingFee,
        fee_waiver_requested: californiaConfig.waiverAvailable,
      }),
    });
    if (!res.ok) {
      console.error(`[checkout] Filing engine filing creation failed (${res.status})`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[checkout] Filing engine filing creation error:", err);
    return false;
  }
}

function getRequiredEnvironment() {
  const notionApiKey = process.env.NOTION_API_KEY;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const appBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const caseMasterApiUrl = process.env.CASE_MASTER_API_URL;
  const serviceToken = process.env.SERVICE_TOKEN;

  if (
    !notionApiKey ||
    !notionDatabaseId ||
    !stripeSecretKey ||
    !appBaseUrl ||
    !caseMasterApiUrl ||
    !serviceToken
  ) {
    return null;
  }

  try {
    const url = new URL(appBaseUrl);
    if (url.protocol !== "https:" && url.hostname !== "localhost") return null;
    return { notionApiKey, notionDatabaseId, stripeSecretKey, appBaseUrl: url.origin };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isIntakePayload(body)) {
    return NextResponse.json(
      { error: "Missing or malformed intake fields or required acknowledgement" },
      { status: 422 }
    );
  }

  const payload = body;
  const county = californiaCounties.find(
    (name) => name.toLowerCase() === payload.county.trim().toLowerCase()
  );
  const currentYear = new Date().getUTCFullYear();
  if (
    payload.state !== californiaConfig.state ||
    !county ||
    !payload.fullName.trim() ||
    !isAdultDateOfBirth(payload.dob) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim()) ||
    !payload.caseNumber.trim() ||
    !/^(19\d{2}|20\d{2})$/.test(payload.year) ||
    Number(payload.year) > currentYear ||
    !payload.charge.trim() ||
    !payload.disposition.trim()
  ) {
    return NextResponse.json(
      { error: "Check your California intake details, including required fields and age eligibility." },
      { status: 422 }
    );
  }

  const env = getRequiredEnvironment();
  if (!env) {
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable. Please contact support." },
      { status: 503 }
    );
  }

  const notion = new Client({ auth: env.notionApiKey });
  const stripe = new Stripe(env.stripeSecretKey);
  const serviceFeeAmount = serviceFees[payload.serviceType];
  const courtFeeAmount = californiaConfig.filingFee;
  const totalAmount = courtFeeAmount + serviceFeeAmount;
  const activeFlags = Object.entries(payload.flags)
    .filter(([, value]) => value)
    .map(([name]) => name)
    .join(", ");

  let recordId: string;
  try {
    const page = await notion.pages.create({
      parent: { database_id: env.notionDatabaseId },
      properties: {
        Name: { title: [{ text: { content: payload.fullName.trim() } }] },
        Email: { email: payload.email.trim() },
        Phone: { phone_number: payload.phone.trim() || null },
        State: { select: { name: californiaConfig.state } },
        DOB: { date: { start: payload.dob } },
        "Case Number": { rich_text: [{ text: { content: payload.caseNumber.trim() } }] },
        County: { rich_text: [{ text: { content: county } }] },
        Year: { rich_text: [{ text: { content: payload.year } }] },
        Charge: { rich_text: [{ text: { content: payload.charge.trim() } }] },
        Disposition: { rich_text: [{ text: { content: payload.disposition.trim() } }] },
        "Service Type": { select: { name: payload.serviceType } },
        "Service Fee": { number: serviceFeeAmount },
        "Filing Fee": { number: courtFeeAmount },
        "Waiver Available": { checkbox: californiaConfig.waiverAvailable },
        Flags: { rich_text: [{ text: { content: activeFlags || "None" } }] },
        "Legal Acknowledged": { checkbox: true },
        "Legal Acknowledged At": { date: { start: new Date().toISOString() } },
        "Payment Status": { select: { name: "Pending" } },
      },
    });
    recordId = page.id;
  } catch (err) {
    console.error("Notion write failed during checkout submission", err);
    return NextResponse.json(
      { error: "We couldn't save your intake record. Please try again shortly." },
      { status: 502 }
    );
  }

  const filingReady = await syncToFilingEngine({ recordId, payload: { ...payload, county } });
  if (!filingReady) {
    return NextResponse.json(
      { error: "We cannot accept payment for this county right now. Please contact support." },
      { status: 503 }
    );
  }

  try {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `${californiaConfig.state} Court Filing Fee` },
          unit_amount: courtFeeAmount * 100,
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "usd",
          product_data: { name: `${payload.serviceType} Service Fee` },
          unit_amount: serviceFeeAmount * 100,
        },
        quantity: 1,
      },
    ];
    const successUrl = new URL("/confirmation", env.appBaseUrl);
    successUrl.searchParams.set("id", recordId);
    successUrl.searchParams.set("token", payload.intakeToken);
    const cancelUrl = new URL("/checkout", env.appBaseUrl);
    cancelUrl.searchParams.set("token", payload.intakeToken);
    cancelUrl.searchParams.set("canceled", "1");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: { notionRecordId: recordId },
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
    });
    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return NextResponse.json({
      ok: true,
      recordId,
      checkoutUrl: session.url,
      totalAmount,
    });
  } catch (err) {
    console.error("Stripe checkout session creation failed", err);
    return NextResponse.json(
      { error: "Your intake was saved, but payment setup failed. Please contact support." },
      { status: 502 }
    );
  }
}
