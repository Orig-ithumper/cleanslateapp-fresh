"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LegalDisclosure from "../components/legal-disclosure";

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
  contactMethod: string;
  caseNumber: string;
  county: string;
  year: string;
  charge: string;
  disposition: string;
  signature: string | null;
  flags: Record<string, boolean>;
};

function CheckoutPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<IntakePayload | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    const token = searchParams.get("token");
    if (!token) { setNotFound(true); return; }
    const raw = sessionStorage.getItem("intake:" + token);
    if (!raw) { setNotFound(true); return; }
    setData(JSON.parse(raw));
    sessionStorage.removeItem("intake:" + token);
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!data) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setSubmitError(result.error ?? "Submission failed. Please try again.");
        return;
      }
      if (result.checkoutUrl) window.location.href = result.checkoutUrl;
      else router.push("/confirmation?id=" + result.recordId);
    } catch {
      setSubmitError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (notFound) return <main className="min-h-screen bg-gray-50 py-10 px-4"><div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-8 text-center"><h1 className="text-xl font-bold text-gray-800 mb-3">We couldn&apos;t find your intake details</h1><p className="text-gray-600 mb-6">Your session may have expired, or this link was opened in a new tab. Please start over from the intake form.</p><button onClick={() => router.push("/")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow">Back to Intake Form</button></div></main>;
  if (!data) return <main className="min-h-screen bg-gray-50 py-10 px-4">Loading…</main>;

  const activeFlags = Object.entries(data.flags).filter(([, value]) => value).map(([key]) => key.replace(/([A-Z])/g, " $1").trim());
  const courtFee = Number(data.fee) || 0;
  const serviceFee = Number(data.serviceFee) || 0;
  const totalDue = serviceFee;
  const rowClass = "grid grid-cols-[220px_1fr] gap-x-6 gap-y-2 text-sm items-baseline";
  const labelClass = "text-gray-500";
  const valueClass = "text-gray-900 min-w-0 break-words";

  return <main className="min-h-screen bg-gray-50 py-10 px-4"><div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
    <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">Review & Checkout</h1>
    <p className="text-gray-600 mb-8">Please confirm your details before proceeding to payment.</p>
    <section className="mb-8"><h2 className="text-lg font-bold text-gray-800 mb-3">State & Filing</h2><dl className={rowClass}>
      <dt className={labelClass}>Service</dt><dd className={valueClass}>{data.serviceType || "—"}</dd>
      <dt className={labelClass}>State</dt><dd className={valueClass}>{data.state || "—"}</dd>
      <dt className={labelClass}>Estimated Court Filing Fee</dt><dd className={valueClass}>{courtFee === 0 ? "None" : "$" + courtFee.toFixed(2)}</dd>
      <dt className={labelClass}>Waiver Available</dt><dd className={valueClass}>{data.waiver === "true" ? "Yes" : "No"}</dd>
      <dt className={labelClass}>Service Fee</dt><dd className={valueClass}>${serviceFee.toFixed(2)}</dd>
      <dt className="text-gray-700 font-semibold border-t pt-2 mt-1">Service Fee Due Now</dt><dd className="font-semibold text-gray-900 border-t pt-2 mt-1">${totalDue.toFixed(2)}</dd>
    </dl></section>
    <section className="mb-8"><h2 className="text-lg font-bold text-gray-800 mb-3">Personal Information</h2><dl className={rowClass}>
      <dt className={labelClass}>Full Name</dt><dd className={valueClass}>{data.fullName || "—"}</dd>
      <dt className={labelClass}>Date of Birth</dt><dd className={valueClass}>{data.dob || "—"}</dd>
      <dt className={labelClass}>Email</dt><dd className={valueClass}>{data.email || "—"}</dd>
      <dt className={labelClass}>Phone</dt><dd className={valueClass}>{data.phone || "—"}</dd>
      <dt className={labelClass}>Preferred Contact Method</dt><dd className={valueClass}>{data.contactMethod || "—"}</dd>
    </dl></section>
    <section className="mb-8"><h2 className="text-lg font-bold text-gray-800 mb-3">Record Details</h2><dl className={rowClass}>
      <dt className={labelClass}>Case Number</dt><dd className={valueClass}>{data.caseNumber || "—"}</dd>
      <dt className={labelClass}>County</dt><dd className={valueClass}>{data.county || "—"}</dd>
      <dt className={labelClass}>Year</dt><dd className={valueClass}>{data.year || "—"}</dd>
      <dt className={labelClass}>Charge</dt><dd className={valueClass}>{data.charge || "—"}</dd>
      <dt className={labelClass}>Disposition</dt><dd className={valueClass}>{data.disposition || "—"}</dd>
    </dl></section>
    {activeFlags.length > 0 && <section className="mb-8"><h2 className="text-lg font-bold text-gray-800 mb-3">Flagged Items</h2><ul className="list-disc list-inside text-sm text-gray-700">{activeFlags.map(f => <li key={f} className="capitalize">{f}</li>)}</ul></section>}
    <LegalDisclosure className="mb-4" />
    {submitError && <p className="text-red-600 text-sm mb-3">{submitError}</p>}
    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow disabled:opacity-50" disabled={submitting} onClick={handleSubmit}>{submitting ? "Processing…" : "Pay $" + totalDue.toFixed(2) + " & Submit"}</button>
    <p className="mt-3 text-xs text-gray-500 text-center">By clicking Pay & Submit you agree to our <a href="/terms" className="underline">Terms of Service</a> and <a href="/privacy" className="underline">Privacy Policy</a>, and acknowledge that My-Clean-Slate is not a law firm and does not provide legal advice.</p>
  </div></main>;
}

export default function CheckoutPage() {
  return <Suspense fallback={<main className="min-h-screen bg-gray-50 py-10 px-4">Loading…</main>}><CheckoutPageInner /></Suspense>;
}
