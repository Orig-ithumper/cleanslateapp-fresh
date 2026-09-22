"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const stateConfig = {
  California: { fee: 120, requiresCaseNumber: true, requiresCounty: true, waiverAvailable: true },
  Pennsylvania: { fee: 0, requiresCaseNumber: true, requiresCounty: false, waiverAvailable: false },
  Texas: { fee: 100, requiresCaseNumber: true, requiresCounty: true, waiverAvailable: false },
  Michigan: { fee: 0, requiresCaseNumber: true, requiresCounty: true, waiverAvailable: false },
  Florida: { fee: 100, requiresCaseNumber: true, requiresCounty: true, waiverAvailable: false },
  Utah: { fee: 0, requiresCaseNumber: true, requiresCounty: false, waiverAvailable: false },
  Oregon: { fee: 75, requiresCaseNumber: true, requiresCounty: true, waiverAvailable: true },
  NewYork: { fee: 95, requiresCaseNumber: true, requiresCounty: true, waiverAvailable: false },
};

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

  const config = selectedState
    ? stateConfig[selectedState as keyof typeof stateConfig]
    : null;

  const handleSubmit = () => {
    if (!selectedState || !config) return;
    const payload = {
      state: selectedState,
      fee: String(config.fee),
      waiver: String(config.waiverAvailable),
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
    };
    const token =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
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
          Your answers allow us to generate state-specific expungement paperwork.
        </p>
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Select Your State</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Choose a state…</option>
            {Object.keys(stateConfig).map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
          {config && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-md">
              <p className="font-semibold text-indigo-700">
                Court Filing Fee: {config.fee === 0 ? "None" : `$${config.fee}`}
              </p>
              <p className="text-sm text-gray-700">
                Waiver Available: {config.waiverAvailable ? "Yes" : "No"}
              </p>
            </div>
          )}
        </div>
        <div className="space-y-4 mb-10">
          <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
          <input type="text" placeholder="Full Legal Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </div>
        {config && (
          <div className="space-y-4 mb-10">
            <h2 className="text-xl font-bold text-gray-800">Record Details</h2>
            {config.requiresCaseNumber && (
              <input type="text" placeholder="Case Number" value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} className="w-full border rounded-md px-3 py-2" />
            )}
            {config.requiresCounty && (
              <input type="text" placeholder="County of Conviction" value={county} onChange={(e) => setCounty(e.target.value)} className="w-full border rounded-md px-3 py-2" />
            )}
            <input type="number" placeholder="Year of Conviction" value={year} onChange={(e) => setYear(e.target.value)} className="w-full border rounded-md px-3 py-2" />
            <input type="text" placeholder="Charge" value={charge} onChange={(e) => setCharge(e.target.value)} className="w-full border rounded-md px-3 py-2" />
            <input type="text" placeholder="Disposition" value={disposition} onChange={(e) => setDisposition(e.target.value)} className="w-full border rounded-md px-3 py-2" />
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
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
        >
          Continue to Checkout
        </button>
      </div>
    </main>
  );
}
