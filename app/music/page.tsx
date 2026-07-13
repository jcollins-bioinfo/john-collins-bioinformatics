import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music",
  description: "John Patrick Collins’s musical practice across piano, composition, arrangement, transcription, and musical cognition.",
};

const practices = [
  ["01", "Piano", "Interpretation, touch, voicing, memory, and the physical architecture of performance."],
  ["02", "Composition", "Motif, harmony, rhythm, and form developed through iterative listening and revision."],
  ["03", "Arrangement & study", "Transcription and performance materials designed to reveal musical structure rather than merely reproduce notation."],
  ["04", "Musical cognition", "How expectation, prediction, tension, release, and timing shape the experience of music."],
];

export default function MusicPage() {
  return (
    <main id="top" className="interior-page music-page">
      <section className="music-hero">
        <div className="shell music-hero-grid">
          <div><p className="eyebrow"><span /> Music</p><h1>Piano, form,<br /><em>and expectation.</em></h1></div>
          <div className="music-pulse" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <p>Composition and performance as ways of thinking in time.</p>
        </div>
      </section>

      <section className="shell page-section music-intro">
        <p className="section-index">PRACTICE / 01</p>
        <div className="longform-copy"><h2>Music is a central practice, not a side note.</h2><p>I work through piano, composition, arrangement, and transcription. The practical craft and the theoretical questions stay close together: how a phrase creates expectation, how timing changes meaning, and how a large form remains coherent while it moves.</p><p>This section will become the durable home for recordings, scores, study materials, and essays as they are prepared for publication.</p></div>
      </section>

      <section className="soft-section"><div className="shell page-section"><div className="split-heading"><p className="eyebrow"><span /> Four practices</p><h2>Sound, structure, and time.</h2></div><div className="music-grid">{practices.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>

      <section className="music-question"><div className="shell"><p>RECURRING QUESTION</p><h2>What does music reveal about prediction, control, memory, and meaning that a static description cannot?</h2><a href="/writing">Follow the writing index <span>↗</span></a></div></section>
    </main>
  );
}

