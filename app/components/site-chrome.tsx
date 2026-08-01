import Link from "next/link";
import { BrandMark } from "./brand-mark";

const primaryLinks = [
  ["Bioinformatics", "/bioinformatics"],
  ["Research", "/research"],
  ["Music", "/music"],
  ["Writing", "/writing"],
  ["About", "/about"],
  ["Publications", "/publications"],
] as const;

const indexLinks = [
  ["Projects", "/projects"],
  ["Now", "/now"],
  ["CV", "/cv"],
  ["Résumé (PDF)", "/John-Patrick-Collins_MSc_Senior%20Bioinformatics_Resume.pdf"],
  ["Contact", "/contact"],
] as const;

const footerLinks = [
  ["Research", "/research"],
  ["Bioinformatics", "/bioinformatics"],
  ["Projects", "/projects"],
  ["Publications", "/publications"],
  ["Writing", "/writing"],
  ["Music", "/music"],
  ["About", "/about"],
  ["Now", "/now"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner shell">
        <Link className="identity" href="/" aria-label="John Patrick Collins, home">
          <BrandMark interactive intro />
          <span>John Patrick Collins</span>
        </Link>

        <nav className="primary-nav" aria-label="Primary navigation">
          {primaryLinks.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>

        <a className="header-cta" href="/contact">Contact</a>

        <details className="mobile-menu">
          <summary>Menu</summary>
          <div className="mobile-menu-panel">
            <nav aria-label="Mobile navigation">
              {[...primaryLinks, ...indexLinks].map(([label, href]) => (
                <a key={href} href={href}>{label}<span aria-hidden="true">↗</span></a>
              ))}
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer-grid">
        <div>
          <Link className="footer-identity" href="/">John Patrick Collins</Link>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          <nav className="footer-nav" aria-label="Footer navigation">
            {footerLinks.map(([label, href]) => (
              <a key={href} href={href}>{label}</a>
            ))}
            <span className="footer-document-links">
              <a href="/cv">CV</a>
              <span aria-hidden="true">/</span>
              <a href="/John-Patrick-Collins-Resume.pdf">Résumé (PDF)</a>
            </span>
          </nav>
        </div>
        <div>
          <p className="footer-label">Elsewhere</p>
          <a className="footer-outbound" href="https://github.com/jcollins-bioinfo" target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a className="footer-outbound" href="https://www.linkedin.com/in/johncollins-bioinformatics" target="_blank" rel="noreferrer">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a className="footer-outbound" href="https://stackoverflow.com/users/6714627/john-collins?tab=profile" target="_blank" rel="noreferrer">
            Stack Overflow <span aria-hidden="true">↗</span>
          </a>
          <a className="footer-outbound" href="mailto:jcollins.bioinformatics@gmail.com">
            Email <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="shell footer-base">
        <span>© 2026 John Patrick Collins</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
