import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
  description: "Professional experience, education, and capabilities of bioinformatics data scientist and software engineer John Patrick Collins.",
};

const experience = [
  ["Bioinformatics & Operations Lead", "BacStitch DNA"],
  ["Bioinformatics / Platform Work", "Calico Life Sciences"],
  ["Bioinformatics Scientist", "PACT Pharma"],
  ["NGS & Scientific Software", "Bio-Rad · CareDx · Bristol Myers Squibb"],
];

const capabilities = ["NGS analysis & workflow engineering", "Scientific Python & data systems", "Cloud and HPC research infrastructure", "Gene regulation & perturbational biology", "Interactive analysis applications", "Reproducibility, observability & technical leadership"];

export default function CvPage() {
  return (
    <main id="top" className="interior-page cv-page">
      <section className="page-hero shell">
        <div><p className="eyebrow"><span /> Curriculum vitae</p><h1>Science with an<br /><em>engineering backbone.</em></h1></div>
        <p className="page-lede">More than a decade across biotechnology R&amp;D, translational genomics, data platforms, scientific software, and research operations.</p>
      </section>

      <section className="shell cv-section page-section"><aside><span>01</span><h2>Experience</h2></aside><ol className="cv-roles">{experience.map(([role, org], index) => <li key={`${role}-${org}`}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{role}</strong><small>{org}</small></div></li>)}</ol></section>
      <section className="cv-dark"><div className="shell cv-section page-section"><aside><span>02</span><h2>Capabilities</h2></aside><ul className="cv-capabilities">{capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul></div></section>
      <section className="shell cv-section page-section"><aside><span>03</span><h2>Education</h2></aside><div className="education-card"><span>University of California, Santa Cruz</span><h3>M.S., Biomolecular Engineering &amp; Bioinformatics</h3></div></section>
      <section className="shell compact-cta page-section"><h2>For the portfolio and research context.</h2><div><a href="/bioinformatics">Bioinformatics <span>↗</span></a><a href="/research">Research <span>↗</span></a><a href="/contact">Contact <span>↗</span></a></div></section>
    </main>
  );
}

