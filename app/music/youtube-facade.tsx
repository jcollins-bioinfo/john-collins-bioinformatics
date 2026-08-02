"use client";

import { useState } from "react";

const VIDEO_ID = "ogi3rv9Rd8g";
const VIDEO_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;

export function YouTubeFacade() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState(
    `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`,
  );

  return (
    <div className="piano-video-frame">
      {isPlaying ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
          title="Featured original piano music by John Patrick Collins"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          className="piano-video-facade"
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label="Play featured original piano music by John Patrick Collins"
        >
          {/* YouTube's max-resolution image is not guaranteed for every upload. */}
          {/* The remote image and its runtime fallback intentionally bypass image optimization. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => {
              const fallback = `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`;
              if (thumbnail !== fallback) setThumbnail(fallback);
            }}
          />
          <span className="piano-video-shade" aria-hidden="true" />
          <span className="piano-play" aria-hidden="true"><i /></span>
          <span className="piano-video-label" aria-hidden="true">Play film</span>
        </button>
      )}
      <noscript>
        <a href={VIDEO_URL} target="_blank" rel="noopener noreferrer">
          Watch the featured piano video on YouTube
        </a>
      </noscript>
    </div>
  );
}
