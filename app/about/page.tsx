import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { HeteroscedasticField } from "../components/heteroscedastic-field";

export const metadata: Metadata = {
  title: "About",
  description: "About John Patrick Collins—scientist, software engineer, independent researcher, composer, pianist, and writer.",
};

const principles = [
  ["01", "Make complexity legible", "I am drawn to systems whose surface complexity conceals a smaller set of governing relationships."],
  ["02", "Build what can be tested", "Theories become useful when they yield explicit assumptions, reproducible artifacts, and clear failure conditions."],
  ["03", "Keep disciplines in conversation", "Biology, software, mathematics, cognition, and music often reveal different aspects of the same structural questions."],
];

const aboutLedePrefix = "I’m ";
const aboutName = "John Patrick Collins";
const aboutLedeSuffix =
  ": a bioinformatics data scientist and software engineer, an independent researcher, and a composer and pianist. My work is united by an interest in how complex systems are structured, regulated, interpreted, and changed.";

type CharacterStyle = CSSProperties & { "--char-index": number };

function animatedCharacters(text: string, startingIndex: number): ReactNode[] {
  const output: ReactNode[] = [];
  let word: ReactNode[] = [];

  const flushWord = () => {
    if (word.length > 0) {
      output.push(
        <span className="fade-in-word" key={`word-${startingIndex + output.length}`}>
          {word}
        </span>,
      );
      word = [];
    }
  };

  Array.from(text).forEach((character, offset) => {
    const index = startingIndex + offset;
    const characterSpan = (
      <span
        className="fade-in-char"
        key={`char-${index}`}
        style={{ "--char-index": index } as CharacterStyle}
      >
        {character}
      </span>
    );

    if (character === " ") {
      flushWord();
      output.push(characterSpan);
    } else {
      word.push(characterSpan);
    }
  });
  flushWord();

  return output;
}

export default function AboutPage() {
  return (
    <main id="top" className="interior-page">
      <section className="page-hero shell">
        <div>
          <p className="eyebrow"><span /> About</p>
          <h1>One person.<br /><em>Several practices.</em></h1>
        </div>
        <p className="page-lede">
          {animatedCharacters(aboutLedePrefix, 0)}
          <span className="mercury-name-container fade-in-char">
            <span
              className="nano-mercury-char fade-in-char"
              style={{
                animationDelay: "-16.6066s",
                top: "-2px",
                "--char-index": 4,
              } as CharacterStyle}
            >
              {aboutName}
            </span>
          </span>
          {animatedCharacters(aboutLedeSuffix, 5)}
        </p>
      </section>

      <HeteroscedasticField />

      <section className="shell page-section about-story">
        <p className="section-index">01 / ORIENTATION</p>
        <div className="longform-copy">
          <h2>I work between questions and systems.</h2>
          <p>
            Professionally, I have spent more than a decade across biotechnology R&amp;D,
            translational genomics, scientific software, data platforms, and research operations.
            The recurring task is to turn difficult biological questions into dependable analytical systems.
          </p>
          <p>
            Independently, I am developing Constraint Geometry Theory, a viability-first research
            program concerned with regulation, disturbance, dynamics, and the states complex systems
            can sustain. In music, I work through piano, composition, arrangement, and questions of
            expectation and form. Writing is where these strands are made explicit and examined together.
          </p>
        </div>
      </section>

      <section className="soft-section">
        <div className="shell page-section">
          <div className="split-heading">
            <p className="eyebrow"><span /> Working principles</p>
            <h2>Rigor without narrowing the field of view.</h2>
          </div>
          <div className="principle-grid">
            {principles.map(([number, title, body]) => (
              <article key={number}>
                <span>{number}</span><h3>{title}</h3><p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="shell page-section compact-cta">
        <h2>Follow the work by practice.</h2>
        <div>
          <a href="/bioinformatics">Bioinformatics <span>↗</span></a>
          <a href="/research">Research <span>↗</span></a>
          <a href="/music">Music <span>↗</span></a>
          <a href="/cv">CV <span>↗</span></a>
        </div>
      </section>
    </main>
  );
}
