import type { Metadata } from "next";
import { Lato, Montserrat, Oswald } from "next/font/google";
import { SiteFooter, SiteHeader } from "./components/site-chrome";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://johnpatrickcollins.info"),
  title: {
    default: "John Patrick Collins | Science, Software, Music & Research",
    template: "%s | John Patrick Collins",
  },
  description:
    "The personal site of John Patrick Collins: bioinformatics, scientific software, independent research, music, writing, and ongoing projects.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${montserrat.variable} ${oswald.variable}`}
    >
      <body
        className={`${lato.className} antialiased`}
      >
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
