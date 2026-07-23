"use client";

import { useEffect, useRef } from "react";

const DNA_PATHS = [
  ["top-node", "M 678.671875 188.234375 C 678.671875 216.90625 655.429688 240.152344 626.753906 240.152344 C 598.078125 240.152344 574.835938 216.90625 574.835938 188.234375 C 574.835938 159.558594 598.078125 136.316406 626.753906 136.316406 C 655.429688 136.316406 678.671875 159.558594 678.671875 188.234375"],
  ["bottom-node", "M 677.875 1017.609375 C 677.875 1045.835938 654.996094 1068.714844 626.769531 1068.714844 C 598.546875 1068.714844 575.664062 1045.835938 575.664062 1017.609375 C 575.664062 989.386719 598.546875 966.507812 626.769531 966.507812 C 654.996094 966.507812 677.875 989.386719 677.875 1017.609375"],
  ["bottom-rung-2", "M 686.378906 874.214844 C 692.945312 862.082031 707.359375 859.570312 717.316406 867.207031 C 727.410156 874.949219 727.667969 890.464844 717.929688 898.460938 C 707.796875 906.78125 692.847656 904.5 686.503906 891.96875 L 567.761719 892 C 561.515625 904.152344 546.730469 906.667969 536.726562 898.90625 C 526.949219 891.324219 526.574219 875.855469 536.21875 867.714844 C 545.929688 859.519531 561.21875 861.84375 567.570312 874.1875 Z M 686.378906 874.214844"],
  ["bottom-rung-1", "M 568.210938 789.382812 C 563.167969 797.90625 554.4375 802.515625 545.085938 800.453125 C 535.816406 798.40625 529.394531 790.238281 529.261719 781.300781 C 529.117188 771.421875 535.457031 763.230469 543.964844 761.136719 C 554.160156 758.625 563.066406 762.957031 567.925781 771.914062 L 686.296875 771.921875 C 690.789062 763.28125 699.75 759.097656 708.636719 760.796875 C 718.261719 762.636719 724.5625 770.515625 724.984375 779.683594 C 725.425781 789.347656 719.207031 797.636719 710.40625 800.0625 C 700.757812 802.722656 691.179688 798.710938 686.421875 789.425781 Z M 568.210938 789.382812"],
  ["left-node", "M 403.234375 613.863281 C 403.234375 643.382812 379.304688 667.3125 349.785156 667.3125 C 320.265625 667.3125 296.335938 643.382812 296.335938 613.863281 C 296.335938 584.34375 320.265625 560.414062 349.785156 560.414062 C 379.304688 560.414062 403.234375 584.34375 403.234375 613.863281"],
  ["left-link-top", "M 394.300781 577.160156 L 377.957031 564.257812 L 452.378906 489.726562 L 464.625 506.953125 Z M 394.300781 577.160156"],
  ["left-link-bottom", "M 450.371094 735.554688 L 378.070312 663.671875 L 394.527344 650.242188 L 461.929688 717.414062 Z M 450.371094 735.554688"],
  ["right-node", "M 954.902344 613.78125 C 954.902344 643.304688 930.96875 667.238281 901.445312 667.238281 C 871.921875 667.238281 847.988281 643.304688 847.988281 613.78125 C 847.988281 584.261719 871.921875 560.324219 901.445312 560.324219 C 930.96875 560.324219 954.902344 584.261719 954.902344 613.78125"],
  ["right-link-top", "M 858.78125 576.933594 L 787.820312 506.152344 L 800.089844 488.453125 L 875.128906 563.679688 Z M 858.78125 576.933594"],
  ["right-link-bottom", "M 803.09375 735.238281 L 791.273438 717.414062 L 857.828125 650.78125 L 874.007812 664.433594 Z M 803.09375 735.238281"],
  ["helix-primary", "M 687.035156 995.484375 C 683.664062 988.46875 680.097656 982.179688 675.453125 976.042969 L 691.480469 959.398438 C 710.964844 938.980469 728.832031 917.898438 743.800781 893.914062 C 781.332031 833.769531 777 777.929688 729.472656 725.480469 C 715.367188 709.914062 700.707031 696.015625 684.636719 682.261719 C 648.953125 651.726562 612.625 623.210938 574.988281 595.109375 L 523.769531 555.226562 C 506.996094 542.164062 492.179688 527.847656 477.964844 512.078125 C 471.144531 504.503906 465.53125 496.605469 459.851562 488.035156 C 448.03125 470.1875 440.269531 450.191406 436.011719 429.027344 C 417.648438 337.714844 499.03125 262.675781 567.546875 214.851562 C 570.78125 222.058594 574.722656 227.800781 579.34375 233.648438 C 560.953125 252.433594 543.953125 270.804688 528.195312 291.144531 C 492.257812 337.550781 467.914062 395.328125 496.117188 450.96875 C 513.140625 484.558594 545.296875 511.707031 575.253906 534.757812 L 630.664062 577.398438 C 662.757812 602.09375 693.457031 627.234375 723.277344 654.679688 C 744.355469 674.082031 763.859375 693.949219 781.609375 716.304688 L 800.019531 744.09375 C 816.242188 771.960938 822.191406 804.679688 816.613281 836.550781 C 809.46875 877.378906 781.609375 913 752.757812 941.816406 C 732.347656 961.214844 711.199219 978.527344 687.035156 995.484375"],
  ["helix-upper-return", "M 679.894531 588 L 640.722656 559.207031 L 688.195312 526.207031 C 705.492188 514.179688 720.070312 499.808594 734.027344 484.078125 C 771.371094 441.972656 779.054688 392.644531 755.808594 341.167969 C 737.308594 300.203125 704.972656 265.1875 674.101562 233.460938 C 679.074219 227.699219 682.878906 221.785156 686.117188 214.929688 C 711.441406 232.929688 735.300781 251.824219 757.003906 273.921875 C 783.089844 300.304688 809.34375 337.445312 816.148438 373.933594 C 823.121094 411.304688 816.390625 444.582031 798.964844 477.925781 L 777.675781 508.710938 C 762.050781 526.8125 744.460938 541.886719 725.652344 556.671875 Z M 679.894531 588"],
  ["helix-lower-return", "M 578.183594 975.671875 C 573.472656 982 569.777344 987.941406 566.746094 995.472656 C 511.21875 956.40625 441.976562 896.800781 435.117188 825.90625 C 432.519531 799.058594 438.234375 772.542969 450.847656 748.796875 L 466.144531 724.070312 C 477.617188 705.527344 493.164062 691.03125 508.664062 675.597656 C 529.4375 655.75 551.875 638.71875 575.691406 622.742188 L 614.191406 651.460938 C 590.769531 667.265625 568.285156 683.210938 547.207031 702.140625 C 494.808594 749.128906 465.941406 802.984375 497.589844 871.507812 C 515.289062 909.832031 547.566406 945.148438 578.183594 975.671875"],
  ["top-rung-2", "M 686.417969 426.4375 C 690.824219 417.589844 699.667969 413.503906 709.058594 415.378906 C 718.125 417.1875 724.679688 425.339844 724.992188 434.609375 C 725.308594 443.996094 719.039062 452.03125 710.683594 454.394531 C 700.9375 457.152344 691.34375 453.503906 686.449219 444.011719 L 567.957031 444.011719 C 563.136719 452.660156 554.453125 456.777344 544.867188 454.800781 C 535.960938 452.960938 529.21875 445.089844 529.183594 435.488281 C 529.148438 426.386719 534.910156 418.160156 543.558594 415.84375 C 552.988281 413.316406 562.691406 416.570312 567.59375 426.359375 Z M 686.417969 426.4375"],
  ["top-rung-1", "M 686.3125 323.726562 C 691.171875 314.636719 700.242188 310.757812 709.582031 312.824219 C 718.757812 314.851562 724.957031 323.035156 724.996094 332.515625 C 725.035156 341.761719 718.574219 349.996094 709.628906 352.226562 C 700.441406 354.515625 691.113281 350.222656 686.375 341.445312 L 567.746094 341.546875 C 562.9375 350.390625 553.78125 354.421875 544.460938 352.210938 C 535.519531 350.085938 529.125 341.855469 529.246094 332.589844 C 529.367188 323.125 535.277344 314.988281 544.527344 312.878906 C 553.644531 310.800781 563.066406 314.570312 567.699219 323.722656 Z M 686.3125 323.726562"],
] as const;

