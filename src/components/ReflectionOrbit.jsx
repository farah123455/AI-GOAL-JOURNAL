import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { prefersReducedMotion, stopAnim } from "../utils/journalAnimations";

/**
 * ReflectionOrbit — the Journal page's single ambient visual signature.
 * A faint ring with two tiny orbiting dots sits around the Analyze button,
 * communicating "reflection -> processing -> insight". It slowly drifts at
 * rest and accelerates while the AI analysis is running. Invisible to
 * screen readers, pointer-events disabled, respects reduced motion.
 */
export default function ReflectionOrbit({ active = false, className = "" }) {
  const orbitRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !orbitRef.current) return undefined;
    const anim = animate(orbitRef.current, {
      rotate: 360,
      duration: active ? 2400 : 12000,
      ease: "linear",
      loop: true,
    });
    return () => stopAnim(anim);
  }, [active]);

  return (
    <span aria-hidden="true" className={`pointer-events-none absolute -inset-[7px] ${className}`}>
      <span className="absolute inset-0 rounded-full border border-indigo-200/70" />
      <span ref={orbitRef} className="absolute inset-0">
        <span
          className={`absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400 transition-opacity duration-500 ${
            active ? "opacity-100" : "opacity-40"
          }`}
        />
        <span
          className={`absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 translate-y-1/2 rounded-full bg-violet-300 transition-opacity duration-500 ${
            active ? "opacity-90" : "opacity-30"
          }`}
        />
      </span>
    </span>
  );
}