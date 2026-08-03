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
  const descriptionId = `${figure.id}-accessible-description`;
  const downloads = figure.releaseAssets ?? [
    { href: figure.pdf, filename: undefined, linkText: "Download PDF" },
    { href: figure.svg, filename: undefined, linkText: "Open vector SVG" },
    { href: figure.image, filename: undefined, linkText: "Open 600-dpi PNG" },
  ];

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
            aria-describedby={descriptionId}
            aria-details={`${figure.id}-details`}
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
            {downloads.map((asset) => (
              <a
                href={asset.href}
                download={figure.releaseAssets ? asset.filename : undefined}
                target={figure.releaseAssets ? undefined : "_blank"}
                rel={figure.releaseAssets ? undefined : "noreferrer"}
                key={asset.href}
              >
                {asset.linkText}
              </a>
            ))}
          </nav>
          <details className={styles.figureDetails} id={`${figure.id}-details`}>
            <summary>Accessible description and provenance</summary>
            <div>
              <p id={descriptionId}>{figure.accessibleDescription}</p>
              <dl>
                <div><dt>Source run</dt><dd>{figure.sourceRun}</dd></div>
                <div><dt>Notebook</dt><dd>{figure.sourceNotebook}</dd></div>
                <div><dt>Upstream runs</dt><dd>{figure.upstreamRuns.join(" · ")}</dd></div>
                <div><dt>Freeze status</dt><dd>{figure.freezeStatus}</dd></div>
                {figure.revisionScope ? <div><dt>Revision scope</dt><dd>{figure.revisionScope}</dd></div> : null}
                <div><dt>Quality note</dt><dd>{figure.qaNote}</dd></div>
                <div><dt>Display PNG SHA-256</dt><dd><code>{figure.imageSha256}</code></dd></div>
                <div><dt>Notebook SHA-256</dt><dd><code>{figure.notebookSha256}</code></dd></div>
                {figure.releaseAssets?.map((asset) => (
                  <div key={asset.href}>
                    <dt>{asset.label}</dt>
                    <dd className={styles.assetMetadata}>
                      <code>{asset.filename}</code>
                      <span>
                        {asset.width && asset.height ? `${asset.width.toLocaleString()} × ${asset.height.toLocaleString()} px · ` : ""}
                        {asset.nominalDpi ? `${asset.nominalDpi} dpi · ` : ""}
                        {asset.bytes.toLocaleString()} bytes · {asset.mimeType}
                      </span>
                      <code>SHA-256 {asset.sha256}</code>
                    </dd>
                  </div>
                ))}
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
