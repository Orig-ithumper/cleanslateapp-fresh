"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LegalDisclosure from "./components/legal-disclosure";
import {
  californiaConfig,
  californiaCounties,
  isAdultDateOfBirth,
  serviceFees,
} from "../lib/intake-config";

const serviceTypeOptions = [
  {
    value: "Expungement",
    label: "Expungement",
    fee: serviceFees.Expungement,
    description: "Complete packet + county-specific forms + filing instructions.",
  },
  {
    value: "Record Sealing",
    label: "Record Sealing",
    fee: serviceFees["Record Sealing"],
    description: "For eligible arrests or cases that didn't result in conviction.",
  },
  {
    value: "Felony Reduction (17(b))",
    label: "Felony Reduction (17(b))",
    fee: serviceFees["Felony Reduction (17(b))"],
    description: "Reduce eligible felonies to misdemeanors.",
  },
  {
    value: "Early Termination of Probation",
    label: "Early Termination of Probation",
    fee: serviceFees["Early Termination of Probation"],
    description: "Shorten probation and unlock opportunities sooner.",
  },
];

type Flags = {
  warrants: boolean;
  pending: boolean;
  priorExpungements: boolean;
  federal: boolean;
  sexOffense: boolean;
  violentOffense: boolean;
};

export default function DynamicIntakeForm() {
  const router = useRouter();
  const [serviceType, setServiceType] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [county, setCounty] = useState("");
  const [year, setYear] = useState("");
  const [charge, setCharge] = useState("");
  const [disposition, setDisposition] = useState("");
  const [flags, setFlags] = useState<Flags>({
    warrants: false,
    pending: false,
    priorExpungements: false,
    federal: false,
    sexOffense: false,
    violentOffense: false,
  });

  const config = selectedState === californiaConfig.state ? californiaConfig : null;

  const selectedService = serviceTypeOptions.find((s) => s.value === serviceType) || null;
  const serviceFee = selectedService ? selectedService.fee : 0;
  const totalDue = (config?.filingFee ?? 0) + serviceFee;
  const canContinue =
    Boolean(
      selectedService &&
      config &&
      acknowledged &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
      fullName.trim() &&
      isAdultDateOfBirth(dob) &&
      caseNumber.trim() &&
      county &&
      Number(year) >= 1900 &&
      Number(year) <= new Date().getUTCFullYear() &&
      charge.trim() &&
      disposition.trim()
    );

  const handleSubmit = () => {
    if (!canContinue || !selectedService || !config) return;
    const token =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
    const payload = {
      serviceType,
      state: selectedState,
      fullName,
      dob,
      email,
      phone,
      caseNumber,
      county,
      year,
      charge,
      disposition,
      flags,
      acknowledged,
      intakeToken: token,
    };
    sessionStorage.setItem(`intake:${token}`, JSON.stringify(payload));
    router.push(`/checkout?token=${token}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-6">
          Expungement Intake Form
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Your answers allow us to generate county-specific California record-relief paperwork.
        </p>
        <LegalDisclosure variant="banner" className="mb-8" />

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Select Your Service</label>
          <div className="space-y-2">
            {serviceTypeOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-start justify-between gap-3 border rounded-md px-3 py-3 cursor-pointer"
              >
                <span className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="serviceType"
                    value={opt.value}
                    checked={serviceType === opt.value}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block font-medium">{opt.label}</span>
                    <span className="block text-sm text-gray-500">{opt.description}</span>
                  </span>
                </span>
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">${opt.fee}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Select Your State</label>
          <p className="text-xs text-gray-500 mb-2">We currently serve California only. Checkout is available only for counties with an active filing workflow.</p>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Choose a state…</option>
            <option value={californiaConfig.state}>{californiaConfig.state}</option>
          </select>
          {config && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-md space-y-1">
              <p className="font-semibold text-indigo-700">
                Court Filing Fee: ${config.filingFee}
              </p>
              <p className="text-sm text-gray-700">
                Waiver Available: {config.waiverAvailable ? "Yes" : "No"}
              </p>
              {selectedService && (
                <>
                  <p className="text-sm text-gray-700">
                    Service Fee ({selectedService.label}): ${serviceFee}
                  </p>
                  <p className="font-semibold text-indigo-700 border-t border-indigo-200 pt-1 mt-1">
                    Total Due: ${totalDue}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4 mb-10">
          <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
          <input type="text" placeholder="Full Legal Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full border rounded-md px-3 py-2" />
          <input type="date" aria-label="Date of birth" value={dob} onChange={(e) => setDob(e.target.value)} max={new Date().toISOString().slice(0, 10)} required className="w-full border rounded-md px-3 py-2" />
          {dob && !isAdultDateOfBirth(dob) && (
            <p className="text-sm text-red-600">Applicants must be at least 18 years old.</p>
          )}
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded-md px-3 py-2" />
          <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </div>
        {config && (
          <div className="space-y-4 mb-10">
            <h2 className="text-xl font-bold text-gray-800">Record Details</h2>
            <input type="text" placeholder="Case Number" value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} required className="w-full border rounded-md px-3 py-2" />
            <select aria-label="County of conviction" value={county} onChange={(e) => setCounty(e.target.value)} required className="w-full border rounded-md px-3 py-2">
              <option value="">Choose a California county…</option>
              {californiaCounties.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
            <input type="number" placeholder="Year of Conviction" min="1900" max={new Date().getFullYear()} value={year} onChange={(e) => setYear(e.target.value)} required className="w-full border rounded-md px-3 py-2" />
            <input type="text" placeholder="Charge" value={charge} onChange={(e) => setCharge(e.target.value)} required className="w-full border rounded-md px-3 py-2" />
            <input type="text" placeholder="Disposition" value={disposition} onChange={(e) => setDisposition(e.target.value)} required className="w-full border rounded-md px-3 py-2" />
          </div>
        )}
        {config && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Eligibility Flags</h2>
            {(Object.keys(flags) as (keyof Flags)[]).map((key) => (
              <label key={key} className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  checked={flags[key]}
                  onChange={() => setFlags((prev) => ({ ...prev, [key]: !prev[key] }))}
                />
                <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              </label>
            ))}
          </div>
        )}
        <label className="flex items-start gap-3 mb-6 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-1"
            aria-describedby="ack-help"
          />
          <span id="ack-help">
            I understand that My-Clean-Slate is an automated document generation system, not a
            law firm; that it does not provide legal advice; and that no attorney-client
            relationship is created. I have read the{" "}
            <a href="/terms" className="underline" target="_blank" rel="noopener noreferrer">Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy" className="underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
          </span>
        </label>
        <button
          onClick={handleSubmit}
          disabled={!canContinue}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow disabled:opacity-50"
        >
          Continue to Checkout
        </button>
      </div>
    </main>
  );
}
