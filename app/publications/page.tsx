import { publicationGroups, publications } from "../data/publications";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata("/publications");

function Authors({ authors }: { authors: readonly string[] }) {
  return <p className="publication-authors">{authors.map((author, index) => {
    const isJohn = /Collins J/.test(author);
    return <span key={`${author}-${index}`}>{isJohn ? <strong>{author}</strong> : author}{index < authors.length - 1 ? ", " : ""}</span>;
  })}</p>;
}

export default function PublicationsPage() {
  return (
    <main id="top" className="interior-page publications-page">
      <section className="page-hero shell">
        <div><p className="eyebrow"><span /> Scholarly record</p><h1>Publications<br /><em>&amp; abstracts.</em></h1></div>
        <p className="page-lede">Peer-reviewed articles and published conference abstracts spanning DNA engineering, clinical diagnostics, immuno-oncology, and transplant genomics.</p>
      </section>

      <div className="shell publications-index" aria-label="Publication categories">
        {publicationGroups.map((group, index) => <a href={`#${group.type}`} key={group.type}><span>0{index + 1}</span>{group.label}</a>)}
      </div>

      {publicationGroups.map((group, groupIndex) => {
        const works = publications.filter((work) => work.type === group.type).sort((a, b) => b.year - a.year);
        return (
          <section className={groupIndex % 2 ? "publications-section publications-dark" : "publications-section"} id={group.type} key={group.type}>
            <div className="shell page-section">
              <header className="publications-heading"><span>0{groupIndex + 1}</span><h2>{group.label}</h2><p>{works.length} {works.length === 1 ? "work" : "works"}</p></header>
              <ol className="publication-list">
                {works.map((work) => <li key={work.id}>
                  <article>
                    <div className="publication-year">{work.year}</div>
                    <div className="publication-copy">
                      <p className="publication-type">{group.type === "peer-reviewed" ? "Peer-reviewed article" : "Published conference abstract"}</p>
                      <h3>{work.title}</h3>
                      <Authors authors={work.authors} />
                      <p className="publication-citation"><cite>{work.venue}</cite> · {work.citation}</p>
                      <a href={work.publisherUrl} target="_blank" rel="noreferrer">DOI {work.doi} <span aria-hidden="true">↗</span></a>
                    </div>
                  </article>
                </li>)}
              </ol>
            </div>
          </section>
        );
      })}

      <section className="shell compact-cta page-section"><h2>Research context and professional record.</h2><div><a href="/research">Research <span>↗</span></a><a href="/bioinformatics">Bioinformatics <span>↗</span></a><a href="/John-Patrick-Collins_MSc_Senior%20Bioinformatics_Resume.pdf" download>Download résumé (PDF) <span>↓</span></a></div></section>
    </main>
  );
}