const INTRO_STORAGE_KEY = "jpc-dna-mark-intro-v1";
const INITIAL_DELAY_MS = 1800;
const HOVER_INTENT_DELAY_MS = 260;
const FOCUS_INTENT_DELAY_MS = 140;
const REPLAY_COOLDOWN_MS = 650;
const MOTION_DURATION_MS = 2400;

const MOTION_KEYFRAMES: Keyframe[] = [
  { transform: "rotateY(0deg)", offset: 0 },
  { transform: "rotateY(0deg)", offset: 0.06, easing: "cubic-bezier(.4,0,.2,1)" },
  { transform: "rotateY(-7deg)", offset: 0.115, easing: "cubic-bezier(.4,0,.2,1)" },
  { transform: "rotateY(0deg)", offset: 0.17, easing: "linear" },
  { transform: "rotateY(360deg)", offset: 0.79, easing: "cubic-bezier(.2,.75,.3,1)" },
  { transform: "rotateY(369deg)", offset: 0.855, easing: "cubic-bezier(.22,.8,.36,1)" },
  { transform: "rotateY(357.5deg)", offset: 0.925, easing: "cubic-bezier(.22,.8,.36,1)" },
  { transform: "rotateY(361.5deg)", offset: 0.973, easing: "cubic-bezier(.22,.8,.36,1)" },
  { transform: "rotateY(360deg)", offset: 1 },
];

