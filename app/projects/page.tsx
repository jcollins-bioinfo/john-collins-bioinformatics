import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "A living project index spanning bioinformatics systems, independent research, scientific software, music, and writing.",
};

const projects = [
  {
    code: "R / 01",
    type: "Independent research",
    title: "CGT evidence report → CORD",
    body: "A frozen, provenance-tracked perturbation-geometry analysis and the context-conditioned framework it motivated.",
    status: "CGT FROZEN · CORD ACTIVE",
    href: "/research/cgt",
  },
  {
    code: "B / 01",
    type: "Bioinformatics engineering",
    title: "Reproducible NGS systems",
    body: "Production-oriented workflows spanning sequence analysis, variant interpretation, and scientifically defensible outputs.",
    status: "SELECTED WORK",
    href: "/bioinformatics",
  },
  {
    code: "S / 01",
    type: "Scientific software",
    title: "Research data products",
    body: "Python tools, interactive analysis applications, and notebooks that shorten the path from raw data to the next decision.",
    status: "PRACTICE",
    href: "/bioinformatics#work",
  },
  {
    code: "M / 01",
    type: "Creative practice",
    title: "Piano, composition & arrangement",
    body: "Performance, transcription, compositional study, and a growing inquiry into musical expectation and form.",
    status: "ONGOING",
    href: "/music",
  },
  {
    code: "W / 01",
    type: "Long-form work",
    title: "Research notes & synthesis",
    body: "A developing editorial program for formal research, technical essays, music, cognition, and cross-disciplinary synthesis.",
    status: "IN DEVELOPMENT",
    href: "/writing",
  },
];

export default function ProjectsPage() {
  return (
    <main id="top" className="interior-page">
      <section className="page-hero shell">
        <div><p className="eyebrow"><span /> Project index</p><h1>Things built,<br /><em>tested, and composed.</em></h1></div>
        <p className="page-lede">A living index of professional systems, independent research, creative work, and longer projects as they become ready to show.</p>
      </section>

      <section className="shell page-section project-index">
        <div className="project-index-header"><span>CODE</span><span>PROJECT</span><span>STATUS</span></div>
        {projects.map((project) => (
          <a href={project.href} className="project-index-row" key={project.code}>
            <span>{project.code}</span>
            <div><small>{project.type}</small><h2>{project.title}</h2><p>{project.body}</p></div>
            <strong>{project.status} ↗</strong>
          </a>
        ))}
      </section>
    </main>
  );
}
