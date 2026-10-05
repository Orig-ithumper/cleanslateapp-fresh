import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service | My-Clean-Slate" };

export default function TermsPage() {
  return (
    <main className="py-10 px-4">
      <article className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-3 text-gray-700 leading-relaxed [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_h2]:text-gray-900">
        <h1 className="text-3xl font-extrabold text-indigo-700">Terms of Service</h1>
        <p className="text-sm text-gray-500">Last updated: October 5, 2026</p>

        <p>
          These Terms govern your use of the My-Clean-Slate intake and document preparation
          service operated by My-Clean-Slate LLC (“My-Clean-Slate”, “we”, “us”). By submitting an
          intake or making a payment you agree to these Terms, our{" "}
          <a href="/privacy">Privacy Policy</a> and our <a href="/disclaimer">Disclaimer</a>.
        </p>

        <h2 className="text-xl font-bold mt-6">1. Nature of the service</h2>
        <p>
          My-Clean-Slate is an automated document generation system. We are not a law firm, we
          are not attorneys, we do not provide legal advice, and no attorney-client relationship
          is created. You make all decisions about which service to purchase and which forms to
          file. See our <a href="/disclaimer">Disclaimer</a> for details.
        </p>

        <h2 className="text-xl font-bold mt-6">2. Eligibility and accuracy</h2>
        <p>
          You must be at least 18 years old and must provide complete, truthful information.
          Documents are generated from your answers; errors in your answers will appear in your
          documents. You agree to review every document before signing or filing it.
        </p>

        <h2 className="text-xl font-bold mt-6">3. Fees and payment</h2>
        <p>
          Service fees are shown before checkout and charged through Stripe. Court filing fees
          are separate, are set by the court, and are shown as estimates. Service fees cover the
          preparation of your document packet, not any court fee, and are not contingent on the
          outcome of your petition.
        </p>

        <h2 className="text-xl font-bold mt-6">4. Refunds</h2>
        <p>
          If we are unable to generate your document packet from the information you provided,
          we will refund your service fee in full. Once a packet has been delivered, the service
          fee is non-refundable, except as required by law. Contact us within 14 days of payment
          for refund requests.
        </p>

        <h2 className="text-xl font-bold mt-6">5. No guarantee of outcome</h2>
        <p>
          Courts decide petitions. We do not guarantee that any petition will be granted, that a
          record will be cleared or sealed, or that a filing will be accepted by a clerk.
        </p>

        <h2 className="text-xl font-bold mt-6">6. Your account and communications</h2>
        <p>
          By providing an email address and phone number you consent to receive transactional
          messages about your intake. Keep your contact information current.
        </p>

        <h2 className="text-xl font-bold mt-6">7. Acceptable use</h2>
        <p>
          You may not use the service to prepare documents for another person without their
          authorization, submit false information, or interfere with the service.
        </p>

        <h2 className="text-xl font-bold mt-6">8. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, our total liability for any claim arising from
          the service is limited to the service fee you paid for the affected intake. We are not
          liable for indirect or consequential damages, missed deadlines, or court decisions.
        </p>

        <h2 className="text-xl font-bold mt-6">9. Governing law</h2>
        <p>These Terms are governed by the laws of the State of California.</p>

        <h2 className="text-xl font-bold mt-6">10. Changes</h2>
        <p>
          We may update these Terms; the “Last updated” date will change. Continued use after an
          update means you accept the revised Terms.
        </p>

        <p className="text-sm text-gray-500 mt-8">
          Questions: <a href="https://www.my-clean-slate.com/contact">contact us</a>.
        </p>
      </article>
    </main>
  );
}
