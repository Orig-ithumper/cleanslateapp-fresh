import LegalDisclosure from "./legal-disclosure";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        <LegalDisclosure variant="footer" />
        <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-600">
          <a href="/disclaimer" className="hover:underline">Disclaimer</a>
          <a href="/terms" className="hover:underline">Terms of Service</a>
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="https://www.my-clean-slate.com/contact" className="hover:underline">Contact</a>
          <a href="https://www.my-clean-slate.com" className="hover:underline">my-clean-slate.com</a>
        </nav>
        <p className="text-xs text-gray-400">© {year} My-Clean-Slate LLC. Serving all 58 California counties.</p>
      </div>
    </footer>
  );
}
