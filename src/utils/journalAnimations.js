import { animate, createTimeline, stagger, utils } from "animejs";

/**
 * Journal page motion utilities (Anime.js v4).
 * All helpers are no-ops when the user prefers reduced motion.
 */

export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Safely stop/cancel an Anime.js instance. */
export function stopAnim(anim) {
  if (!anim) return;
  try {
    if (typeof anim.cancel === "function") anim.cancel();
    else anim.pause();
  } catch {
    /* noop */
  }
}

/** Hide elements before an entrance timeline starts (avoids flash). */
function setHidden(targets, props = {}) {
  if (!targets || prefersReducedMotion()) return;
  utils.set(targets, { opacity: 0, ...props });
}

/**
 * Cinematic page opening: the journal "awakens".
 * Elements pop in with spring-like overshoot, tiny rotations and gentle
 * vertical movement; a final decorative settle finishes the sequence.
 * Returns a cleanup function.
 */
export function runJournalEntrance({ label, date, writer, tip, footer, sidebar, workspace }) {
  if (prefersReducedMotion()) return () => {};

  const targets = [label?.current, date?.current, writer?.current, tip?.current, footer?.current].filter(Boolean);
  setHidden(targets, { translateY: 22 });
  if (sidebar?.current) utils.set(sidebar.current, { opacity: 0, translateX: 28, translateY: 0 });

  // Fail-safe: whatever happens below, everything is force-revealed after
  // 1.6s so the journal editor can NEVER be left hidden by animation.
  const revealAll = () => {
    try {
      const all = [...targets];
      if (sidebar?.current) all.push(sidebar.current);
      utils.set(all, { opacity: 1, transform: "none" });
    } catch {
      /* noop */
    }
  };
  const safety = setTimeout(revealAll, 1600);

  try {
    const tl = createTimeline({ defaults: { ease: "out(3)", duration: 600 } });
  // 1. Label reveals with a gentle drop.
  if (label?.current)
    tl.add(label.current, { opacity: [0, 1], translateY: [-10, 0], scale: [0.96, 1], duration: 480 }, 0);
  // 2. Date pops in with slight spring overshoot.
  if (date?.current)
    tl.add(date.current, { opacity: [0, 1], translateY: [16, 0], scale: [0.96, 1], ease: "outBack(1.4)", duration: 560 }, 150);
  // 3. Writing area gently rises and un-scales.
  if (writer?.current)
    tl.add(writer.current, { opacity: [0, 1], translateY: [20, 0], scale: [0.985, 1], duration: 720 }, 320);
  // 4. Tip banner settles with a whisper of rotation.
  if (tip?.current)
    tl.add(tip.current, { opacity: [0, 1], translateY: [12, 0], rotate: [-1.2, 0], ease: "outBack(1.2)", duration: 520 }, 540);
  // 5. Footer rises last.
  if (footer?.current) tl.add(footer.current, { opacity: [0, 1], translateY: [12, 0], duration: 480 }, 640);
  // 6. Archive glides in from the right, slightly after the workspace.
  if (sidebar?.current)
    tl.add(sidebar.current, { opacity: [0, 1], translateX: [28, 0], duration: 720 }, 500);

  // 7. Final decorative settle: the workspace card breathes once.
    if (workspace?.current) {
      tl.add(
        workspace.current,
        { scale: [1, 1.006, 1], duration: 500, ease: "inOut(2)" },
        900
      );
    }

    return () => {
      clearTimeout(safety);
      stopAnim(tl);
    };
  } catch {
    // Anime.js unavailable/failed → reveal everything immediately.
    clearTimeout(safety);
    revealAll();
    return () => {};
  }
}

/**
 * Staged reveal of the AI Structured Journal Extraction section:
 * section -> header -> summary -> activity/blocker cards -> icons.
 */
export function runAnalysisReveal(sectionRef) {
  const section = sectionRef?.current;
  if (!section || prefersReducedMotion()) return () => {};

  const header = section.querySelector("[data-ai-header]");
  const summary = section.querySelector("[data-ai-summary]");
  const cards = section.querySelectorAll("[data-ai-card]");
  const icons = section.querySelectorAll("[data-ai-icon]");

  utils.set(section, { opacity: 0, translateY: 18 });
  if (header) utils.set(header, { opacity: 0, translateY: -6 });
  if (summary) utils.set(summary, { opacity: 0, translateY: 12 });
  utils.set(cards, { opacity: 0, translateY: 14 });
  utils.set(icons, { opacity: 0, scale: 0.4 });

  const tl = createTimeline({ defaults: { ease: "out(3)", duration: 520 } });
  tl.add(section, { opacity: [0, 1], translateY: [18, 0], duration: 560 }, 0);
  if (header) tl.add(header, { opacity: [0, 1], translateY: [-6, 0], duration: 420 }, 140);
  if (summary) tl.add(summary, { opacity: [0, 1], translateY: [12, 0], duration: 480 }, 260);
  if (cards.length) tl.add(cards, { opacity: [0, 1], translateY: [14, 0], delay: stagger(110) }, 400);
  if (icons.length)
    tl.add(icons, { opacity: [0, 1], scale: [0.4, 1], ease: "outBack(1.6)", duration: 440 }, 540);

  return () => stopAnim(tl);
}

