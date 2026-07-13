import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research",
  description: "Independent research by John Patrick Collins across constraint geometry, gene regulation, aging, causal inference, and AI for biology.",
};

const axes = [
  ["A", "Constraint Geometry Theory", "A viability-first framework for asking how disturbance, regulation, and dynamics determine the states a complex system can sustain.", "/research/cgt"],
  ["B", "Causal gene regulation", "Moving beyond correlations toward perturbation-informed, mechanistically interpretable models of regulatory systems.", "/bioinformatics#research"],
  ["C", "Aging and resilience", "Studying state transitions, loss of regulation, recovery, and causal hypotheses of biological aging."],
  ["D", "AI for biology", "Representation learning and predictive systems that remain connected to mechanism, intervention, and experimental test."],
];

export default function ResearchPage() {
  return (
    <main id="top" className="interior-page research-index-page">
      <section className="page-hero shell">
        <div><p className="eyebrow"><span /> Independent research</p><h1>Mechanism,<br /><em>constraint, prediction.</em></h1></div>
        <p className="page-lede">I’m interested in models that do more than classify states: systems that recover structure, expose causal leverage, and make experimentally testable predictions.</p>
      </section>

      <section className="dark-index">
        <div className="shell page-section">
          <div className="split-heading light"><p className="eyebrow"><span /> Research axes</p><h2>A program organized around intervention.</h2></div>
          <div className="research-index-list">
            {axes.map(([code, title, body, href]) => (
              <article key={code}>
                <span>AXIS / {code}</span><div><h3>{title}</h3><p>{body}</p></div>{href ? <a href={href} aria-label={`Read more about ${title}`}>↗</a> : <b>ONGOING</b>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="shell page-section research-method">
        <p className="section-index">METHOD / 01</p>
        <div className="longform-copy"><h2>From formal claim to reproducible test.</h2><p>The standard is operational: explicit definitions, traceable assumptions, quantitative predictions, null models, robustness checks, and clear failure conditions.</p><p>The research is being developed in stages—formal structure, synthetic demonstrations, and then carefully scoped applications to biological data.</p><a className="button primary" href="/research/cgt">Read the CGT overview <span>↗</span></a></div>
      </section>
    </main>
  );
}

