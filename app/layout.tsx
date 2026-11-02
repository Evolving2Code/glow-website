import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const description =
  "Commercial LED lighting for warehouses, offices, parking lots and more. Access to 60+ suppliers, VE pricing up to 30% below industry standard, free shipping on almost every order, plus design layouts and audits.";

export const metadata: Metadata = {
  metadataBase: new URL("https://glowledlighting.com"),
  title: "Glow LED Lighting | Commercial LED Solutions",
  description,
  openGraph: {
    title: "Glow LED Lighting | Commercial LED Solutions",
    description,
    url: "https://glowledlighting.com",
    siteName: "Glow LED Lighting",
    type: "website",
    images: [{ url: "/assets/hero-warehouse-v2.jpg", width: 1792, height: 2400, alt: "Warehouse lit by LED high bays" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:font-semibold"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
