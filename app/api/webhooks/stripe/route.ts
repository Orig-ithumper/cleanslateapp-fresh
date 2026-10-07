import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Client } from "@notionhq/client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const notionApiKey = process.env.NOTION_API_KEY;
  if (!stripeSecretKey || !webhookSecret || !notionApiKey) {
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(stripeSecretKey);
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const recordId = session.metadata?.notionRecordId;

    if (recordId) {
      try {
        const notion = new Client({ auth: notionApiKey });
        await notion.pages.update({
          page_id: recordId,
          properties: {
            "Payment Status": { select: { name: "Paid" } },
          },
        });
      } catch (err) {
        console.error("Failed to update Notion record after payment", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}