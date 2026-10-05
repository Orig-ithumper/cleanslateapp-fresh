export const DISCLOSURE_SHORT =
  "My-Clean-Slate is an automated document generation system, not a law firm. We are not attorneys and do not provide legal advice. No attorney-client relationship is created by using this service.";

type Props = {
  variant?: "banner" | "inline" | "footer";
  className?: string;
};

/**
 * Required non-attorney disclosure. Rendered on every page via the site footer,
 * and repeated inline wherever the user makes a decision (intake, checkout).
 */
export default function LegalDisclosure({ variant = "inline", className = "" }: Props) {
  if (variant === "footer") {
    return (
      <p className={"text-xs leading-relaxed text-gray-500 " + className}>
        <span className="font-semibold text-gray-600">Important notice: </span>
        {DISCLOSURE_SHORT} Information you provide is used to prepare documents based on
        your answers; you are responsible for reviewing and filing them. If you need legal
        advice about your situation, consult a licensed California attorney.{" "}
        <a href="/disclaimer" className="underline hover:text-gray-700">Full disclaimer</a>.
      </p>
    );
  }

  const box =
    variant === "banner"
      ? "rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      : "rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700";

  return (
    <div role="note" aria-label="Non-attorney disclosure" className={box + " " + className}>
      <p className="font-semibold mb-1">Not a law firm. Not legal advice.</p>
      <p>
        {DISCLOSURE_SHORT} Read our{" "}
        <a href="/disclaimer" className="underline">Disclaimer</a>,{" "}
        <a href="/terms" className="underline">Terms of Service</a> and{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>
    </div>
  );
}
