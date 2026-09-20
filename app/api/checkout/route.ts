import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import Stripe from "stripe";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type IntakePayload = {
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

  if (!payload.fullName.trim() || !payload.email.trim() || !payload.state) {
    return NextResponse.json(
      { error: "Full name, email, and state are required" },
      { status: 422 }
    );
  }

  const feeAmount = Number(payload.fee) || 0;
  const activeFlags = Object.entries(payload.flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(", ");

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
        Fee: { number: feeAmount },
        "Waiver Available": { checkbox: payload.waiver === "true" },
        Flags: { rich_text: [{ text: { content: activeFlags || "None" } }] },
        "Payment Status": {
          select: { name: feeAmount === 0 ? "Waived" : "Pending" },
        },
      },
    });

    const recordId = page.id;

    let checkoutUrl: string | null = null;
    if (feeAmount > 0) {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: payload.state + " Expungement Filing Fee",
              },
              unit_amount: Math.round(feeAmount * 100),
            },
            quantity: 1,
          },
        ],
        metadata: { notionRecordId: recordId },
        success_url: process.env.NEXT_PUBLIC_BASE_URL + "/confirmation?id=" + recordId,
        cancel_url: process.env.NEXT_PUBLIC_BASE_URL + "/checkout",
      });
      checkoutUrl = session.url;
    }

    return NextResponse.json({ ok: true, recordId, checkoutUrl });
  } catch (err) {
    console.error("Failed to process checkout submission", err);
    return NextResponse.json(
      { error: "Something went wrong processing your submission" },
      { status: 500 }
    );
  }
}