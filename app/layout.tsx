import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://glowledlighting.com"),
  title: "Glow LED Lighting — Commercial & Industrial LED, Value-Engineered",
  description:
    "High bays, UFOs, architectural linears, vapor tights and sports lighting — photometrically engineered and sourced from 60+ global suppliers at up to 30% below typical value-engineering pricing.",
  openGraph: {
    title: "Glow LED Lighting",
    description: "Light the floor. Not the budget. Commercial LED lighting, value-engineered.",
    url: "https://glowledlighting.com",
    siteName: "Glow LED Lighting",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0D11",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-glow-400 focus:px-4 focus:py-2 focus:text-obsidian-950"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
