import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import Stripe from "stripe";
import {
  californiaConfig,
  californiaCounties,
  serviceFees,
  type ServiceType,
} from "../../../../lib/intake-config";

export const runtime = "nodejs";
export const maxDuration = 5;

function textProperty(
  property: { type: string; rich_text?: Array<{ plain_text: string }> } | undefined
): string | null {
  return property?.type === "rich_text"
    ? property.rich_text?.map((part) => part.plain_text).join("") ?? ""
    : null;
}

function selectProperty(
  property: { type: string; select?: { name: string } | null } | undefined
): string | null {
  return property?.type === "select" ? property.select?.name ?? null : null;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid checkout retry" }, { status: 422 });
  }
  const { recordId, intakeToken } = body as Record<string, unknown>;
  if (
    typeof recordId !== "string" ||
    !/^[\da-f-]{32,36}$/i.test(recordId) ||
    typeof intakeToken !== "string" ||
    !/^[\w-]{8,80}$/.test(intakeToken)
  ) {
    return NextResponse.json({ error: "Invalid checkout retry" }, { status: 422 });
  }

  const notionApiKey = process.env.NOTION_API_KEY;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;
  const appBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!notionApiKey || !stripeSecretKey || !notionDatabaseId || !appBaseUrl) {
    return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 503 });
  }

  let appOrigin: string;
  try {
    const url = new URL(appBaseUrl);
    if (url.protocol !== "https:" && url.hostname !== "localhost") throw new Error("Invalid URL");
    appOrigin = url.origin;
  } catch {
    return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 503 });
  }

  try {
    const notion = new Client({ auth: notionApiKey });
    const page = await notion.pages.retrieve({ page_id: recordId });
    if (!("properties" in page)) {
      return NextResponse.json({ error: "This checkout cannot be resumed." }, { status: 404 });
    }

    const properties = page.properties;
    const savedToken = textProperty(properties["Intake Token"]);
    const state = selectProperty(properties.State);
    const county = textProperty(properties.County);
    const serviceType = selectProperty(properties["Service Type"]);
    const legalAcknowledged = properties["Legal Acknowledged"];
    const paymentStatus = selectProperty(properties["Payment Status"]);

    if (
      savedToken !== intakeToken ||
      state !== californiaConfig.state ||
      !county ||
      !californiaCounties.includes(county as (typeof californiaCounties)[number]) ||
      !serviceType ||
      !Object.prototype.hasOwnProperty.call(serviceFees, serviceType) ||
      legalAcknowledged?.type !== "checkbox" ||
      !legalAcknowledged.checkbox ||
      paymentStatus !== "Pending"
    ) {
      return NextResponse.json({ error: "This checkout cannot be resumed." }, { status: 404 });
    }

    const service = serviceType as ServiceType;
    const stripe = new Stripe(stripeSecretKey);
    const successUrl = new URL("/confirmation", appOrigin);
    successUrl.searchParams.set("id", recordId);
    successUrl.searchParams.set("token", intakeToken);
    const cancelUrl = new URL("/checkout", appOrigin);
    cancelUrl.searchParams.set("token", intakeToken);
    cancelUrl.searchParams.set("canceled", "1");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `${californiaConfig.state} Court Filing Fee` },
            unit_amount: californiaConfig.filingFee * 100,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "usd",
            product_data: { name: `${service} Service Fee` },
            unit_amount: serviceFees[service] * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { notionRecordId: recordId },
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
    });
    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return NextResponse.json({ ok: true, checkoutUrl: session.url });
  } catch (err) {
    console.error("[checkout] Checkout retry failed:", err);
    return NextResponse.json({ error: "Unable to restart payment. Please contact support." }, { status: 502 });
  }
}
