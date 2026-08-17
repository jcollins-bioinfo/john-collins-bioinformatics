import type { Metadata } from "next";
import Script from "next/script";

const TURNSTILE_SITE_KEY = "0x4AAAAAAERzVqx-2DEjWWLa";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact John Patrick Collins by email or GitHub.",
};

export default function ContactPage() {
  return (
    <main id="top" className="interior-page contact-page">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <section className="contact-hero shell" aria-labelledby="contact-title">
        <p className="eyebrow"><span /> Contact</p>
        <h1 id="contact-title">Contact</h1>
        <p>Feel free to get in touch.</p>
      </section>
      <section className="shell contact-grid page-section" aria-label="Contact links">
        <a href="mailto:jcollins.bioinformatics@gmail.com">
          <span>EMAIL</span>
          <h2>jcollins.bioinformatics@gmail.com ↗</h2>
        </a>
        <a href="https://github.com/jcollins-bioinfo" target="_blank" rel="noopener noreferrer">
          <span>GITHUB</span>
          <h2>github.com/jcollins-bioinfo ↗</h2>
        </a>
      </section>
      <section className="shell contact-verification" aria-labelledby="verification-title">
        <div>
          <p className="small-label">Spam prevention</p>
          <h2 id="verification-title">Human verification</h2>
          <p>This privacy-preserving check helps keep automated traffic away from the contact page.</p>
        </div>
        <div
          className="cf-turnstile"
          data-sitekey={TURNSTILE_SITE_KEY}
          data-theme="light"
          data-size="flexible"
        />
      </section>
    </main>
  );
}
