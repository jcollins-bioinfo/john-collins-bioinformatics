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
    default: "John Patrick Collins | Bioinformatics, Scientific Software & Research",
    template: "%s | John Patrick Collins",
  },
  description:
    "John Patrick Collins is a bioinformatics data scientist, scientific software engineer, and computational biologist working across genomics, diagnostics, and reproducible research.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "John Patrick Collins",
    title: "John Patrick Collins | Bioinformatics, Scientific Software & Research",
    description: "Bioinformatics data scientist, scientific software engineer, and computational biologist.",
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "John Patrick Collins",
          url: "https://johnpatrickcollins.info",
          jobTitle: ["Bioinformatics Data Scientist", "Scientific Software Engineer", "Computational Biologist"],
          sameAs: ["https://github.com/jcollins-bioinfo", "https://www.linkedin.com/in/johncollins-bioinformatics"],
          alumniOf: { "@type": "CollegeOrUniversity", name: "University of California, Santa Cruz" },
        }) }} />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
