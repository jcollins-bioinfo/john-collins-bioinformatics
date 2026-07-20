import Image from "next/image";
import type { ReactNode } from "react";
import type { FigureSpec } from "./content";
import { referenceIndex, references } from "./content";
import styles from "./publication.module.css";

export function Citation({ references: keys }: { references: string[] }) {
  return (
    <sup className={styles.citation}>
      {keys.map((key, position) => {
        const index = referenceIndex.get(key);
        if (!index) {
          throw new Error(`Unknown CGT reference key: ${key}`);
        }

        return (
          <span key={key}>
            {position > 0 ? "," : ""}
            <a href={`#ref-${key}`} aria-label={`Reference ${index}`}>
              {index}
            </a>
          </span>
        );
      })}
    </sup>
  );
}

export function ScientificFigure({ figure }: { figure: FigureSpec }) {
  const roleLabel = {
    core: "Core evidence",
    synthesis: "Evidence synthesis",
    supporting: "Supporting projection",
    supplementary: "Supplementary evidence",
  }[figure.role];

  return (
    <figure className={styles.figure} id={figure.id}>
      <div className={styles.figureTopline}>
        <span>{figure.label}</span>
        <span>{roleLabel}</span>
      </div>
      <div className={styles.figureFrame}>
        <a
          className={styles.figureImageLink}
          href={figure.svg}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${figure.label} as a full-resolution SVG in a new tab`}
        >
          <Image
            className={styles.figureImage}
            src={figure.image}
            width={figure.width}
            height={figure.height}
            sizes="(max-width: 720px) calc(100vw - 36px), (max-width: 1400px) calc(100vw - 64px), 1320px"
            alt={figure.alt}
            unoptimized
          />
        </a>
      </div>
      <figcaption className={styles.figureCaption}>
        <div>
          <p className={styles.figureLabel}>{figure.label}</p>
          <h3>{figure.title}</h3>
        </div>
        <div className={styles.captionBody}>
          {figure.caption.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <nav className={styles.figureDownloads} aria-label={`${figure.label} downloads`}>
            <a href={figure.pdf} target="_blank" rel="noreferrer">Download PDF</a>
            <a href={figure.svg} target="_blank" rel="noreferrer">Open vector SVG</a>
            <a href={figure.image} target="_blank" rel="noreferrer">Open 600-dpi PNG</a>
          </nav>
          <details className={styles.figureDetails}>
            <summary>Accessible description and provenance</summary>
            <div>
              <p>{figure.accessibleDescription}</p>
              <dl>
                <div><dt>Source run</dt><dd>{figure.sourceRun}</dd></div>
                <div><dt>Notebook</dt><dd>{figure.sourceNotebook}</dd></div>
                <div><dt>Upstream runs</dt><dd>{figure.upstreamRuns.join(" · ")}</dd></div>
                <div><dt>Freeze status</dt><dd>{figure.freezeStatus}</dd></div>
                <div><dt>Quality note</dt><dd>{figure.qaNote}</dd></div>
                <div><dt>PNG SHA-256</dt><dd><code>{figure.imageSha256}</code></dd></div>
                <div><dt>Notebook SHA-256</dt><dd><code>{figure.notebookSha256}</code></dd></div>
              </dl>
            </div>
          </details>
        </div>
      </figcaption>
    </figure>
  );
}

export function ArticleSection({
  id,
  index,
  title,
  children,
  className = "",
}: {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${styles.articleSection} ${className}`} id={id} aria-labelledby={`${id}-heading`}>
      <header className={styles.sectionHeader}>
        <p>{index}</p>
        <h2 id={`${id}-heading`}>{title}</h2>
      </header>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

export function ReferencesList() {
  return (
    <ol className={styles.referenceList}>
      {references.map((reference) => (
        <li id={`ref-${reference.key}`} key={reference.key}>
          <span>{reference.authors}</span>{" "}
          <cite>{reference.title}.</cite>{" "}
          <strong>{reference.journal}</strong>{" "}
          <span>{reference.details} ({reference.year}).</span>{" "}
          <a href={reference.href} target="_blank" rel="noreferrer">
            {reference.doi ? `https://doi.org/${reference.doi}` : "Source"}
          </a>
        </li>
      ))}
    </ol>
  );
}
