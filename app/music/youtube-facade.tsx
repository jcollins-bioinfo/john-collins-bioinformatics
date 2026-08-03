"use client";

import { type KeyboardEvent, useState } from "react";

type PianoVideo = {
  displayTitle: string;
  subtitle: string;
  description: string;
  id: string;
  poster?: string;
  youtubeTitle: string;
};

export const pianoVideos: readonly PianoVideo[] = [
  {
    displayTitle: "Forever",
    subtitle: "Op. 1, No. 15 — Prelude in D-flat Major",
    description: "A large-scale D-flat major prelude from an original cycle spanning all 24 major and minor keys.",
    id: "ogi3rv9Rd8g",
    poster: "/media/forever-prelude-poster.svg",
    youtubeTitle: 'Op. 1, No. 15 - "Forever" (Prelude in D-flat Major) (An original modern piano piece by John Collins)',
  },
  {
    displayTitle: "24 Variations",
    subtitle: "Op. 2 — Theme and Variations in F-sharp Major",
    description: "Twenty-four continuous improvised variations on a theme in F-sharp major, presented as a live recording with the realized score.",
    id: "hx-z3kTaafg",
    youtubeTitle: "Op. 2 - 24 Variations (Contemporary avant-garde piano music) [Live recording visualized with score]",
  },
  {
    displayTitle: "Flying",
    subtitle: "Op. 4, No. 1 — Étude in C Major",
    description: "A compact, high-velocity C-major étude opening a planned cycle of twelve études.",
    id: "om2Fnk_LJwI",
    youtubeTitle: 'Op. 4, No. 1 - "Flying" (Etude in C Major)',
  },
  {
    displayTitle: "Horror ubique animos",
    subtitle: "Op. 1, No. 2 — Prelude in A Minor",
    description: "A dark A-minor prelude whose title draws upon a line from Virgil’s Aeneid.",
    id: "-CT8sgU6lDo",
    youtubeTitle: 'Op. 1, No. 2 - "Horror ubique animos" (Prelude in A minor)',
  },
] as const;

function VideoThumbnail({ video }: { video: PianoVideo }) {
  const [quality, setQuality] = useState<"maxresdefault" | "hqdefault" | "none">("maxresdefault");
  const fallBack = () => setQuality((current) => current === "maxresdefault" ? "hqdefault" : "none");

  if (video.poster) {
    return (
      // The featured work uses a version-controlled poster so the initial
      // facade does not depend on YouTube's thumbnail CDN.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={video.poster} alt="" loading="eager" decoding="async" />
    );
  }

  if (quality === "none") return <span className="piano-thumbnail-fallback" aria-hidden="true" />;

  return (
    // Runtime dimension checks are needed because YouTube can return a small
    // placeholder response for a missing max-resolution thumbnail.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://i.ytimg.com/vi/${video.id}/${quality}.jpg`}
      alt=""
      loading="lazy"
      decoding="async"
      onError={fallBack}
      onLoad={(event) => {
        if (quality === "maxresdefault" && event.currentTarget.naturalWidth < 640) fallBack();
      }}
    />
  );
}

export function PianoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const video = pianoVideos[activeIndex];
  const position = `${activeIndex + 1} / ${pianoVideos.length}`;

  const select = (direction: -1 | 1) => {
    setIsPlaying(false);
    setActiveIndex((current) => (current + direction + pianoVideos.length) % pianoVideos.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    select(event.key === "ArrowLeft" ? -1 : 1);
  };

  return (
    <section className="piano-carousel" aria-label="Selected piano compositions" onKeyDown={handleKeyDown}>
      <div className="piano-video-stage">
        <div className="piano-video-frame" key={`${video.id}-${isPlaying ? "playing" : "facade"}`}>
          {isPlaying ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
              title={video.youtubeTitle}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button
              className="piano-video-facade"
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label={`Play ${video.displayTitle}`}
            >
              <VideoThumbnail video={video} />
              <span className="piano-video-shade" aria-hidden="true" />
              <span className="piano-play" aria-hidden="true"><i /></span>
              <span className="piano-video-label" aria-hidden="true">Play film</span>
            </button>
          )}
        </div>
        <button className="piano-carousel-arrow previous" type="button" onClick={() => select(-1)} aria-label="Previous composition"><span aria-hidden="true">‹</span></button>
        <button className="piano-carousel-arrow next" type="button" onClick={() => select(1)} aria-label="Next composition"><span aria-hidden="true">›</span></button>
      </div>

      <div className="piano-slide-content" key={video.id}>
        <div className="piano-slide-heading">
          <p className="piano-position">{position}</p>
          <h3>{video.displayTitle}</h3>
          <p className="piano-subtitle">{video.subtitle}</p>
        </div>
        <div className="piano-slide-notes">
          <p>{video.description}</p>
          <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
            Open on YouTube <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{video.displayTitle}, composition {position}</p>
    </section>
  );
}
