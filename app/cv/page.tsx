import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
  description: "Professional experience, education, and capabilities of bioinformatics data scientist and software engineer John Patrick Collins.",
};

const experience = [
  ["Staff Software Developer", "BacStitch DNA", "Mar–Nov 2024"],
  ["Data Management Engineer, contract", "Calico Life Sciences", "Sep–Nov 2023"],
  ["Bioinformatics Scientist", "PACT Pharma", "Sep 2018–Sep 2020"],
  ["Bioinformatics Pipeline Developer, contract", "Bristol Myers Squibb", "Feb–Jun 2018"],
  ["Bioinformatics & Sequencing Analyst", "Bio-Rad", "Apr–Jul 2017"],
  ["Bioinformatics Analyst", "CareDx", "Nov 2014–Apr 2017"],
  ["Undergraduate & graduate student researcher", "University of California, Santa Cruz", "2011–2014"],
];

const capabilities = ["NGS analysis & workflow engineering", "Scientific Python & data systems", "Cloud and HPC research infrastructure", "Gene regulation & perturbational biology", "Interactive analysis applications", "Reproducibility, observability & technical leadership"];

export default function CvPage() {
  return (
    <main id="top" className="interior-page cv-page">
      <section className="page-hero shell">
        <div><p className="eyebrow"><span /> Curriculum vitae</p><h1>Science with an<br /><em>engineering backbone.</em></h1></div>
        <p className="page-lede">More than a decade across biotechnology R&amp;D, translational genomics, data platforms, scientific software, and research operations.</p>
      </section>

      <section className="shell cv-section page-section"><aside><span>01</span><h2>Experience</h2></aside><ol className="cv-roles">{experience.map(([role, org, dates], index) => <li key={`${role}-${org}`}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{role}</strong><small>{org} · {dates}</small></div></li>)}</ol></section>
      <section className="cv-dark"><div className="shell cv-section page-section"><aside><span>02</span><h2>Capabilities</h2></aside><ul className="cv-capabilities">{capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul></div></section>
      <section className="shell cv-section page-section"><aside><span>03</span><h2>Education</h2></aside><div className="education-card"><span>University of California, Santa Cruz</span><h3>M.S., Biomolecular Engineering &amp; Bioinformatics · 2014</h3><h3>B.S., Bioengineering, honors in the major · 2013</h3></div></section>
      <section className="resume-panel shell"><p className="eyebrow"><span /> Full professional record</p><h2>View or keep a copy.</h2><div className="hero-actions"><a className="button primary" href="/John-Patrick-Collins-Resume.pdf">View résumé <span aria-hidden="true">↗</span><span className="sr-only"> (PDF)</span></a><a className="button secondary" href="/John-Patrick-Collins-Resume.pdf" download>Download résumé (PDF) <span aria-hidden="true">↓</span></a></div></section>
      <section className="shell compact-cta page-section"><h2>For the portfolio and research context.</h2><div><a href="/bioinformatics">Bioinformatics <span>↗</span></a><a href="/research">Research <span>↗</span></a><a href="/publications">Publications <span>↗</span></a><a href="/contact">Contact <span>↗</span></a></div></section>
    </main>
  );
}

