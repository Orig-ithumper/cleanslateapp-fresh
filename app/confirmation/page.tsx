"use client";

import { useEffect } from "react";
import LegalDisclosure from "../components/legal-disclosure";

export default function ConfirmationPage() {
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      sessionStorage.removeItem(`intake:${token}`);
      sessionStorage.removeItem(`intake-record:${token}`);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-3">Payment Successful</h1>
        <p className="text-gray-700 mb-2">
          Thank you. Your payment has been received and your intake has been submitted
          successfully.
        </p>
        <p className="text-gray-700 mb-6">
          You may close this page. We will prepare your documents from the answers you
          provided and contact you at the email address on file.
        </p>
        <LegalDisclosure />
      </div>
    </main>
  );
}
