import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import Stripe from "stripe";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type IntakePayload = {
  serviceType: string;
  serviceFee: string;
  state: string;
  fee: string;
  waiver: string;
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
};

function isIntakePayload(value: unknown): value is IntakePayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.serviceType === "string" &&
    typeof v.serviceFee === "string" &&
    typeof v.state === "string" &&
    typeof v.fee === "string" &&
    typeof v.fullName === "string" &&
    typeof v.email === "string" &&
    typeof v.flags === "object" &&
    v.flags !== null
  );
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
      { error: "Missing or malformed intake fields" },
      { status: 422 }
    );
  }

  const payload = body;

  if (!payload.fullName.trim() || !payload.email.trim() || !payload.state || !payload.serviceType) {
    return NextResponse.json(
      { error: "Service type, full name, email, and state are required" },
      { status: 422 }
    );
  }

  const courtFeeAmount = Number(payload.fee) || 0;
  const serviceFeeAmount = Number(payload.serviceFee) || 0;
  const totalAmount = courtFeeAmount + serviceFeeAmount;

  const activeFlags = Object.entries(payload.flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(", ");

  let recordId: string;
  try {
    const page = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID! },
      properties: {
        "Name": { title: [{ text: { content: payload.fullName } }] },
        Email: { email: payload.email || null },
        Phone: { phone_number: payload.phone || null },
        State: { select: { name: payload.state } },
        DOB: payload.dob ? { date: { start: payload.dob } } : { date: null },
        "Case Number": { rich_text: [{ text: { content: payload.caseNumber } }] },
        County: { rich_text: [{ text: { content: payload.county } }] },
        Year: { rich_text: [{ text: { content: payload.year } }] },
        Charge: { rich_text: [{ text: { content: payload.charge } }] },
        Disposition: { rich_text: [{ text: { content: payload.disposition } }] },
        "Service Type": { select: { name: payload.serviceType } },
        "Service Fee": { number: serviceFeeAmount },
        "Filing Fee": { number: courtFeeAmount },
        "Waiver Available": { checkbox: payload.waiver === "true" },
        Flags: { rich_text: [{ text: { content: activeFlags || "None" } }] },
        "Payment Status": {
          select: { name: "Pending" },
        },
      },
    });
    recordId = page.id;
  } catch (err) {
    console.error("Notion write failed during checkout submission", err);
    return NextResponse.json(
      { error: "We couldn't save your intake record. Please try again shortly.", debug: String((err as Error)?.message || err) },
      { status: 502 }
    );
  }

  let checkoutUrl: string | null = null;
  try {
    if (totalAmount > 0) {
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      if (courtFeeAmount > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: { name: `${payload.state} Court Filing Fee` },
            unit_amount: Math.round(courtFeeAmount * 100),
          },
          quantity: 1,
        });
      }

      if (serviceFeeAmount > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: { name: `${payload.serviceType} Service Fee` },
            unit_amount: Math.round(serviceFeeAmount * 100),
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: lineItems,
        metadata: { notionRecordId: recordId },
        success_url: process.env.NEXT_PUBLIC_BASE_URL + "/confirmation?id=" + recordId,
        cancel_url: process.env.NEXT_PUBLIC_BASE_URL + "/checkout",
      });
      checkoutUrl = session.url;
    }
  } catch (err) {
    console.error("Stripe checkout session creation failed", err);
    return NextResponse.json(
      { error: "Your intake was saved, but payment setup failed. Please contact support." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, recordId, checkoutUrl });
}