/** Stagger the journal history cards in when the archive first loads. */
export function animateHistoryEntrance(container) {
  if (!container || prefersReducedMotion()) return;
  const cards = container.querySelectorAll("[data-journal-card]");
  if (!cards.length) return;
  animate(cards, {
    opacity: [0, 1],
    translateY: [18, 0],
    scale: [0.97, 1],
    duration: 560,
    delay: stagger(70),
    ease: "outBack(1.2)",
  });
}

/**
 * Subtle stagger when the visible search result set changes.
 * Only called after debounce — never on every keystroke.
 */
export function animateSearchSettle(container) {
  if (!container || prefersReducedMotion()) return;
  const cards = container.querySelectorAll("[data-journal-card]");
  if (!cards.length) return;
  animate(cards, {
    opacity: [0.4, 1],
    translateY: [6, 0],
    duration: 360,
    delay: stagger(35),
    ease: "out(3)",
  });
}

/** Animate a history card out before deletion (resolves when finished). */
export function animateCardExit(card) {
  return new Promise((resolve) => {
    if (!card || prefersReducedMotion()) return resolve();
    animate(card, {
      opacity: [1, 0],
      translateX: [0, 24],
      scale: [1, 0.98],
      duration: 240,
      ease: "in(2)",
      onComplete: resolve,
    });
  });
}

/** Refined pulse when a history card is selected ("picked" feeling). */
export function animateSelectPulse(card) {
  if (!card || prefersReducedMotion()) return;
  animate(card, { scale: [1, 1.015, 1], duration: 340, ease: "out(3)" });
  const emoji = card.querySelector("[data-emoji]");
  if (emoji) animate(emoji, { scale: [1, 1.35, 1], rotate: [0, -8, 0], duration: 420, ease: "outBack(1.6)" });
}

/**
 * Emoji personality on journal card hover — each emoji reacts differently.
 * 🧠 bobs, 🎯 scales, ⌛ tilts. Runs only on hover, never continuously.
 */
export function animateEmojiHover(card) {
  if (!card || prefersReducedMotion()) return;
  const emoji = card.querySelector("[data-emoji]");
  if (!emoji) return;
  const kind = emoji.getAttribute("data-emoji");
  if (kind === "brain") {
    animate(emoji, { translateY: [0, -3, 0], duration: 420, ease: "inOut(2)" });
  } else if (kind === "target") {
    animate(emoji, { scale: [1, 1.2, 1], duration: 420, ease: "outBack(1.8)" });
  } else if (kind === "blocker") {
    animate(emoji, { rotate: [0, -10, 8, 0], duration: 480, ease: "inOut(2)" });
  } else {
    animate(emoji, { scale: [1, 1.15, 1], duration: 380, ease: "out(3)" });
  }
}

/** "The journal is listening" — throttled counter pulse while typing. */
export function animateCounterPulse(counterEl) {
  if (!counterEl || prefersReducedMotion()) return;
  animate(counterEl, { scale: [1, 1.06, 1], duration: 240, ease: "out(3)" });
}

/** Tactile button press: dip then spring back. */
export function animateButtonPress(buttonEl) {
  if (!buttonEl || prefersReducedMotion()) return;
  animate(buttonEl, { scale: [0.96, 1], duration: 300, ease: "outBack(1.6)" });
}

/** Sparkles icon leans toward the cursor's intention on hover. */
export function animateSparkleHover(iconEl) {
  if (!iconEl || prefersReducedMotion()) return;
  animate(iconEl, { rotate: [0, 20, 0], scale: [1, 1.15, 1], duration: 500, ease: "inOut(2)" });
}

/* ------------------------------------------------------------------ */
/* EDITOR EXPERIENCE — thought spark, particles, counters, save moment */
/* ------------------------------------------------------------------ */

/**
 * Idle loop for the empty-editor "thought spark" (✦ pulse between two
 * subtle states + tiny drift). Returns a stop function.
 * No-op under reduced motion.
 */
export function thoughtSparkLoop(el) {
  if (!el || prefersReducedMotion()) return () => {};
  const anim = animate(el, {
    scale: [1, 1.28, 1],
    opacity: [0.65, 1, 0.65],
    translateY: [-2, 2, -2],
    duration: 2800,
    ease: "inOut(2)",
    loop: true,
  });
  return () => stopAnim(anim);
}

