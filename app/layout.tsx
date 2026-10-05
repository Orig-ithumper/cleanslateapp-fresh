import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteFooter from "./components/site-footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "My-Clean-Slate | Expungement & Record Relief Intake",
  description:
    "Start your California expungement, record sealing, felony reduction, or early termination of probation paperwork. Automated document generation system - not a law firm.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable + " font-sans antialiased bg-gray-50 flex min-h-screen flex-col"}>
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
