import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact John Patrick Collins about bioinformatics, scientific software, research, writing, or music.",
};

export default function ContactPage() {
  return (
    <main id="top" className="interior-page contact-page">
      <section className="contact-hero shell">
        <p className="eyebrow"><span /> Contact</p>
        <h1>Start with the<br /><em>interesting question.</em></h1>
        <p>I’m glad to hear about bioinformatics and scientific-software work, research conversations, technical collaborations, writing, and music.</p>
      </section>
      <section className="shell contact-grid page-section">
        <a href="mailto:jcollins.bioinformatics@gmail.com"><span>EMAIL / PRIMARY</span><h2>jcollins.bioinformatics<br />@gmail.com</h2><b>Write an email ↗</b></a>
        <a href="https://github.com/jcollins-bioinfo" target="_blank" rel="noreferrer"><span>CODE / PUBLIC</span><h2>github.com/<br />jcollins-bioinfo</h2><b>Visit GitHub ↗</b></a>
      </section>
      <section className="shell contact-note"><span>NOTE</span><p>For the clearest reply, include the context, the decision or problem at hand, and what a useful next step would look like.</p></section>
    </main>
  );
}

