"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import styles from "./responsive-research-figure.module.css";

export type ResponsiveResearchFigurePanel = {
  id: string;
  label: string;
  src: string;
  width: number;
  height: number;
  minimumDisplayWidth?: number;
};

export type ResponsiveResearchFigureProps = {
  figureLabel: string;
  alt: string;
  descriptionId: string;
  detailsId: string;
  vectorSrc: string;
  fallbackRasterSrc: string;
  width: number;
  height: number;
  panels: ResponsiveResearchFigurePanel[];
};

function scrollPanelWithKeyboard(event: KeyboardEvent<HTMLDivElement>) {
  const scroller = event.currentTarget;
  const step = Math.max(80, Math.round(scroller.clientWidth * 0.25));

  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    scroller.scrollBy({
      left: event.key === "ArrowRight" ? step : -step,
      behavior: "auto",
    });
  }
}

export function ResponsiveResearchFigure({
  figureLabel,
  alt,
  descriptionId,
  detailsId,
  vectorSrc,
  fallbackRasterSrc,
  width,
  height,
  panels,
}: ResponsiveResearchFigureProps) {
  return (
    <div className={styles.root} data-responsive-research-figure="true">
      <a
        className={styles.compositeLink}
        href={vectorSrc}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${figureLabel} as a full-resolution SVG in a new tab`}
      >
        <picture>
          <source srcSet={vectorSrc} type="image/svg+xml" />
          {/* Immutable publication assets must bypass framework image optimization. */}
          <img
            className={styles.compositeImage}
            src={fallbackRasterSrc}
            width={width}
            height={height}
            alt={alt}
            aria-describedby={descriptionId}
            aria-details={detailsId}
            decoding="async"
            loading="lazy"
          />
        </picture>
      </a>

      <div
        className={styles.panelSequence}
        role="group"
        aria-label={`${figureLabel} responsive panel sequence`}
        aria-describedby={descriptionId}
        aria-details={detailsId}
      >
        <div className={styles.panelSequenceIntro}>
          <span>Panels shown at readable scale</span>
          <a href={vectorSrc} target="_blank" rel="noreferrer">
            Open full-resolution composite
          </a>
        </div>

        {panels.map((panel) => {
          const scrollable = panel.minimumDisplayWidth !== undefined;
          const style = scrollable
            ? ({
                "--research-panel-min-width": `${panel.minimumDisplayWidth}px`,
              } as CSSProperties)
            : undefined;

          return (
            <section
              className={styles.panel}
              data-responsive-research-panel={panel.id}
              key={panel.id}
              aria-labelledby={`${figureLabel}-${panel.id}-label`.replaceAll(" ", "-").toLowerCase()}
            >
              <div className={styles.panelHeader}>
                <h4 id={`${figureLabel}-${panel.id}-label`.replaceAll(" ", "-").toLowerCase()}>
                  {panel.label}
                </h4>
                <a href={panel.src} target="_blank" rel="noreferrer">
                  Open panel at full resolution
                </a>
              </div>
              {scrollable ? (
                <p className={styles.scrollHint}>Swipe or scroll horizontally</p>
              ) : null}
              <div
                className={scrollable ? styles.panelScroller : styles.panelFit}
                style={style}
                role={scrollable ? "region" : undefined}
                tabIndex={scrollable ? 0 : undefined}
                onKeyDown={scrollable ? scrollPanelWithKeyboard : undefined}
                aria-keyshortcuts={scrollable ? "ArrowLeft ArrowRight" : undefined}
                aria-label={scrollable
                  ? `${figureLabel}, ${panel.label}. Swipe, scroll, or use Left and Right Arrow keys to inspect the panel horizontally.`
                  : undefined}
              >
                {/* Immutable publication assets must bypass framework image optimization. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={panel.src}
                  width={panel.width}
                  height={panel.height}
                  alt=""
                  decoding="async"
                  loading="lazy"
                />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
