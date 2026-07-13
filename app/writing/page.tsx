import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "The developing writing index of John Patrick Collins: research notes, technical essays, music, cognition, and long-form projects.",
};

const desks = [
  ["01", "Research notes", "Definitions, models, experiments, and progress from Constraint Geometry Theory and adjacent work."],
  ["02", "Technical essays", "Bioinformatics, scientific software, reproducibility, information theory, and AI for biology."],
  ["03", "Music & cognition", "Form, expectation, predictive dynamics, performance, and the systems-level questions music makes audible."],
  ["04", "Long-form projects", "Extended work that needs a durable home: monographs, study editions, and structured syntheses."],
];

export default function WritingPage() {
  return (
    <main id="top" className="interior-page writing-page">
      <section className="page-hero shell">
        <div><p className="eyebrow"><span /> Writing desk</p><h1>Notes toward<br /><em>clearer structures.</em></h1></div>
        <div className="page-lede"><p>This section is the editorial home for ideas that need more room than a project card.</p><span className="status-chip"><i /> INDEX IN DEVELOPMENT</span></div>
      </section>

      <section className="writing-statement"><div className="shell"><p>Writing is not an afterthought to the work. It is where definitions sharpen, assumptions become visible, and connections can be tested rather than merely suggested.</p></div></section>

      <section className="shell page-section">
        <div className="split-heading"><p className="eyebrow"><span /> Editorial desks</p><h2>Four homes for work as it matures.</h2></div>
        <div className="desk-grid">{desks.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p><small>FORTHCOMING</small></article>)}</div>
      </section>

      <section className="shell compact-cta page-section"><h2>Until the index fills out, follow the active work.</h2><div><a href="/research/cgt">Constraint Geometry Theory <span>↗</span></a><a href="/now">Now <span>↗</span></a><a href="/projects">Projects <span>↗</span></a></div></section>
    </main>
  );
}

