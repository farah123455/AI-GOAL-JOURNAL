/**
 * src/components/CircularProgress.jsx
 * Circular progress indicator built with SVG.
 * On mount the ring draws itself from empty to its real value (Anime.js),
 * giving every progress ring across the app a visible entrance.
 */
import { useLayoutEffect, useRef } from "react";
import { animate } from "animejs";
import { prefersReducedMotion } from "../animations/motion";

export default function CircularProgress({
  value,
  className = "w-24 h-24",
  trackClass = "stroke-slate-200",
  fillClass = "stroke-indigo-600",
  center,
}) {
  const safeValue = (() => {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.min(100, Math.max(0, Math.round(n)));
  })();

  const ringRef = useRef(null);

  const radius = 38;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (safeValue / 100) * circumference;

  // Draw-in on mount: from a fully empty ring to the real value.
  useLayoutEffect(() => {
    const ring = ringRef.current;
    if (!ring || prefersReducedMotion()) return;
    ring.style.transition = "none";
    const anim = animate(ring, {
      strokeDashoffset: [circumference, dashoffset],
      duration: 1100,
      delay: 250,
      ease: "out(3)",
      onComplete: () => {
        ring.style.transition = "";
      },
    });
    return () => {
      anim.pause();
      anim.revert?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={"relative inline-flex items-center justify-center " + className}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        className="block"
        role="img"
        aria-label={`Progress: ${safeValue}%`}
      >
        <circle
          className={trackClass}
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
        />
        <g transform="rotate(-90 50 50)">
          <circle
            ref={ringRef}
            className={fillClass}
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{
              transition: "stroke-dashoffset 500ms ease, stroke 500ms ease",
            }}
          />
        </g>
      </svg>
      <span className="absolute pointer-events-none text-xs font-bold text-slate-900 sm:text-sm">
        {center ?? `${safeValue}%`}
      </span>
    </div>
  );
}
