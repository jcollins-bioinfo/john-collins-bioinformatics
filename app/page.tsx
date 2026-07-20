import { Mark } from "./components/site-chrome";

const portals = [
  {
    index: "01",
    label: "Professional practice",
    title: "Bioinformatics",
    body: "NGS systems, scientific software, computational biology, and the infrastructure that makes research reproducible.",
    href: "/bioinformatics",
    action: "Enter portfolio",
  },
  {
    index: "02",
    label: "Independent inquiry",
    title: "Research",
    body: "The analysis-frozen CGT report, the emerging CORD framework, causal gene regulation, biological aging, and predictive models of complex systems.",
    href: "/research",
    action: "Explore research",
  },
  {
    index: "03",
    label: "Creative practice",
    title: "Music",
    body: "Piano, composition, arrangement, and an ongoing study of expectation, structure, and musical cognition.",
    href: "/music",
    action: "Visit music",
  },
  {
    index: "04",
    label: "Ideas in development",
    title: "Writing & projects",
    body: "Long-form research, technical notes, creative work, and a living index of things being built.",
    href: "/writing",
    action: "Read the index",
    secondaryHref: "/projects",
    secondaryAction: "View projects",
  },
];

const threads = [
  {
    code: "R / 01",
    title: "CGT → CORD",
    body: "A provenance-tracked perturbation-geometry report whose generalization boundary motivated a context-conditioned response framework.",
    href: "/research/cgt",
  },
  {
    code: "B / 01",
    title: "Bioinformatics systems",
    body: "Production-oriented pipelines and scientific tools designed for traceability, fault isolation, and defensible interpretation.",
    href: "/bioinformatics",
  },
  {
    code: "M / 01",
    title: "Music as predictive structure",
    body: "A creative and theoretical practice centered on how rhythm, harmony, and form shape expectation through time.",
    href: "/music",
  },
];

export default function Home() {
  return (
    <main id="top" className="home-page">
      <section className="home-hero shell">
        <div className="home-hero-copy">
          <p className="eyebrow"><span /> Personal domain / 2026</p>
          <h1 className="home-title">John Patrick <em>Collins.</em></h1>
          <p className="home-lede">
            Scientist, software engineer, composer and pianist, and independent researcher.
            I build practical systems for difficult questions—and follow the structural ideas
            that connect biology, computation, cognition, and music.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#index">Explore the index <span>↓</span></a>
            <a className="button secondary" href="/about">About me</a>
          </div>
        </div>

        <aside className="home-register" aria-label="Site orientation">
          <div className="register-topline">
            <span>JPC / DOMAIN INDEX</span>
            <span><i /> ACTIVE</span>
          </div>
          <div className="register-mark"><Mark /></div>
          <ol>
            <li><span>01</span><a href="/bioinformatics">Biology & computation</a></li>
            <li><span>02</span><a href="/research">Theory & research</a></li>
            <li><span>03</span><a href="/music">Music & cognition</a></li>
            <li><span>04</span><a href="/writing">Writing & synthesis</a></li>
          </ol>
          <p>One name. Several practices. A common interest in systems, constraints, and meaning.</p>
        </aside>
      </section>

      <section className="domain-strip" aria-label="Areas of practice">
        <div>
          <span>BIOINFORMATICS</span><i />
          <span>SCIENTIFIC SOFTWARE</span><i />
          <span>INDEPENDENT RESEARCH</span><i />
          <span>MUSIC</span><i />
          <span>WRITING</span>
        </div>
      </section>

      <section className="shell page-section" id="index">
        <div className="split-heading">
          <p className="eyebrow"><span /> Primary destinations</p>
          <div>
            <h2>A personal site, organized by practice.</h2>
            <p>Each section has its own purpose; the homepage remains the quiet point of orientation.</p>
          </div>
        </div>
        <div className="portal-grid">
          {portals.map((portal) => (
            <article className="portal-card" key={portal.index}>
              <div className="portal-meta"><span>{portal.index}</span><small>{portal.label}</small></div>
              <h3>{portal.title}</h3>
              <p>{portal.body}</p>
              <div className="portal-actions">
                <a href={portal.href}>{portal.action} <span aria-hidden="true">↗</span></a>
                {portal.secondaryHref && <a href={portal.secondaryHref}>{portal.secondaryAction} <span aria-hidden="true">↗</span></a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-threads">
        <div className="shell page-section">
          <div className="split-heading light">
            <p className="eyebrow"><span /> Current threads</p>
            <div>
              <h2>Different media. Recurring questions.</h2>
              <p>How do complex systems remain coherent, become interpretable, and change?</p>
            </div>
          </div>
          <div className="thread-grid">
            {threads.map((thread) => (
              <a className="thread-card" href={thread.href} key={thread.code}>
                <span>{thread.code}</span>
                <h3>{thread.title}</h3>
                <p>{thread.body}</p>
                <b aria-hidden="true">↗</b>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="shell home-closing page-section">
        <p className="eyebrow"><span /> A living index</p>
        <h2>This domain is designed to grow without losing its shape.</h2>
        <div>
          <p>
            Professional work lives beside independent research, music, and writing—connected
            by a shared identity, but separated clearly enough that each audience can find its way.
          </p>
          <div className="closing-links">
            <a href="/now">What I’m doing now <span>↗</span></a>
            <a href="/projects">Browse all projects <span>↗</span></a>
            <a href="/contact">Get in touch <span>↗</span></a>
          </div>
        </div>
      </section>
    </main>
  );
}