type BrandMarkProps = {
  className?: string;
  intro?: boolean;
  interactive?: boolean;
};

function hasSeenIntro() {
  try {
    return window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "complete";
  } catch {
    return document.documentElement.dataset.dnaIntro === "complete";
  }
}

function markIntroComplete() {
  document.documentElement.dataset.dnaIntro = "complete";
  try {
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, "complete");
  } catch {
    // A blocked storage API must never prevent the visual treatment from working.
  }
}

export function BrandMark({
  className = "",
  intro = false,
  interactive = false,
}: BrandMarkProps) {
  const shellRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const svg = svgRef.current;
    if (!shell || !svg) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let animation: Animation | null = null;
    let introTimer: number | undefined;
    let intentTimer: number | undefined;
    let focusTimer: number | undefined;
    let observer: IntersectionObserver | undefined;
    let introIsVisible = false;
    let disposed = false;
    let lastFinishedAt = 0;

    const introHasCompleted = () =>
      document.documentElement.dataset.dnaIntro === "complete" || hasSeenIntro();

    const clearIntentTimers = () => {
      window.clearTimeout(intentTimer);
      window.clearTimeout(focusTimer);
      intentTimer = undefined;
      focusTimer = undefined;
    };

    const finish = (kind: "intro" | "replay") => {
      shell.dataset.animating = "false";
      svg.style.transform = "";
      animation = null;
      lastFinishedAt = window.performance.now();
      if (kind === "intro") markIntroComplete();
    };

    const play = (kind: "intro" | "replay") => {
      if (
        disposed ||
        reducedMotion.matches ||
        animation ||
        typeof svg.animate !== "function" ||
        (kind === "replay" && !introHasCompleted()) ||
        (kind === "replay" &&
          window.performance.now() - lastFinishedAt < REPLAY_COOLDOWN_MS)
      ) {
        if (kind === "intro" && (reducedMotion.matches || typeof svg.animate !== "function")) {
          markIntroComplete();
        }
        return;
      }

      shell.dataset.animating = "true";
      animation = svg.animate(MOTION_KEYFRAMES, {
        duration: MOTION_DURATION_MS,
        fill: "none",
        iterations: 1,
      });
      animation.finished.then(() => finish(kind)).catch(() => {
        if (!disposed) finish(kind);
      });
    };

    const scheduleIntro = () => {
      if (
        !intro ||
        !introIsVisible ||
        document.visibilityState !== "visible" ||
        introTimer !== undefined ||
        introHasCompleted()
      ) {
        return;
      }
      introTimer = window.setTimeout(() => {
        introTimer = undefined;
        if (document.visibilityState === "visible") play("intro");
      }, INITIAL_DELAY_MS);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        window.clearTimeout(introTimer);
        introTimer = undefined;
      } else {
        scheduleIntro();
      }
    };

    const onPointerEnter = (event: PointerEvent) => {
      if (
        !interactive ||
        event.pointerType === "touch" ||
        !precisePointer.matches ||
        !introHasCompleted()
      ) {
        return;
      }
      window.clearTimeout(intentTimer);
      intentTimer = window.setTimeout(() => play("replay"), HOVER_INTENT_DELAY_MS);
    };

    const onPointerLeave = () => {
      window.clearTimeout(intentTimer);
      intentTimer = undefined;
    };

    const focusTarget = shell.closest<HTMLElement>(
      "a[href], button, [tabindex]:not([tabindex='-1'])",
    );
    const onFocusIn = () => {
      if (!interactive || !introHasCompleted() || !focusTarget?.matches(":focus-visible")) {
        return;
      }
      window.clearTimeout(focusTimer);
      focusTimer = window.setTimeout(() => play("replay"), FOCUS_INTENT_DELAY_MS);
    };
    const onFocusOut = () => {
      window.clearTimeout(focusTimer);
      focusTimer = undefined;
    };

    const onMotionPreferenceChange = () => {
      if (!reducedMotion.matches) return;
      animation?.cancel();
      animation = null;
      shell.dataset.animating = "false";
      svg.style.transform = "";
      if (intro) markIntroComplete();
    };

    if (intro) {
      if (hasSeenIntro() || reducedMotion.matches) {
        markIntroComplete();
      } else {
        document.documentElement.dataset.dnaIntro = "pending";
        if ("IntersectionObserver" in window) {
          observer = new IntersectionObserver(
            ([entry]) => {
              introIsVisible = entry.isIntersecting && entry.intersectionRatio >= 0.6;
              scheduleIntro();
            },
            { threshold: [0.6] },
          );
          observer.observe(shell);
        } else {
          introIsVisible = true;
          scheduleIntro();
        }
      }
    }

    if (interactive) {
      shell.addEventListener("pointerenter", onPointerEnter);
      shell.addEventListener("pointerleave", onPointerLeave);
      focusTarget?.addEventListener("focusin", onFocusIn);
      focusTarget?.addEventListener("focusout", onFocusOut);
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener("change", onMotionPreferenceChange);

    return () => {
      disposed = true;
      clearIntentTimers();
      window.clearTimeout(introTimer);
      observer?.disconnect();
      animation?.cancel();
      shell.removeEventListener("pointerenter", onPointerEnter);
      shell.removeEventListener("pointerleave", onPointerLeave);
      focusTarget?.removeEventListener("focusin", onFocusIn);
      focusTarget?.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener("change", onMotionPreferenceChange);
    };
  }, [interactive, intro]);

  return (
    <span
      aria-hidden="true"
      className={`brand-mark-shell ${className}`.trim()}
      data-animating="false"
      data-brand-interactive={interactive ? "true" : undefined}
      data-brand-intro={intro ? "true" : undefined}
      data-brand-mark="dna-helix"
      ref={shellRef}
    >
      <svg
        className="brand-mark"
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        ref={svgRef}
        viewBox="280 120 694 965"
      >
        {DNA_PATHS.map(([id, path]) => (
          <path d={path} fillRule="nonzero" key={id} />
        ))}
      </svg>
    </span>
  );
}
