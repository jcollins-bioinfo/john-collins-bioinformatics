import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact John Patrick Collins by email or GitHub.",
};

export default function ContactPage() {
  return (
    <main id="top" className="interior-page contact-page">
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
    </main>
  );
}
