import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Client } from "@notionhq/client";
import { paymentConfirmationEmail } from "../../../../lib/email/Payment-Confirmation";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const notion = new Client({ auth: process.env.NOTION_API_KEY });

function getTitle(property: any): string {
  return property?.title
    ?.map((item: any) => item?.plain_text || item?.text?.content || "")
    .join("") || "";
}

function getRichText(property: any): string {
  return property?.rich_text
    ?.map((item: any) => item?.plain_text || item?.text?.content || "")
    .join("") || "";
}

function formatMoney(value: number | null | undefined): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed", err);

    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const recordId = session.metadata?.notionRecordId;

  if (!recordId) {
    console.warn("Completed checkout is missing notionRecordId metadata");

    return NextResponse.json({ received: true });
  }

  try {
    await notion.pages.update({
      page_id: recordId,
      properties: {
        "Payment Status": {
          select: {
            name: "Paid",
          },
        },
      },
    });

    const notionPage = (await notion.pages.retrieve({
      page_id: recordId,
    })) as any;

    const properties = notionPage.properties;

    const customerName = getTitle(properties.Name);
    const customerEmail = properties.Email?.email || "";
    const customerFirstName =
      customerName.trim().split(/\s+/)[0] || "Customer";

    if (!customerEmail) {
      throw new Error("Notion record does not contain a customer email");
    }

    const emailHtml = paymentConfirmationEmail({
      customerFirstName,
      customerName,
      customerEmail,
      orderId: session.id,
      serviceType: properties["Service Type"]?.select?.name || "Not provided",
      county: getRichText(properties.County) || "Not provided",
      caseNumber: getRichText(properties["Case Number"]) || "Not provided",
      paymentDate: new Date(session.created * 1000).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      ),
      serviceFee: formatMoney(properties["Service Fee"]?.number),
      estimatedCourtFilingFee: formatMoney(
        properties["Filing Fee"]?.number
      ),
    });

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `payment-confirmation/${session.id}`,
      },
      body: JSON.stringify({
        from: "My-Clean-Slate <payments@notifications.my-clean-slate.com>",
        to: [customerEmail],
        subject: "Payment Confirmed | My-Clean-Slate",
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();

      throw new Error(
        `Resend email failed (${resendResponse.status}): ${resendError}`
      );
    }

    console.log(
      `Payment confirmation email sent for Stripe session ${session.id}`
    );

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(
      "Failed to process completed Stripe checkout",
      err
    );

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
