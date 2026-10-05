import type { Metadata } from "next";
import { DISCLOSURE_SHORT } from "../components/legal-disclosure";

export const metadata: Metadata = { title: "Disclaimer | My-Clean-Slate" };

export default function DisclaimerPage() {
  return (
    <main className="py-10 px-4">
      <article className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-3 text-gray-700 leading-relaxed [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_h2]:text-gray-900">
        <h1 className="text-3xl font-extrabold text-indigo-700">Disclaimer</h1>
        <p className="text-sm text-gray-500">Last updated: October 5, 2026</p>

        <h2 className="text-xl font-bold mt-6">Not a law firm. Not legal advice.</h2>
        <p>{DISCLOSURE_SHORT}</p>
        <p>
          My-Clean-Slate LLC (“My-Clean-Slate”, “we”) is a technology service. Our founder is
          not an attorney, and no one at My-Clean-Slate is acting as your attorney. We cannot
          tell you whether you are eligible for relief, which remedy to pursue, or how a court
          will rule. Only a licensed attorney can give you legal advice about your specific
          situation.
        </p>

        <h2 className="text-xl font-bold mt-6">What we do</h2>
        <p>
          Based solely on the information you enter, our software assembles California Judicial
          Council and county-specific forms (for example petitions for dismissal under Penal
          Code § 1203.4, record sealing under Penal Code § 851.91, felony reduction under
          Penal Code § 17(b), and early termination of probation) together with general filing
          instructions for the county you select.
        </p>

        <h2 className="text-xl font-bold mt-6">What we do not do</h2>
        <ul>
          <li>We do not represent you in court or communicate with the court on your behalf.</li>
          <li>We do not review your criminal history or determine your eligibility.</li>
          <li>We do not guarantee that any petition will be granted or that your record will be cleared.</li>
          <li>We do not select legal strategies or choose which forms are right for you; the selections are yours.</li>
        </ul>

        <h2 className="text-xl font-bold mt-6">Your responsibilities</h2>
        <p>
          You are responsible for the accuracy of the information you provide, for reviewing
          every document before signing, and for filing documents with the correct court and
          paying any court fees. Court filing fees shown in this service are estimates and are
          set by the courts, not by us.
        </p>

        <h2 className="text-xl font-bold mt-6">California only</h2>
        <p>
          Our document packets are prepared for California superior courts. Laws differ by
          state and change over time; nothing on this site should be relied on for matters
          outside California.
        </p>

        <h2 className="text-xl font-bold mt-6">Need legal advice?</h2>
        <p>
          Contact a licensed California attorney, your county public defender’s office (many
          offer free Clean Slate clinics), or the State Bar of California’s lawyer referral
          service.
        </p>

        <p className="text-sm text-gray-500 mt-8">
          Questions about this notice: <a href="https://www.my-clean-slate.com/contact">contact us</a>.
        </p>
      </article>
    </main>
  );
}