/**
 * One-shot reaction when the user starts typing: the spark settles and
 * fades to a calm "writing" state. Safe to call repeatedly (restarting
 * the transition is intentional and cheap).
 */
export function settleThoughtSpark(el) {
  if (!el || prefersReducedMotion()) return;
  animate(el, {
    scale: [1.3, 0.9],
    opacity: [1, 0.45],
    duration: 420,
    ease: "out(3)",
  });
}

/**
 * 2–4 faint "thought energy" particles drifting slowly around the
 * editor while the user writes. Created inside the editor's decorative
 * layer (position:relative required). Returns a stop function that
 * removes the particles.
 */
export function startThinkingParticles(layerEl) {
  if (!layerEl || prefersReducedMotion()) return () => {};
  const isSmall = window.innerWidth < 640;
  const n = isSmall ? 2 : 4;
  const dots = [];

  for (let i = 0; i < n; i++) {
    const dot = document.createElement("span");
    dot.setAttribute("aria-hidden", "true");
    dot.style.cssText = `position:absolute;border-radius:9999px;background:${
      i % 2 ? "#a78bfa" : "#818cf8"
    };width:${3 + i}px;height:${3 + i}px;opacity:0;pointer-events:none;`;
    layerEl.appendChild(dot);
    dots.push(dot);
  }

  const anims = dots.map((dot, i) =>
    animate(dot, {
      opacity: [{ to: 0, duration: 1 }, { to: 0.5, duration: 800 }, { to: 0, duration: 800 }],
      translateX: [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 120],
      translateY: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 80],
      duration: 3200 + i * 600,
      ease: "inOut(2)",
      loop: true,
      delay: i * 350,
    })
  );

  return () => {
    anims.forEach(stopAnim);
    dots.forEach((d) => d.remove());
  };
}

/**
 * Spring transition on the character counter when its value changes.
 * Small scale/translate bounce — not flashy.
 */
export function pulseCounter(el) {
  if (!el || prefersReducedMotion()) return;
  animate(el, {
    scale: [1.18, 1],
    translateY: [-2, 0],
    duration: 320,
    ease: "outBack(2.4)",
  });
}

/**
 * "Reflection captured" moment after a successful save: a small ✦ is
 * born over the editor, travels toward the Journal History panel,
 * pops, and fades. Purely decorative — the REAL save has already
 * happened when this is called. Self-cleaning.
 */
export function flyInsightToHistory(editorEl, historyEl) {
  if (!editorEl || prefersReducedMotion()) return;
  const scope = editorEl.closest("[data-particle-scope]") || editorEl.parentElement;
  if (!scope) return;

  const eRect = editorEl.getBoundingClientRect();
  const hRect = historyEl
    ? historyEl.getBoundingClientRect()
    : { left: eRect.right, top: eRect.top, width: 0, height: 0 };
  const scopeRect = scope.getBoundingClientRect();

  const startX = eRect.left - scopeRect.left + eRect.width / 2;
  const startY = eRect.top - scopeRect.top + eRect.height / 2;
  const endX = hRect.left - scopeRect.left + hRect.width / 2;
  const endY = hRect.top - scopeRect.top + Math.max(hRect.height / 2, 120);

  const spark = document.createElement("span");
  spark.setAttribute("aria-hidden", "true");
  spark.textContent = "✦";
  spark.style.cssText = `position:absolute;left:${startX}px;top:${startY}px;font-size:18px;color:#6366f1;pointer-events:none;z-index:40;transform:translate(-50%,-50%);`;
  scope.appendChild(spark);

  animate(spark, {
    translateX: [0, endX - startX],
    translateY: [0, endY - startY],
    scale: [{ from: 0.4, to: 1.3, duration: 300, ease: "outBack(2)" }, { to: 0.7 }],
    opacity: [{ from: 0, to: 1, duration: 180 }, { to: 0.9, duration: 500 }, { to: 0, duration: 320 }],
    duration: 1000,
    ease: "inOut(2)",
    onComplete: () => spark.remove(),
  });
}

/**
 * Entrance for a NEWLY created journal card (first card in the history
 * list right after a save): scale 0.96 → spring to 1 with a brief
 * indigo ring highlight, then settle. ~1.4s total.
 */
export function celebrateNewHistoryCard(cardEl) {
  if (!cardEl || prefersReducedMotion()) return;
  animate(cardEl, {
    scale: [0.96, 1.02, 1],
    opacity: [0, 1],
    duration: 620,
    ease: "outBack(1.8)",
  });
  animate(cardEl, {
    boxShadow: [
      "0 0 0 0 rgba(99,102,241,0)",
      "0 0 0 4px rgba(99,102,241,0.25)",
      "0 0 0 0 rgba(99,102,241,0)",
    ],
    duration: 1400,
    ease: "out(2)",
  });
}
