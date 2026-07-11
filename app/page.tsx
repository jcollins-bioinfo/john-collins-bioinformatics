const projects = [
  {
    index: "01",
    label: "Independent research / flagship project",
    title: "Constraint Geometry Theory",
    description:
      "A research program exploring whether biological state and response can be modeled through the geometry of learned constraints—connecting gene-regulatory structure, perturbational data, representation learning, and causal prediction.",
    tags: ["Gene regulatory networks", "Representation learning", "Causal inference", "Python"],
  },
  {
    index: "02",
    label: "Selected industry systems",
    title: "Reproducible NGS workflows",
    description:
      "Production-oriented analysis systems spanning cfDNA, single-cell RNA sequencing, immune-repertoire analysis, and sequence-to-variant workflows—with emphasis on traceability, fault isolation, and scientifically defensible outputs.",
    tags: ["BWA", "Samtools / Bcftools", "GATK", "Workflow engineering"],
  },
  {
    index: "03",
    label: "Scientific computing / data products",
    title: "Research software that closes the loop",
    description:
      "Custom Python tools, interactive analysis applications, and reproducible notebooks designed to shorten the distance between raw biological data, expert interpretation, and the next experiment.",
    tags: ["Pandas / Polars", "Plotly / Dash", "Parquet", "Cloud + HPC"],
  },
];

const capabilityGroups = [
  {
    number: "01",
    title: "Computational biology",
    body: "NGS analysis, sequence alignment, variant calling, gene regulation, perturbational biology, and mechanistic interpretation.",
  },
  {
    number: "02",
    title: "Scientific engineering",
    body: "Python systems, tested pipelines, scalable data processing, APIs, interactive research applications, and reproducible environments.",
  },
  {
    number: "03",
    title: "Research infrastructure",
    body: "Cloud and HPC execution, workflow orchestration, data models, observability, technical leadership, and bench-to-compute integration.",
  },
];

const roles = [
  ["Bioinformatics & Operations Lead", "BacStitch DNA"],
  ["Bioinformatics / Platform Work", "Calico Life Sciences"],
  ["Bioinformatics Scientist", "PACT Pharma"],
  ["NGS & Scientific Software", "Bio-Rad · CareDx · Bristol Myers Squibb"],
];

