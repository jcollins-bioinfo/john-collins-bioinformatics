import { BrandMark } from "./components/brand-mark";
import { DomainStrip } from "./components/domain-strip";

const portals = [
  {
    index: "01",
    label: "Professional practice",
    title: "Bioinformatics",
    body: "NGS systems, scientific software, and reproducible research infrastructure.",
    href: "/bioinformatics",
    action: "Enter portfolio",
  },
  {
    index: "02",
    label: "Independent inquiry",
    title: "Research",
    body: "CGT, the emerging CORD framework, causal gene regulation, biological aging, and complex-system models.",
    href: "/research",
    action: "Explore research",
  },
  {
    index: "03",
    label: "Creative practice",
    title: "Music",
    body: "Piano, composition, arrangement, and musical cognition.",
    href: "/music",
    action: "Visit music",
  },
  {
    index: "04",
    label: "Ideas in development",
    title: "Writing & projects",
    body: "Research, technical notes, creative work, and works in progress.",
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
            Scientist, software engineer, independent researcher, composer, and pianist.
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
          <div className="register-mark"><BrandMark interactive /></div>
          <ol>
            <li><span>01</span><a href="/bioinformatics">Biology & computation</a></li>
            <li><span>02</span><a href="/research">Theory & research</a></li>
            <li><span>03</span><a href="/music">Music & cognition</a></li>
            <li><span>04</span><a href="/writing">Writing & synthesis</a></li>
          </ol>
        </aside>
      </section>

      <DomainStrip />

      <section className="shell page-section" id="index">
        <div className="split-heading">
          <p className="eyebrow"><span /> Primary destinations</p>
          <h2>Selected work.</h2>
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

      <section className="motion-study" aria-labelledby="motion-study-title">
        <div className="shell motion-study-inner">
          <header className="motion-study-heading">
            <p className="eyebrow"><span /> Selected motion work</p>
            <div>
              <h2 id="motion-study-title">DNA replication, refracted.</h2>
              <p>Original molecular animation / Adobe After Effects.</p>
            </div>
          </header>

          <figure className="motion-study-figure">
            <div className="motion-study-player">
              <video
                controls
                playsInline
                preload="metadata"
                poster="/media/dna-replication-kaleidoscope-poster.webp"
                aria-describedby="motion-study-caption"
              >
                <source src="/media/dna-replication-kaleidoscope.mp4" type="video/mp4" />
                Your browser does not support embedded video.
              </video>
            </div>
            <figcaption id="motion-study-caption">
              <span>Adobe After Effects / Molecular animation</span>
              <span>02:26 / Sound</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="home-threads">
        <div className="shell page-section">
          <div className="split-heading light">
            <p className="eyebrow"><span /> Current threads</p>
            <h2>Different media. Recurring questions.</h2>
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
        <p className="eyebrow"><span /> Current</p>
        <h2>Elsewhere in the index.</h2>
        <div>
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
