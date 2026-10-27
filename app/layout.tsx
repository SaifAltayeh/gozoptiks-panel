import type { Metadata } from "next";
import "./reset.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — gözoptik",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