function Mark() {
  return (
    <svg aria-hidden="true" className="mark" viewBox="0 0 44 44">
      <circle cx="11" cy="22" r="3" />
      <circle cx="22" cy="9" r="3" />
      <circle cx="33" cy="22" r="3" />
      <circle cx="22" cy="35" r="3" />
      <path d="M13 20 20 11M24 11l7 9M31 24l-7 9M20 33l-7-9M14 22h16" />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header shell">
        <a className="identity" href="#top" aria-label="John Collins, home">
          <Mark />
          <span>John Collins</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#expertise">Expertise</a>
          <a href="#research">Research</a>
        </nav>
        <a
          className="header-cta"
          href="https://github.com/jcollins-bioinfo/john-collins-bioinformatics"
          target="_blank"
          rel="noreferrer"
        >
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Bioinformatics · Scientific software · Computational biology</p>
          <h1>Building systems that make <em>biology computable.</em></h1>
          <p className="hero-lede">
            I’m a bioinformatics data scientist and software engineer working across NGS,
            scientific computing, and predictive biology—from production pipelines to
            mechanistic models of gene regulation and aging.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#work">Explore selected work <span>↓</span></a>
            <a className="button secondary" href="#expertise">View capabilities</a>
          </div>
        </div>

        <div className="system-card" aria-label="Research system diagram">
          <div className="system-topline">
            <span>RESEARCH SYSTEM / 01</span>
            <span className="system-status"><i /> ACTIVE</span>
          </div>
          <div className="network" aria-hidden="true">
            <svg viewBox="0 0 520 310" preserveAspectRatio="xMidYMid meet">
              <g className="edges">
                <path d="M83 210 164 115 258 164 345 78 435 142 389 245 258 164 174 245 83 210" />
                <path d="M164 115 174 245M345 78l44 167M83 210l175-46M435 142l-177 22" />
              </g>
              <g className="nodes">
                <circle cx="83" cy="210" r="8" /><circle cx="164" cy="115" r="8" />
                <circle className="core" cx="258" cy="164" r="14" /><circle cx="345" cy="78" r="8" />
                <circle cx="435" cy="142" r="8" /><circle cx="389" cy="245" r="8" />
                <circle cx="174" cy="245" r="8" />
              </g>
              <g className="labels">
                <text x="58" y="235">DATA</text><text x="130" y="92">SIGNAL</text>
                <text x="228" y="196">MODEL</text><text x="320" y="53">CAUSE</text>
                <text x="443" y="146">STATE</text><text x="397" y="269">TEST</text>
                <text x="135" y="274">CONSTRAINT</text>
              </g>
            </svg>
          </div>
          <div className="system-caption">
            <span>OBSERVE</span><b>→</b><span>REPRESENT</span><b>→</b><span>PERTURB</span><b>→</b><span>PREDICT</span>
          </div>
        </div>
      </section>

      <section className="signal-strip" aria-label="Technical focus areas">
        <div className="ticker">
          <span>NGS PIPELINES</span><i /> <span>GENE REGULATORY NETWORKS</span><i />
          <span>SCIENTIFIC PYTHON</span><i /> <span>REPRODUCIBLE COMPUTING</span><i />
          <span>CAUSAL BIOLOGY</span>
        </div>
      </section>

      <section className="work shell section" id="work">
        <div className="section-heading">
          <p className="eyebrow"><span /> Selected work</p>
          <h2>Research with an engineering backbone.</h2>
        </div>
        <div className="project-list">
          {projects.map((project, projectIndex) => (
            <article className="featured-project" key={project.title}>
              <div className="project-index">{project.index}</div>
              <div className="project-copy">
                <p className="project-label">{project.label}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <ul className="tag-list" aria-label={`${project.title} topics`}>
                  {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </div>
              <div className={`project-glyph glyph-${projectIndex + 1}`} aria-hidden="true"><Mark /></div>
            </article>
          ))}
        </div>
      </section>

      <section className="expertise" id="expertise">
        <div className="shell section">
          <div className="section-heading expertise-heading">
            <p className="eyebrow"><span /> Expertise & experience</p>
            <h2>From biological question to dependable system.</h2>
          </div>
          <div className="capability-grid">
            {capabilityGroups.map((group) => (
              <article key={group.number}>
                <p className="capability-number">{group.number}</p>
                <h3>{group.title}</h3>
                <p>{group.body}</p>
              </article>
            ))}
          </div>
          <div className="experience-grid">
            <div>
              <p className="small-label">Selected experience</p>
              <p className="experience-intro">
                More than a decade across biotechnology R&amp;D, translational genomics,
                data platforms, and scientific operations.
              </p>
            </div>
            <ol className="role-list">
              {roles.map(([role, org], index) => (
                <li key={`${role}-${org}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{role}</strong><small>{org}</small></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="education-line">
            <span>EDUCATION</span>
            <strong>M.S., Biomolecular Engineering &amp; Bioinformatics</strong>
            <span>UNIVERSITY OF CALIFORNIA, SANTA CRUZ</span>
          </div>
        </div>
      </section>

      <section className="research section" id="research">
        <div className="shell research-layout">
          <div className="research-intro">
            <p className="eyebrow"><span /> Research interests</p>
            <h2>Mechanism, constraint, prediction.</h2>
            <p>
              I’m interested in models that do more than classify biological states:
              systems that recover structure, expose causal leverage, and generate
              experimentally testable predictions.
            </p>
          </div>
          <div className="research-axes">
            <article><span>AXIS / A</span><h3>Gene regulation</h3><p>Regulatory networks, cell state, perturbation response, and interpretable structure.</p></article>
            <article><span>AXIS / B</span><h3>Aging mechanisms</h3><p>Constraint loss, state transitions, resilience, and causal hypotheses of biological aging.</p></article>
            <article><span>AXIS / C</span><h3>AI for biology</h3><p>Representation learning, causal inference, foundation models, and predictive experimental systems.</p></article>
          </div>
        </div>
      </section>

      <footer id="contact">
        <div className="shell footer-main">
          <div>
            <p className="small-label">Let’s connect</p>
            <h2>Complex biology deserves clear systems.</h2>
          </div>
          <div className="footer-note">
            <p>Bioinformatics data scientist · Software engineer · Computational biologist</p>
            <a
              className="github-link"
              href="https://github.com/jcollins-bioinfo/john-collins-bioinformatics"
              target="_blank"
              rel="noreferrer"
            >
              View source on GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="shell footer-base">
          <span>© 2026 John Collins</span><a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
