import type { Metadata, Viewport } from "next";
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
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1717",
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
      <head>
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=2" color="#0a1717" />
      </head>
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
