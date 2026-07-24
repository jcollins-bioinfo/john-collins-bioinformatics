"use client";

import { useEffect, useRef, useState } from "react";

const areas = [
  "BIOINFORMATICS",
  "SCIENTIFIC SOFTWARE",
  "INDEPENDENT RESEARCH",
  "MUSIC",
  "WRITING",
] as const;

export function DomainStrip() {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    let animationFrame: number | undefined;
    const checkFit = () => {
      window.cancelAnimationFrame(animationFrame ?? 0);
      animationFrame = window.requestAnimationFrame(() => {
        setIsOverflowing(content.scrollWidth > container.clientWidth);
      });
    };

    const resizeObserver = new ResizeObserver(checkFit);
    resizeObserver.observe(container);
    resizeObserver.observe(content);
    checkFit();

    return () => {
      window.cancelAnimationFrame(animationFrame ?? 0);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section
      aria-label="Areas of practice"
      className="domain-strip marquee-container"
      data-overflowing={isOverflowing ? "true" : "false"}
      ref={containerRef}
    >
      <div className="marquee-content" ref={contentRef}>
        {areas.map((area, index) => (
          <span key={area}>
            {area}
            {index < areas.length - 1 && <i aria-hidden="true" />}
          </span>
        ))}
      </div>
    </section>
  );
}
