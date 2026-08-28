import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { HeteroscedasticField } from "../components/heteroscedastic-field";

export const metadata: Metadata = {
  title: "About",
  description: "About John Patrick Collins, a bioinformatics data scientist, software engineer, independent researcher, composer, and pianist.",
};

const principles = [
  ["01", "Explain complex work clearly", "I aim to make technical systems, assumptions, and results understandable without oversimplifying them."],
  ["02", "Make the work testable", "Useful research and software should state their assumptions, produce reproducible outputs, and make failure conditions visible."],
  ["03", "Use the disciplines the problem requires", "I draw on biology, software, mathematics, and other fields when a problem benefits from more than one perspective."],
];

const aboutLedePrefix = "I’m ";
const aboutName = "John Patrick Collins";
const aboutLedeSuffix =
  ": a bioinformatics data scientist and software engineer. I also conduct independent research and work as a composer and pianist. Across these areas, I focus on understanding complex systems and building clear, reliable ways to analyze them.";

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
          <h1>About<br /><em>me.</em></h1>
        </div>
        <p className="page-lede">
          {animatedCharacters(aboutLedePrefix, 0)}
          <span
            className="mercury-name-container fade-in-char"
            style={{ "--char-index": 4 } as CharacterStyle}
          >
            <span className="nano-mercury-char" data-text={aboutName}>
              {aboutName}
            </span>
          </span>
          {animatedCharacters(aboutLedeSuffix, 5)}
        </p>
      </section>

      <HeteroscedasticField />

      <section className="shell page-section about-story">
        <p className="section-index">01 / BACKGROUND</p>
        <div className="longform-copy">
          <h2>My work spans science, software, research, and music.</h2>
          <p>
            I have spent more than a decade working in biotechnology R&amp;D, translational genomics,
            scientific software, data platforms, and research operations. I translate biological
            questions into analytical workflows and software that researchers can use and trust.
          </p>
          <p>
            My independent research includes Constraint Geometry Theory, a framework for studying
            regulation, disturbance, dynamics, and the viable states of complex systems. I also
            compose, arrange, and perform music for piano. Writing helps me document these projects
            and explain the ideas behind them.
          </p>
        </div>
      </section>

      <section className="soft-section">
        <div className="shell page-section">
          <div className="split-heading">
            <p className="eyebrow"><span /> How I work</p>
            <h2>Clear methods, testable claims, and reliable results.</h2>
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
        <h2>Explore my work.</h2>
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
