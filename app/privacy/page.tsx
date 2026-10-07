import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy | My-Clean-Slate" };

export default function PrivacyPage() {
  return (
    <main className="py-10 px-4">
      <article className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-3 text-gray-700 leading-relaxed [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_h2]:text-gray-900">
        <h1 className="text-3xl font-extrabold text-indigo-700">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: October 5, 2026</p>

        <p>
          My-Clean-Slate LLC (“we”, “us”) respects your privacy. This policy explains what we
          collect through this intake service, how we use it, and the choices you have.
        </p>

        <h2 className="text-xl font-bold mt-6">Information we collect</h2>
        <ul>
          <li>
            <strong>Intake details you enter:</strong> name, date of birth, email, phone, case
            number, county, year, charge, disposition and eligibility answers.
          </li>
          <li>
            <strong>Payment information:</strong> processed by Stripe. We never see or store
            your full card number. Stripe sends us a checkout completion event so we can
            update your order status.
          </li>
          <li>
            <strong>Technical data:</strong> standard server logs (IP address, browser type,
            timestamps) used for security and reliability.
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-6">How we use it</h2>
        <ul>
          <li>To generate your document packet and filing instructions.</li>
          <li>To process payment and communicate with you about your intake when needed.</li>
          <li>To maintain records of your order, document your required legal acknowledgement, and respond to your requests.</li>
          <li>To prevent fraud and keep the service secure.</li>
        </ul>
        <p>We do not sell your personal information and we do not use it for advertising.</p>

        <h2 className="text-xl font-bold mt-6">Who we share it with</h2>
        <p>
          Service providers who help us operate include Stripe (payments), Vercel (hosting),
          Notion (intake records), and our case-tracking system. These providers process data
          to operate the service. Hosting providers may also process technical connection and
          request data for security and reliability. We may disclose information when required
          by law.
        </p>

        <h2 className="text-xl font-bold mt-6">Sensitive information</h2>
        <p>
          Criminal-history details are sensitive. We collect only what is needed to prepare your
          forms, restrict access to staff who need it, and transmit it over encrypted
          connections.
        </p>

        <h2 className="text-xl font-bold mt-6">Retention</h2>
        <p>
          We keep intake records for as long as needed to complete your order and meet legal
          and accounting obligations, then delete or anonymize them.
        </p>

        <h2 className="text-xl font-bold mt-6">Your rights</h2>
        <p>
          California residents may request access to, correction of, or deletion of their
          personal information, and may ask what we have collected. To exercise these rights,{" "}
          <a href="https://www.my-clean-slate.com/contact">contact us</a>. We will verify your
          identity before acting on a request.
        </p>

        <h2 className="text-xl font-bold mt-6">Children</h2>
        <p>This service is for adults 18 and older. We do not knowingly collect data from children.</p>

        <h2 className="text-xl font-bold mt-6">Changes</h2>
        <p>We may update this policy; the “Last updated” date will change when we do.</p>
      </article>
    </main>
  );
}
