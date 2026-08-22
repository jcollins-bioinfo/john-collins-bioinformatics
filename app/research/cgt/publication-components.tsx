import Image from "next/image";
import katex from "katex";
import type { ReactNode } from "react";
import type { FigureSpec } from "./content";
import { referenceIndex, references } from "./content";
import styles from "./publication.module.css";

function MathExpression({ expression, display = false }: { expression: string; display?: boolean }) {
  const html = katex.renderToString(expression, {
    displayMode: display,
    output: "htmlAndMathml",
    strict: "error",
    throwOnError: true,
    trust: false,
  });

  if (display) {
    return (
      <div
        aria-label="Scrollable mathematical equation"
        className={styles.figureEquation}
        dangerouslySetInnerHTML={{ __html: html }}
        role="region"
        tabIndex={0}
      />
    );
  }

  return (
    <span
      aria-label="Scrollable inline mathematical expression"
      className={styles.figureInlineEquation}
      dangerouslySetInnerHTML={{ __html: html }}
      role="region"
      tabIndex={0}
    />
  );
}

function InlineFigureMarkdown({
  text,
}: {
  text: string;
}): ReactNode[] {
  type Delimiter = {
    open: string;
    close: string;
    render: (value: string, key: number) => ReactNode;
  };

  const tokens: ReactNode[] = [];

  const delimiters: Delimiter[] = [
    {
      open: "**",
      close: "**",
      render: (value, key) => <strong key={key}>{value}</strong>,
    },
    {
      open: "*",
      close: "*",
      render: (value, key) => <em key={key}>{value}</em>,
    },
    {
      open: "`",
      close: "`",
      render: (value, key) => <code key={key}>{value}</code>,
    },
    {
      open: "\\(",
      close: "\\)",
      render: (value, key) => (
        <MathExpression expression={value} key={key} />
      ),
    },
  ];

  let cursor = 0;

  while (cursor < text.length) {
    const matches = delimiters
      .map((delimiter) => ({
        delimiter,
        index: text.indexOf(delimiter.open, cursor),
      }))
      .filter(({ index }) => index >= 0)
      .sort(
        (left, right) =>
          left.index - right.index ||
          right.delimiter.open.length - left.delimiter.open.length,
      );

    const match = matches[0];

    if (!match) {
      tokens.push(text.slice(cursor));
      break;
    }

    if (match.index > cursor) {
      tokens.push(text.slice(cursor, match.index));
    }

    const contentStart = match.index + match.delimiter.open.length;
    const contentEnd = text.indexOf(
      match.delimiter.close,
      contentStart,
    );

    if (contentEnd < 0) {
      throw new Error(
        `Unclosed figure-caption delimiter: ${match.delimiter.open}`,
      );
    }

    tokens.push(
      match.delimiter.render(
        text.slice(contentStart, contentEnd),
        tokens.length,
      ),
    );

    cursor = contentEnd + match.delimiter.close.length;
  }

  return tokens;
}

function parseTableRow(line: string) {
  return line.slice(1, -1).split("|").map((cell) => cell.trim());
}

function FigureMarkdown({ markdown, id }: { markdown: string; id?: string }) {
  const lines = markdown.split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(<h4 key={`heading-${index}`}><InlineFigureMarkdown text={line.slice(4)} /></h4>);
      index += 1;
      continue;
    }

    if (line === "\\[") {
      const equation: string[] = [];
      index += 1;
      while (index < lines.length && lines[index] !== "\\]") {
        equation.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push(<MathExpression display expression={equation.join("\n")} key={`equation-${index}`} />);
      continue;
    }

    if (line.startsWith("|") && line.endsWith("|")) {
      const tableLines: string[] = [];
      const tableStart = index;
      while (index < lines.length && lines[index].startsWith("|") && lines[index].endsWith("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }
      const rows = tableLines.map(parseTableRow);
      const header = rows[0] ?? [];
      const body = rows.slice(2);
      blocks.push(
        <div className={styles.figureTableScroll} key={`table-${tableStart}`} tabIndex={0} role="region" aria-label="Scrollable figure data table">
          <table>
            <thead><tr>{header.map((cell) => <th key={cell} scope="col"><InlineFigureMarkdown text={cell} /></th>)}</tr></thead>
            <tbody>{body.map((row, rowIndex) => (
              <tr key={row.join("|")}>
                {row.map((cell, cellIndex) => cellIndex === 0
                  ? <th key={`${rowIndex}-${cellIndex}`} scope="row"><InlineFigureMarkdown text={cell} /></th>
                  : <td key={`${rowIndex}-${cellIndex}`}><InlineFigureMarkdown text={cell} /></td>)}
              </tr>
            ))}</tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      const listStart = index;
      while (index < lines.length && /^\d+\.\s/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s/, ""));
        index += 1;
      }
      blocks.push(
        <ol key={`ordered-list-${listStart}`}>
          {items.map((item) => <li key={item}><InlineFigureMarkdown text={item} /></li>)}
        </ol>,
      );
      continue;
    }

    const paragraphStart = index;
    const paragraph = [line];
    index += 1;
    while (
      index < lines.length
      && lines[index].trim()
      && !lines[index].startsWith("### ")
      && lines[index] !== "\\["
      && !lines[index].startsWith("|")
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push(<p key={`paragraph-${paragraphStart}`}><InlineFigureMarkdown text={paragraph.join(" ")} /></p>);
  }

  return <div className={styles.figureMarkdown} id={id}>{blocks}</div>;
}

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
          {typeof figure.caption === "string"
            ? <FigureMarkdown markdown={figure.caption} />
            : figure.caption.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
          {figure.responsiveNote
            ? <p className={styles.figureResponsiveNote}>{figure.responsiveNote}</p>
            : null}
          <details className={styles.figureDetails} id={`${figure.id}-details`}>
            <summary>Accessible description and provenance</summary>
            <div>
              {figure.accessibleDescriptionFormat === "markdown"
                ? <FigureMarkdown markdown={figure.accessibleDescription} id={descriptionId} />
                : <p id={descriptionId}>{figure.accessibleDescription}</p>}
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
                        {asset.role ? `${asset.role} · ` : ""}
                        {asset.width && asset.height ? `${asset.width.toLocaleString()} × ${asset.height.toLocaleString()} px · ` : ""}
                        {asset.nominalDpi ? `${asset.nominalDpi} dpi · ` : ""}
                        {asset.widthPt && asset.heightPt ? `${asset.widthPt} × ${asset.heightPt} pt · ` : ""}
                        {asset.widthMm && asset.heightMm ? `${asset.widthMm} × ${asset.heightMm} mm · ` : ""}
                        {asset.viewBox ? `viewBox ${asset.viewBox} · ` : ""}
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
