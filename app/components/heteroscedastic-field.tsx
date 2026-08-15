"use client";

import { useEffect, useRef } from "react";

const DESCRIPTION =
  "A generative field representing heteroscedasticity: observations remain centered on a constant horizontal mean while their variance expands from left to right.";

type HeteroscedasticFieldProps = {
  /** Future portrait hand midpoint: (sourceXRatio * width, 50% * height). */
  sourceXRatio?: number;
};

type Particle = {
  x: number;
  residual: number;
  phase: number;
  speed: number;
  size: number;
  alpha: number;
  streak: boolean;
  accent: boolean;
};

type Palette = { ink: string; inkSoft: string; paper: string; teal: string; acid: string };

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

export function HeteroscedasticField({ sourceXRatio = 0.18 }: HeteroscedasticFieldProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceRatio = clamp(sourceXRatio, 0, 0.95);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return; // The CSS line and knot remain as a no-canvas fallback.

    const styles = getComputedStyle(document.documentElement);
    const token = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
    const palette: Palette = {
      ink: token("--ink", "#0a1717"),
      inkSoft: token("--ink-soft", "#17302e"),
      paper: token("--paper", "#f2f5ed"),
      teal: token("--teal", "#64ddc4"),
      acid: token("--acid", "#c7f36b"),
    };

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let lastTime = 0;
    let visible = false;
    let reducedMotion = false;
    let disposed = false;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Smoothstep plus a high exponent makes variance nearly silent at the source,
    // then accelerates without introducing a hard triangular boundary.
    const sigmaAt = (x: number) => {
      const sourceX = sourceRatio * width;
      const p = clamp((x - sourceX) / Math.max(1, width - sourceX), 0, 1);
      const smooth = p * p * (3 - 2 * p);
      return 3 + (height * 0.445 - 3) * Math.pow(smooth, 2.4);
    };

    const initialize = () => {
      const random = mulberry32(0x4a504346 ^ Math.round(width) ^ (Math.round(height) << 8));
      const pairCount = clamp(Math.round((width * height) / 2250), 130, 390);
      particles = Array.from({ length: pairCount }, () => {
        // Squaring concentrates observations at the mean while retaining rare tails.
        const residual = Math.pow(random(), 1.85) * (random() < 0.5 ? -1 : 1);
        return {
          x: random() * width,
          residual,
          phase: random() * Math.PI * 2,
          speed: 5 + random() * 12,
          size: 0.45 + random() * 1.15,
          alpha: 0.14 + random() * 0.48,
          streak: random() < 0.13,
          accent: random() < 0.025,
        };
      });
    };

    const drawPair = (particle: Particle, time: number, atmosphere: boolean) => {
      const sourceX = sourceRatio * width;
      const p = clamp((particle.x - sourceX) / Math.max(1, width - sourceX), 0, 1);
      const texture = 0.88 + Math.sin(particle.phase + time * 0.00022) * 0.12;
      const displacement = Math.abs(particle.residual) * sigmaAt(particle.x) * texture;
      const y0 = height / 2;
      const alpha = particle.alpha * (0.35 + p * 0.65) * (atmosphere ? 0.17 : 1);
      const acidMix = p > 0.55 && (particle.accent || particle.phase % 3 < p);
      context.fillStyle = acidMix ? palette.acid : particle.phase % 2.2 < 1 ? palette.teal : palette.paper;
      context.globalAlpha = alpha;

      // Every residual is rendered at +d and -d, preserving the empirical center exactly.
      for (const direction of [-1, 1]) {
        const y = y0 + displacement * direction;
        if (atmosphere) {
          const radius = particle.size * (2.2 + p * 2.5);
          context.fillRect(particle.x - radius / 2, y - radius / 2, radius, radius);
        } else {
          const length = particle.streak && p > 0.58 ? 1.5 + p * 6 : particle.size;
          context.fillRect(particle.x, y, length, Math.max(0.65, particle.size * 0.72));
        }
      }
    };

    const render = (time: number) => {
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 1;
      context.fillStyle = palette.ink;
      context.fillRect(0, 0, width, height);

      const wash = context.createLinearGradient(0, 0, width, height);
      wash.addColorStop(0, palette.inkSoft);
      wash.addColorStop(0.42, palette.ink);
      wash.addColorStop(1, palette.inkSoft);
      context.globalAlpha = 0.2;
      context.fillStyle = wash;
      context.fillRect(0, 0, width, height);

      context.globalCompositeOperation = "lighter";
      for (const particle of particles) drawPair(particle, time, true);
      for (const particle of particles) drawPair(particle, time, false);

      const y0 = height / 2;
      const lineGradient = context.createLinearGradient(0, 0, width, 0);
      lineGradient.addColorStop(0, palette.teal);
      lineGradient.addColorStop(sourceRatio, palette.paper);
      lineGradient.addColorStop(1, palette.acid);
      context.fillStyle = lineGradient;
      context.globalAlpha = 0.055;
      context.fillRect(0, y0 - 6, width, 12);
      context.globalAlpha = 0.18;
      context.fillRect(0, y0 - 2, width, 4);
      context.globalAlpha = 0.92;
      context.fillRect(0, y0 - 0.5, width, 1); // invariant geometry: exact edge-to-edge y = height / 2

      const sourceX = sourceRatio * width;
      const breath = reducedMotion ? 1 : 0.98 + Math.sin(time * 0.0013) * 0.02;
      const glow = context.createRadialGradient(sourceX, y0, 0, sourceX, y0, 32);
      glow.addColorStop(0, palette.paper);
      glow.addColorStop(0.12, palette.teal);
      glow.addColorStop(0.42, palette.acid);
      glow.addColorStop(1, "transparent");
      context.globalAlpha = 0.42 * breath;
      context.fillStyle = glow;
      context.beginPath();
      context.arc(sourceX, y0, 32, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 0.95;
      context.fillStyle = palette.paper;
      context.beginPath();
      context.arc(sourceX, y0, 2.2, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    };

    const tick = (time: number) => {
      if (disposed || reducedMotion || !visible || document.visibilityState !== "visible") {
        stop();
        return;
      }
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      for (const particle of particles) {
        particle.x = (particle.x + particle.speed * delta) % Math.max(1, width);
      }
      render(time);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      stop();
      if (width && height) render(performance.now());
      if (!reducedMotion && visible && document.visibilityState === "visible") {
        frame = requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      const bounds = section.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      // A 2x DPR cap preserves sharpness without multiplying fill cost on dense displays.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      initialize();
      start();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    const onVisibilityChange = () => start();
    const onMotionChange = () => {
      reducedMotion = motionQuery.matches;
      start();
    };

    reducedMotion = motionQuery.matches;
    resizeObserver.observe(section);
    intersectionObserver.observe(section);
    document.addEventListener("visibilitychange", onVisibilityChange);
    motionQuery.addEventListener("change", onMotionChange);
    resize();

    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [sourceRatio]);

  return (
    <section
      ref={sectionRef}
      className="heteroscedastic-field"
      data-heteroscedastic-field
      aria-label={DESCRIPTION}
      style={{ "--heteroscedastic-source-x": `${sourceRatio * 100}%` } as React.CSSProperties}
    >
      <p className="sr-only">{DESCRIPTION}</p>
      <span className="heteroscedastic-field__fallback-line" aria-hidden="true" />
      <span className="heteroscedastic-field__source" aria-hidden="true" />
      <canvas ref={canvasRef} className="heteroscedastic-field__canvas" aria-hidden="true" />
    </section>
  );
}
