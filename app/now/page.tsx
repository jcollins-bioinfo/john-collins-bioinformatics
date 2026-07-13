import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Now",
  description: "What John Patrick Collins is focused on now, updated July 2026.",
};

const current = [
  ["01", "Building this personal domain", "Separating the bioinformatics portfolio from a broader home for research, music, writing, and future projects."],
  ["02", "Formalizing Constraint Geometry Theory", "Prioritizing a viability-first formal reframing and a synthetic single-scale demonstration with explicit success, failure, and null cases."],
  ["03", "Advancing bioinformatics work", "Continuing to develop reproducible scientific systems and clearer ways to connect computation with biological mechanism."],
  ["04", "Developing a music pipeline", "Capturing performances and compositional ideas, then refining them into an organized body of recordings, notation, and written study."],
];

export default function NowPage() {
  return (
    <main id="top" className="interior-page now-page">
      <section className="page-hero shell">
        <div><p className="eyebrow"><span /> Now / July 2026</p><h1>What has my<br /><em>attention now.</em></h1></div>
        <p className="page-lede">A brief, dated view of the work currently in motion. This page changes as priorities do.</p>
      </section>
      <section className="shell now-list page-section">{current.map(([number, title, body]) => <article key={number}><span>{number}</span><div><h2>{title}</h2><p>{body}</p></div></article>)}</section>
      <section className="now-note"><div className="shell"><p>Last updated July 2026</p><a href="/projects">See the broader project index <span>↗</span></a></div></section>
    </main>
  );
}

