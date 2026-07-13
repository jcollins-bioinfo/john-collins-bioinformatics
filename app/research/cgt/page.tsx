import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Constraint Geometry Theory",
  description: "An overview of Constraint Geometry Theory, John Patrick Collins’s viability-first independent research program.",
};

const questions = [
  ["01", "Viability", "Which states can a regulated system sustain under a defined class of disturbances?"],
  ["02", "Regulation", "What control policies or feedback structures keep the system inside that viable set?"],
  ["03", "Geometry", "What structure becomes visible when geometry is derived from controlled invariance rather than assumed in advance?"],
  ["04", "Prediction", "Can that structure identify failure boundaries, leverage points, and perturbational responses that can be tested?"],
];

export default function CgtPage() {
  return (
    <main id="top" className="interior-page cgt-page">
      <section className="cgt-hero">
        <div className="shell cgt-hero-grid">
          <div><p className="eyebrow"><span /> Research program / active</p><h1>Constraint<br /><em>Geometry Theory.</em></h1></div>
          <div className="cgt-premise"><span>WORKING PREMISE</span><p>Complex systems may be understood through the states they can keep viable, the disturbances they face, and the regulatory actions available to them.</p><small>Independent research program—not a claim of established theory.</small></div>
        </div>
      </section>

      <section className="shell page-section cgt-intro">
        <p className="section-index">CGT / ORIENTATION</p>
        <div className="longform-copy"><h2>Viability first. Geometry second.</h2><p>Constraint Geometry Theory is a developing framework for describing regulated systems in terms of state, disturbance, regulation, and dynamics. Its central discipline is that geometry should be derived from what a system can keep viable—not imposed as a convenient representation.</p><p>The immediate aim is modest and testable: specify the minimal formal objects, build a synthetic single-scale demonstration, and define success, failure, and null cases before mapping the framework onto bioinformatics.</p></div>
      </section>

      <section className="soft-section">
        <div className="shell page-section">
          <div className="split-heading"><p className="eyebrow"><span /> Core questions</p><h2>What the program must make explicit.</h2></div>
          <div className="question-grid">{questions.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
        </div>
      </section>

      <section className="shell page-section cgt-roadmap">
        <div><p className="eyebrow"><span /> Current sequence</p><h2>A staged route to evidence.</h2></div>
        <ol>
          <li><span>01</span><div><strong>Formal reframing</strong><p>Define the minimal primitives and the controlled-invariance structure precisely.</p></div></li>
          <li><span>02</span><div><strong>Synthetic demonstration</strong><p>Build an executable model with success, failure, and null behavior.</p></div></li>
          <li><span>03</span><div><strong>Biological mapping</strong><p>Only then test carefully scoped connections to gene regulation and perturbational data.</p></div></li>
        </ol>
      </section>

      <section className="cgt-closing"><div className="shell"><p>STATUS / JULY 2026</p><h2>In development, with falsifiability treated as a design requirement.</h2><a href="/research">Return to research index <span>↗</span></a></div></section>
    </main>
  );
}

