"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ResearchResultsNavigation } from "./results-navigation";
import { selectActiveResultId } from "./results-navigation";
import styles from "./research-results-navigator.module.css";

export function ResearchResultsNavigator({ config }: { config: ResearchResultsNavigation }) {
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const disclosure = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  const measure = useCallback(() => {
    const region = document.getElementById(config.regionId);
    if (!region) return;
    const contents = document.querySelector<HTMLElement>("[data-research-contents]");
    const siteHeader = document.querySelector<HTMLElement>(".site-header");
    const offset = Math.ceil((siteHeader?.getBoundingClientRect().height ?? 0) + (contents?.getBoundingClientRect().height ?? 0) + 16);
    document.documentElement.style.setProperty("--research-sticky-offset", `${offset}px`);
    const bounds = region.getBoundingClientRect();
    const nextVisible = bounds.bottom > offset && bounds.top < window.innerHeight;
    setVisible((current) => current === nextVisible ? current : nextVisible);
    if (nextVisible) {
      const headings = config.items.flatMap(({ id }) => {
        const element = document.getElementById(id);
        return element ? [{ id, top: element.getBoundingClientRect().top }] : [];
      });
      const nextActive = selectActiveResultId(headings, offset);
      setActiveId((current) => current === nextActive ? current : nextActive);
    }
  }, [config]);

  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const resizeObserver = new ResizeObserver(schedule);
    const region = document.getElementById(config.regionId);
    const contents = document.querySelector<HTMLElement>("[data-research-contents]");
    const siteHeader = document.querySelector<HTMLElement>(".site-header");
    if (region) resizeObserver.observe(region);
    if (contents) resizeObserver.observe(contents);
    if (siteHeader) resizeObserver.observe(siteHeader);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("hashchange", schedule);
    document.fonts?.ready.then(schedule);
    schedule();
    const fragmentId = decodeURIComponent(window.location.hash.slice(1));
    if (config.items.some(({ id }) => id === fragmentId)) {
      requestAnimationFrame(() => {
        document.getElementById(fragmentId)?.scrollIntoView();
        schedule();
      });
    }

    const activateFromContents = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>(`a[href="#${config.regionId}"]`);
      if (link?.closest("[data-research-contents]")) {
        setVisible(true);
        setActiveId(config.items[0]?.id ?? null);
      }
    };
    document.addEventListener("click", activateFromContents);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      document.removeEventListener("click", activateFromContents);
      document.documentElement.style.removeProperty("--research-sticky-offset");
    };
  }, [config, measure]);

  useEffect(() => {
    if (!expanded) return;
    const close = (event: KeyboardEvent | MouseEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setExpanded(false);
        button.current?.focus();
      } else if (event instanceof MouseEvent && !disclosure.current?.contains(event.target as Node)) setExpanded(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", close);
    };
  }, [expanded]);

  const active = config.items.find(({ id }) => id === activeId) ?? config.items[0];
  const links = (
    <ol>
      {config.items.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} aria-current={item.id === activeId ? "location" : undefined} onClick={() => setExpanded(false)}>
            <span>{item.ordinal}</span><b>{item.label}</b>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className={styles.root} data-visible={visible} aria-hidden={!visible} inert={!visible ? true : undefined}>
      <nav className={styles.rail} aria-label={config.label ?? "Results sections"}>{links}</nav>
      <div className={styles.compact} ref={disclosure}>
        <button ref={button} type="button" aria-expanded={expanded} aria-controls="research-results-menu" onClick={() => setExpanded((value) => !value)}>
          <span>RESULTS</span><b>{active.shortLabel ?? active.label}</b><i aria-hidden="true">⌄</i>
        </button>
        <nav id="research-results-menu" aria-label={config.label ?? "Results sections"} hidden={!expanded}>{links}</nav>
      </div>
    </div>
  );
}
