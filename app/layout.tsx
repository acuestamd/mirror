import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mirror — a consent-locked self-screening companion",
  description:
    "Connect your own X account to privately review the symptom-domain signals in your own posts. Screening signals, not a diagnosis. You can only ever screen yourself.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
