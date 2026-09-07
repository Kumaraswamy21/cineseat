import type { Metadata } from "next";
import Link from "next/link";
import { AxeDevTools } from "@/components/AxeDevTools";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineSeat",
  description: "Accessible cinema seat selection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {process.env.NODE_ENV === "development" ? <AxeDevTools /> : null}
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <header className="site-header">
          <Link href="/" className="brand">
            CineSeat
          </Link>
        </header>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
