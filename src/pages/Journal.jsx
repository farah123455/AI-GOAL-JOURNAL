import { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  BookOpen,
  Mic,
  FileText,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  Calendar,
  Search,
  Plus,
  PenLine,
} from "lucide-react";
import VoiceRecorder from "../components/VoiceRecorder";
import { journalApi } from "../services/api";
import { useData } from "../context/DataContext";
import { GridSkeleton, JournalLoadingState } from "../components/LoadingSkeleton";
import ReflectionOrbit from "../components/ReflectionOrbit";
import { animate, createTimeline, utils } from "animejs";
import {
  prefersReducedMotion,
  runJournalEntrance,
  runAnalysisReveal,
  animateHistoryEntrance,
  animateSearchSettle,
  animateCardExit,
  animateSelectPulse,
  animateEmojiHover,
  animateCounterPulse,
  animateButtonPress,
  animateSparkleHover,
  thoughtSparkLoop,
  settleThoughtSpark,
  startThinkingParticles,
  flyInsightToHistory,
  celebrateNewHistoryCard,
  stopAnim,
} from "../utils/journalAnimations";

export default function Journal() {
  const {
    journals,
    hasLoadedJournals,
    fetchJournals,
    addJournal,
    deleteJournalFromCache,
  } = useData();

  const [activeTab, setActiveTab] = useState("text"); // 'text' | 'voice'
  const [displayTab, setDisplayTab] = useState("text"); // lags activeTab so mode content can animate out/in
  const [entryText, setEntryText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJournal, setSelectedJournal] = useState(null);
  // Post-save flow state: which entry was just created, and whether to show
  // the brief "Reflection saved" feedback. Animation-only, cleared after use.
  const [newlyAddedJournalId, setNewlyAddedJournalId] = useState(null);
  const [savedFlag, setSavedFlag] = useState(false);

  const loadingList = !hasLoadedJournals;

  useEffect(() => {
    fetchJournals({ quiet: hasLoadedJournals });
  }, [fetchJournals, hasLoadedJournals]);

  // Derived list — declared early so animation effects below can reference it.
  const filteredJournals = searchQuery.trim()
    ? journals.filter(
        (j) =>
          j.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : journals;

  // ===== Motion: Anime.js refs & effects (presentation only) =====
  const labelRef = useRef(null);
  const dateRef = useRef(null);
  const writerRef = useRef(null);
  const tipRef = useRef(null);
  const footerRef = useRef(null);
  const sidebarRef = useRef(null);
  const analysisRef = useRef(null);
  const historyListRef = useRef(null);
  const analyzeBtnRef = useRef(null);
  const sparkleRef = useRef(null);
  const shimmerRef = useRef(null);
  const focusBarRef = useRef(null);
  const focusHaloRef = useRef(null);
  const focusDotRef = useRef(null);
  const submitLoopRef = useRef(null);
  const shimmerLoopRef = useRef(null);
  const historyAnimatedRef = useRef(false);
  const workspaceRef = useRef(null);
  const autosavePillRef = useRef(null);
  const tipSparkleRef = useRef(null);
  const emptyStateRef = useRef(null);
  const counterRef = useRef(null);
  const modePillRef = useRef(null);
  const textTabBtnRef = useRef(null);
  const voiceTabBtnRef = useRef(null);
  const modeInitRef = useRef(false);
  const lastCounterPulseRef = useRef(0);
  const prevCountRef = useRef(null);
  // Editor "thought energy" refs (presentation only).
  const sparkRef = useRef(null);
  const particleLayerRef = useRef(null);
  const sparkStopRef = useRef(null);
  const editorParticlesRef = useRef(null);
  const saveTimerRef = useRef(null);
  // "Add Journal Entry" action button + textarea focus target.
  const addBtnRef = useRef(null);
  const addIconRef = useRef(null);
  const textAreaRef = useRef(null);
  const savedToastRef = useRef(null);

  // Slides the mode-switcher highlight pill behind the active tab button.
  function moveModePill(tab) {
    const btn = tab === "text" ? textTabBtnRef.current : voiceTabBtnRef.current;
    const pill = modePillRef.current;
    if (!btn || !pill) return;
    const left = btn.offsetLeft;
    const width = btn.offsetWidth;
    if (prefersReducedMotion()) {
      pill.style.left = `${left}px`;
      pill.style.width = `${width}px`;
      return;
    }
    animate(pill, { left, width, duration: 360, ease: "outBack(1.2)" });
  }

  // Cinematic page entrance (once on mount).
  useLayoutEffect(() => {
    const cleanup = runJournalEntrance({
      label: labelRef,
      date: dateRef,
      writer: writerRef,
      tip: tipRef,
      footer: footerRef,
      sidebar: sidebarRef,
      workspace: workspaceRef,
    });
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial pill position (no animation on first paint).
  useLayoutEffect(() => {
    const btn = textTabBtnRef.current;
    const pill = modePillRef.current;
    if (btn && pill) {
      pill.style.left = `${btn.offsetLeft}px`;
      pill.style.width = `${btn.offsetWidth}px`;
    }
  }, []);

  // Text <-> Voice mode transition: old mode exits, new mode springs in,
  // and the highlight pill glides across the switcher.
  useEffect(() => {
    if (activeTab === displayTab) {
      moveModePill(activeTab);
      if (!modeInitRef.current) {
        modeInitRef.current = true;
        return undefined;
      }
      if (prefersReducedMotion() || !writerRef.current) return undefined;
      const enter = animate(writerRef.current, {
        opacity: [0, 1],
        translateY: [10, 0],
        scale: [0.99, 1],
        duration: 440,
        ease: "outBack(1.2)",
      });
      return () => stopAnim(enter);
    }
    if (prefersReducedMotion() || !writerRef.current) {
      setDisplayTab(activeTab);
      return undefined;
    }
    let cancelled = false;
    const exit = animate(writerRef.current, {
      opacity: [1, 0],
      translateY: [0, -8],
      scale: [1, 0.99],
      duration: 150,
      ease: "in(2)",
      onComplete: () => {
        if (!cancelled) setDisplayTab(activeTab);
      },
    });
    return () => {
      cancelled = true;
      stopAnim(exit);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, displayTab]);

  // Occasional "delight" micro-loops: autosaved pill pulse + tip sparkle wink.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const loops = [];
    if (autosavePillRef.current) {
      loops.push(
        animate(autosavePillRef.current, {
          scale: [1, 1.08, 1],
          duration: 900,
          ease: "inOut(2)",
          loop: true,
          loopDelay: 6000,
        })
      );
    }
    if (tipSparkleRef.current) {
      loops.push(
        animate(tipSparkleRef.current, {
          rotate: [0, 18, 0],
          scale: [1, 1.12, 1],
          duration: 1200,
          ease: "inOut(2)",
          loop: true,
          loopDelay: 7000,
        })
      );
    }
    return () => loops.forEach(stopAnim);
  }, []);

  // Empty archive: the BookOpen icon floats gently.
  useEffect(() => {
    if (loadingList || filteredJournals.length > 0 || !emptyStateRef.current || prefersReducedMotion())
      return undefined;
    const float = animate(emptyStateRef.current, {
      translateY: [0, -5, 0],
      duration: 2600,
      ease: "inOut(2)",
      loop: true,
    });
    return () => stopAnim(float);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingList, filteredJournals.length]);

  // Search results changed (debounced) -> cards settle gracefully.
  useEffect(() => {
    if (loadingList) return undefined;
    const count = filteredJournals.length;
    if (prevCountRef.current === null) {
      prevCountRef.current = count;
      return undefined;
    }
    if (prevCountRef.current === count) return undefined;
    prevCountRef.current = count;
    const t = setTimeout(() => animateSearchSettle(historyListRef.current), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredJournals.length, loadingList]);

  // "The journal is listening" — throttled counter pulse while typing.
  useEffect(() => {
    if (!entryText) return;
    const now = Date.now();
    if (now - lastCounterPulseRef.current < 600) return;
    lastCounterPulseRef.current = now;
    animateCounterPulse(counterRef.current);
  }, [entryText]);

  // Empty-editor thought spark (idle) <-> typing "thought energy" particles.
  useEffect(() => {
    if (entryText) {
      // Writing: settle the spark, begin ambient particles.
      if (sparkStopRef.current) {
        sparkStopRef.current();
        sparkStopRef.current = null;
      }
      if (sparkRef.current) settleThoughtSpark(sparkRef.current);
      if (!editorParticlesRef.current && particleLayerRef.current) {
        editorParticlesRef.current = startThinkingParticles(particleLayerRef.current);
      }
    } else {
      // Empty: gather the editor, stop particles, start the idle spark loop.
      if (editorParticlesRef.current) {
        editorParticlesRef.current();
        editorParticlesRef.current = null;
      }
      if (sparkRef.current && !sparkStopRef.current) {
        sparkStopRef.current = thoughtSparkLoop(sparkRef.current);
      }
    }
  }, [entryText]);

  // Clean up the editor's decorative loops/particles on unmount.
  useEffect(
    () => () => {
      if (sparkStopRef.current) {
        sparkStopRef.current();
        sparkStopRef.current = null;
      }
      if (editorParticlesRef.current) {
        editorParticlesRef.current();
        editorParticlesRef.current = null;
      }
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    },
    []
  );

  // "AI thinking" state while Gemini analysis is running.
  useEffect(() => {
    if (submitting && !prefersReducedMotion()) {
      if (sparkleRef.current) {
        submitLoopRef.current = animate(sparkleRef.current, {
          rotate: [0, 14, -10, 0],
          scale: [1, 1.18, 1],
          duration: 1500,
          ease: "inOut(2)",
          loop: true,
        });
      }
      if (shimmerRef.current) {
        shimmerLoopRef.current = animate(shimmerRef.current, {
          opacity: [0, 0.85],
          translateX: ["-30%", "430%"],
          duration: 1500,
          ease: "inOut(2)",
          loop: true,
        });
      }
    }
    return () => {
      stopAnim(submitLoopRef.current);
      submitLoopRef.current = null;
      stopAnim(shimmerLoopRef.current);
      shimmerLoopRef.current = null;
    };
  }, [submitting]);

  // Staged reveal whenever a new AI analysis arrives.
  useEffect(() => {
    if (!latestAnalysis) return undefined;
    return runAnalysisReveal(analysisRef);
  }, [latestAnalysis]);

  // History cards stagger in once, when the archive first loads.
  useEffect(() => {
    if (loadingList || historyAnimatedRef.current) return;
    historyAnimatedRef.current = true;
    animateHistoryEntrance(historyListRef.current);
  }, [loadingList]);

  // Animate JUST the newly-created history card into place (specific entry).
  useEffect(() => {
    if (!newlyAddedJournalId) return undefined;
    saveTimerRef.current = setTimeout(() => {
      const card = historyListRef.current?.querySelector(`[data-journal-id="${newlyAddedJournalId}"]`);
      if (card) celebrateNewHistoryCard(card);
      setNewlyAddedJournalId(null);
    }, 80);
    return () => clearTimeout(saveTimerRef.current);
  }, [newlyAddedJournalId]);

  // Brief "✦ Reflection saved" feedback near the editor. Shows only after the
  // real API succeeded (savedFlag is set in handleSave's success path), then
  // animates in and fades out.
  useEffect(() => {
    if (!savedFlag) return undefined;
    const toast = savedToastRef.current;
    let fadeTimer;
    let anims = [];
    if (toast && !prefersReducedMotion()) {
      anims.push(
        animate(toast, {
          opacity: [0, 1],
          translateY: [8, 0],
          scale: [0.92, 1],
          duration: 380,
          ease: "outBack(1.6)",
        })
      );
    }
    fadeTimer = setTimeout(() => {
      if (toast && !prefersReducedMotion()) {
        anims.push(
          animate(toast, {
            opacity: [1, 0],
            translateY: [0, -6],
            duration: 320,
            ease: "in(2)",
            onComplete: () => setSavedFlag(false),
          })
        );
      } else {
        setSavedFlag(false);
      }
    }, 1900);
    return () => {
      clearTimeout(fadeTimer);
      anims.forEach(stopAnim);
    };
  }, [savedFlag]);

  // Refined focus effect for the writing area — the date subtly acknowledges you.
  function handleWriterFocus() {
    if (prefersReducedMotion()) return;
    if (focusBarRef.current)
      animate(focusBarRef.current, { opacity: [0, 1], scaleY: [0, 1], duration: 420, ease: "out(3)" });
    if (focusHaloRef.current)
      animate(focusHaloRef.current, { opacity: [0, 1], scale: [0.985, 1], duration: 420, ease: "out(3)" });
    if (focusDotRef.current)
      animate(focusDotRef.current, { opacity: [0, 1], translateY: [6, 0], duration: 420, ease: "out(3)" });
    if (dateRef.current)
      animate(dateRef.current, { scale: [1, 1.015, 1], duration: 420, ease: "out(3)" });
  }

  function handleWriterBlur() {
    if (prefersReducedMotion()) return;
    if (focusBarRef.current)
      animate(focusBarRef.current, { opacity: [1, 0], scaleY: [1, 0], duration: 300, ease: "in(2)" });
    if (focusHaloRef.current) animate(focusHaloRef.current, { opacity: [1, 0], duration: 300, ease: "in(2)" });
    if (focusDotRef.current) animate(focusDotRef.current, { opacity: [1, 0], duration: 300, ease: "in(2)" });
  }

  // Idle micro-motion for the "Add Journal Entry" button icon: a tiny pen
  // gently floats/breathes so the action reads as alive before interaction.
  useEffect(() => {
    if (prefersReducedMotion() || !addIconRef.current) return undefined;
    const anim = animate(addIconRef.current, {
      opacity: [0.75, 1, 0.75],
      translateY: [0, -2, 0],
      duration: 2600,
      ease: "inOut(2)",
      loop: true,
    });
    return () => stopAnim(anim);
  }, []);

  // Hover: icon does a short pen-nod + swell.
  function handleAddHover() {
    if (prefersReducedMotion() || !addIconRef.current) return;
    animate(addIconRef.current, {
      rotate: [0, -14, 8, 0],
      scale: [1, 1.18, 1],
      duration: 520,
      ease: "inOut(2)",
    });
  }

  // Click: compress the button, animate the icon, then focus/scroll to the
  // real editor. If we're in Voice mode, switch to Text first so the actual
  // textarea exists (mode exit animation ~150ms).
  function handleAddJournalClick() {
    animateButtonPress(addBtnRef.current);
    if (addIconRef.current)
      animate(addIconRef.current, {
        rotate: [0, -22, 12, 0],
        scale: [1.25, 1],
        duration: 520,
        ease: "outBack(1.8)",
      });
    if (activeTab !== "text") {
      setActiveTab("text");
      setTimeout(() => focusJournalEditor(), 240);
    } else {
      focusJournalEditor();
    }
  }

  function focusJournalEditor() {
    const ta = textAreaRef.current;
    if (!ta) return;
    ta.scrollIntoView({ behavior: "smooth", block: "center" });
    ta.focus(); // onFocus (handleWriterFocus) drives the focus glow + spark.
  }

  // Analyze button micro-interaction, then the existing save flow.
  function handleAnalyzeClick() {
    animateButtonPress(analyzeBtnRef.current);
    handleSave(entryText, "text");
  }

  function handleSelectJournal(journal, cardEl) {
    setSelectedJournal(journal);
    animateSelectPulse(cardEl);
  }

  async function handleSave(contentToSave, source = "text") {
    setError("");
    const content = (contentToSave || entryText).trim();

    if (!content) {
      setError("Please provide reflection text before submitting.");
      return;
    }

    setSubmitting(true);
    setLatestAnalysis(null);

    try {
      const result = await journalApi.createJournal({
        content,
        source,
      });

      addJournal(result);
      setLatestAnalysis(result.ai_analysis);
      setSelectedJournal(result);
      if (source === "text") {
        setEntryText("");
      }
      // "My reflection has been captured": a ✦ flies from the editor to the
      // Post-save flow: the exact returned entry is already in History via
      // addJournal(result); now only the visual feedback runs. Animation-only.
      setNewlyAddedJournalId(result.id);
      setSavedFlag(true);
      flyInsightToHistory(workspaceRef.current, historyListRef.current);
    } catch (err) {
      setError(err.message || "Failed to process journal entry.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleVoiceTranscriptReady(transcriptText) {
    setEntryText(transcriptText);
    setActiveTab("text");
  }

  async function handleDeleteJournal(id, cardEl) {
    if (!window.confirm("Are you sure you want to delete this journal entry?")) return;

    // Animate the card out first; the existing delete API flow is unchanged.
    await animateCardExit(cardEl);

    try {
      await journalApi.deleteJournal(id);
      deleteJournalFromCache(id);
      if (selectedJournal?.id === id) {
        setSelectedJournal(null);
      }
    } catch (err) {
      alert("Failed to delete entry: " + err.message);
    }
  }

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const charCount = entryText.length;
  const wordCount = entryText.trim() ? entryText.trim().split(/\s+/).length : 0;

  function getTagsForJournal(j) {
    const tags = [];
    const lower = (j.content || "").toLowerCase();
    if (lower.includes("react") || lower.includes("dsa") || lower.includes("code") || lower.includes("question")) tags.push("Dev");
    if (lower.includes("dsa")) tags.push("DSA");
    if (j.ai_analysis?.blockers?.length || lower.includes("blocker") || lower.includes("stuck")) tags.push("Blocker");
    if (!tags.length) tags.push(j.source === "voice" ? "Voice" : "Reflection");
    return tags;
  }

  function getEmojiForJournal(j) {
    if (j.ai_analysis?.blockers?.length) return "⌛";
    if (j.ai_analysis?.activities?.length) return "🧠";
    return "🎯";
  }

  return (
    <div className="app-page bg-slate-50 min-h-screen relative" data-particle-scope>
      <main className="mx-auto max-w-[1400px] w-full px-5 py-7 md:px-8 lg:px-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 font-medium">
            <strong>Error: </strong> {error}
          </div>
        )}

        {/* Page header: title + primary "Add Journal Entry" action */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" data-motion>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm text-indigo-600">
              <BookOpen size={20} />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Journal</h1>
              <p className="text-sm text-slate-500 font-medium">My Reflections</p>
            </div>
          </div>

          <button
            ref={addBtnRef}
            onClick={handleAddJournalClick}
            onMouseEnter={handleAddHover}
            className="group relative inline-flex items-center justify-center gap-2.5 self-start sm:self-auto overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200"
            aria-label="Add Journal Entry"
          >
            {/* Subtle highlight sweep on hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-full"
            />
            <span ref={addIconRef} className="inline-flex shrink-0">
              <PenLine size={16} />
            </span>
            <span className="flex items-center gap-1">
              <Plus size={15} className="text-white/85" />
              Add Journal Entry
            </span>
          </button>
        </div>

        {/* 2-COLUMN LAYOUT MATCHING IMAGE 2 PERFECTLY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT MAIN WORKSPACE COLUMN ("TODAY'S ENTRY") */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-7 min-w-0">
            <section
              ref={workspaceRef}
              className="panel p-7 sm:p-9 shadow-sm bg-white border border-slate-200 rounded-3xl relative"
            >
              {/* "✦ Reflection saved" feedback — shows briefly after a real save */}
              {savedFlag && (
                <div
                  ref={savedToastRef}
                  role="status"
                  className="pointer-events-none absolute -top-3 right-5 z-20 flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 py-1.5 pl-3 pr-4 text-sm font-semibold text-emerald-700 shadow-sm"
                  style={{ opacity: 0 }}
                >
                  <span className="text-emerald-500 text-base leading-none">✦</span> Reflection saved
                </div>
              )}
              {/* Top Sub-Header Bar inside Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span
                    ref={labelRef}
                    className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400"
                  >
                    TODAY'S ENTRY
                  </span>
                  <span
                    ref={autosavePillRef}
                    className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100"
                  >
                    ☁ Autosaved
                  </span>
                </div>

                {/* Mode Switcher Pills with sliding highlight */}
                <div className="relative flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1 self-start sm:self-auto">
                  <span
                    ref={modePillRef}
                    aria-hidden="true"
                    className="absolute bottom-1 top-1 rounded-lg bg-indigo-600 shadow-sm"
                    style={{ left: 0, width: 0 }}
                  />
                  <button
                    ref={textTabBtnRef}
                    onClick={() => setActiveTab("text")}
                    className={`relative z-10 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                      activeTab === "text" ? "text-white font-bold" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FileText size={16} />
                    Text Mode
                  </button>
                  <button
                    ref={voiceTabBtnRef}
                    onClick={() => setActiveTab("voice")}
                    className={`relative z-10 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                      activeTab === "voice" ? "text-white font-bold" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Mic size={16} />
                    Voice Mode (Whisper)
                  </button>
                </div>
              </div>

              {/* Main Headline Date */}
              <h2 ref={dateRef} className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                Writing {todayFormatted}
              </h2>

              {/* Reflection Workspace Content (animated mode transition) */}
              {displayTab === "voice" ? (
                <div className="mb-6" ref={writerRef}>
                  <VoiceRecorder
                    onTranscriptReady={handleVoiceTranscriptReady}
                    onDirectSubmit={(text) => handleSave(text, "voice")}
                    isSubmitting={submitting}
                  />
                </div>
              ) : (
                <div className="mb-6" ref={writerRef}>
                  <div className="relative">
                    {/* Decorative focus elements (Anime.js driven, purely visual) */}
                    <span
                      ref={focusHaloRef}
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-1.5 rounded-3xl bg-indigo-100/60 blur-md"
                      style={{ opacity: 0 }}
                    />
                    <span
                      ref={focusBarRef}
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-4 left-0 top-4 w-[3px] origin-bottom rounded-full bg-gradient-to-b from-indigo-500 via-violet-400 to-transparent"
                      style={{ opacity: 0, transform: "scaleY(0)" }}
                    />
                    <span
                      ref={focusDotRef}
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-3 flex gap-1.5"
                      style={{ opacity: 0 }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
                    </span>
                    {/* Ambient "thought energy" particle layer + idle spark */}
                    <span
                      ref={particleLayerRef}
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-1 overflow-hidden"
                    />
                    <span
                      ref={sparkRef}
                      aria-hidden="true"
                      className="pointer-events-none absolute right-6 top-4 text-lg leading-none text-indigo-400"
                      style={{ opacity: 0 }}
                    >
                      ✦
                    </span>
                    <textarea
                      ref={textAreaRef}
                      rows={7}
                      value={entryText}
                      onChange={(e) => setEntryText(e.target.value)}
                      onFocus={handleWriterFocus}
                      onBlur={handleWriterBlur}
                      className="relative w-full p-5 text-base text-slate-800 placeholder:text-slate-400 leading-relaxed bg-white border border-slate-200 rounded-2xl outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      placeholder="Today I managed to build... Mention specific hours, goal progress, or task blockers."
                    />
                  </div>
                </div>
              )}

              {/* Image 2 Tip Banner */}
              <div
                ref={tipRef}
                className="rounded-2xl bg-purple-50/70 border border-purple-100 p-4 mb-6 text-sm text-purple-800 flex items-center gap-3 font-medium"
              >
                <Sparkles ref={tipSparkleRef} size={18} className="text-purple-600 shrink-0" />
                <span>
                  <strong>Tip:</strong> Mention specific hours and task blocker details for more detailed AI Coaching feedback.
                </span>
              </div>

              {/* Bottom Action Footer matching Image 2 */}
              <div ref={footerRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div ref={counterRef} className="text-sm text-slate-400 font-medium font-mono">
                  {charCount} characters • {wordCount} words
                </div>

                <span className="relative inline-flex">
                  {/* Ambient "reflection pulse" — accelerates while AI is processing */}
                  <ReflectionOrbit active={submitting} />
                  <button
                    ref={analyzeBtnRef}
                    onClick={handleAnalyzeClick}
                    onMouseEnter={() => animateSparkleHover(sparkleRef.current)}
                    disabled={submitting || !entryText.trim()}
                    className="primary-button relative overflow-hidden px-6 py-3.5 text-sm font-bold shadow-md hover:shadow-indigo-200 hover:-translate-y-0.5 transition-transform duration-200"
                  >
                    <span ref={sparkleRef} className="inline-flex">
                      <Sparkles size={17} />
                    </span>
                    {submitting ? "Analyzing with Gemini..." : "Analyze Entry ✨"}
                    {/* Processing shimmer (Anime.js loop while submitting) */}
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                      <span
                        ref={shimmerRef}
                        className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                        style={{ opacity: 0 }}
                      />
                    </span>
                  </button>
                </span>
              </div>
            </section>

            {/* LATEST AI EXTRACTION BANNER */}
            {latestAnalysis && (
              <section
                ref={analysisRef}
                className="rounded-3xl p-7 bg-gradient-to-r from-indigo-50 via-purple-50 to-white border border-indigo-200/90 shadow-md"
              >
                <h3
                  data-ai-header
                  className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-2"
                >
                  <Sparkles size={18} className="text-purple-600" /> AI Structured Journal Extraction
                </h3>

                {latestAnalysis.quick_summary && (
                  <p data-ai-summary className="text-lg font-bold text-slate-900 italic mb-4">
                    "{latestAnalysis.quick_summary}"
                  </p>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  {latestAnalysis.activities?.length > 0 && (
                    <div data-ai-card className="rounded-2xl bg-white p-4 border border-indigo-100 shadow-sm">
                      <h4 className="text-xs font-bold text-slate-900 mb-2">Activities Extracted:</h4>
                      <ul className="space-y-2 text-xs text-slate-700 font-medium">
                        {latestAnalysis.activities.map((act, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 data-ai-icon size={15} className="text-emerald-500 shrink-0" />
                            <span>{act.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {latestAnalysis.blockers?.length > 0 && (
                    <div data-ai-card className="rounded-2xl bg-red-50 p-4 border border-red-100 shadow-sm">
                      <h4 className="text-xs font-bold text-red-600 mb-2">Active Blockers Detected:</h4>
                      <ul className="space-y-2 text-xs text-red-700 font-medium">
                        {latestAnalysis.blockers.map((b, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <AlertTriangle data-ai-icon size={15} className="text-red-500 shrink-0" />
                            <span>{b.text} ({b.category || "other"})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT SIDEBAR COLUMN ("Journal History") MATCHING IMAGE 2 */}
          <div ref={sidebarRef} className="lg:col-span-5 xl:col-span-4 min-w-0">
            <section className="sticky top-24 panel p-6 sm:p-7 shadow-sm bg-white border border-slate-200 rounded-3xl">
              <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 shrink-0">
                  Journal History ({journals.length})
                </h2>

                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-300 pointer-events-none peer-focus:text-indigo-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="peer w-32 sm:w-36 focus:w-44 sm:focus:w-52 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300"
                  />
                </div>
              </div>

              {loadingList ? (
                <JournalLoadingState />
              ) : filteredJournals.length === 0 ? (
                <div ref={emptyStateRef} className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <BookOpen size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-base text-slate-900 font-bold">No journal entries found</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Record your daily reflections above to populate your archive.</p>
                </div>
              ) : (
                <div ref={historyListRef} className="flex flex-col gap-4 max-h-[720px] overflow-y-auto pr-1">
                  {filteredJournals.map((j) => {
                    const tags = getTagsForJournal(j);
                    const emoji = getEmojiForJournal(j);
                    return (
                      <div
                        key={j.id}
                        data-journal-card
                        data-journal-id={j.id}
                        onClick={(e) => handleSelectJournal(j, e.currentTarget)}
                        onMouseEnter={(e) => animateEmojiHover(e.currentTarget)}
                        className={`group rounded-2xl p-5 border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:scale-[1.01] ${
                          selectedJournal?.id === j.id
                            ? "border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-100 shadow-sm"
                            : "border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 hover:shadow-md"
                        }`}
                      >
                        {/* Top row: Date & Emoji */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <Calendar size={14} className="text-indigo-600" />
                            {new Date(j.created_at || j.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span
                            data-emoji={emoji === "🧠" ? "brain" : emoji === "⌛" ? "blocker" : emoji === "🎯" ? "target" : "generic"}
                            className="text-base bg-white rounded-lg px-2 py-0.5 border border-slate-200 shadow-2xs inline-block"
                          >
                            {emoji}
                          </span>
                        </div>

                        {/* Content Excerpt */}
                        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-medium mb-3">
                          {j.content}
                        </p>

                        {/* Tag Pills matching Image 2 */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 shadow-2xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteJournal(j.id, e.currentTarget.closest("[data-journal-card]"));
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Journal"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}