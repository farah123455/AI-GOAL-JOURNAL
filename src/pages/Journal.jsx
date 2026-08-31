import { useState, useEffect } from "react";
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
} from "lucide-react";
import VoiceRecorder from "../components/VoiceRecorder";
import Pagination from "../components/Pagination";
import { journalApi } from "../services/api";
import { useData } from "../context/DataContext";
import { GridSkeleton, JournalLoadingState } from "../components/LoadingSkeleton";

export default function Journal() {
  const {
    journals,
    hasLoadedJournals,
    fetchJournals,
    addJournal,
    deleteJournalFromCache,
  } = useData();

  const [activeTab, setActiveTab] = useState("text"); // 'text' | 'voice'
  const [entryText, setEntryText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const loadingList = !hasLoadedJournals;

  useEffect(() => {
    fetchJournals({ quiet: hasLoadedJournals });
  }, [fetchJournals, hasLoadedJournals]);

  // Reset pagination when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  async function handleDeleteJournal(id) {
    if (!window.confirm("Are you sure you want to delete this journal entry?")) return;

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

  const filteredJournals = searchQuery.trim()
    ? journals.filter(
        (j) =>
          j.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : journals;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJournals = filteredJournals.slice(startIndex, startIndex + itemsPerPage);

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
    <div className="app-page bg-slate-50 min-h-screen">
      <main className="mx-auto max-w-[1400px] w-full px-5 py-7 md:px-8 lg:px-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 font-medium">
            <strong>Error: </strong> {error}
          </div>
        )}

        {/* 2-COLUMN LAYOUT MATCHING IMAGE 2 PERFECTLY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT MAIN WORKSPACE COLUMN ("TODAY'S ENTRY") */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-7 min-w-0">
            <section className="panel p-7 sm:p-9 shadow-sm bg-white border border-slate-200 rounded-3xl animate-rise">
              {/* Top Sub-Header Bar inside Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    TODAY'S ENTRY
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    ☁ Autosaved
                  </span>
                </div>

                {/* Mode Switcher Pills */}
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1 self-start sm:self-auto">
                  <button
                    onClick={() => setActiveTab("text")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      activeTab === "text"
                        ? "bg-indigo-600 text-white shadow-sm font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FileText size={16} />
                    Text Mode
                  </button>
                  <button
                    onClick={() => setActiveTab("voice")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      activeTab === "voice"
                        ? "bg-indigo-600 text-white shadow-sm font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Mic size={16} />
                    Voice Mode (Whisper)
                  </button>
                </div>
              </div>

              {/* Main Headline Date */}
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                Writing {todayFormatted}
              </h2>

              {/* Reflection Workspace Content */}
              {activeTab === "voice" ? (
                <div className="mb-6">
                  <VoiceRecorder
                    onTranscriptReady={handleVoiceTranscriptReady}
                    onDirectSubmit={(text) => handleSave(text, "voice")}
                    isSubmitting={submitting}
                  />
                </div>
              ) : (
                <div className="mb-6">
                  <textarea
                    rows={7}
                    value={entryText}
                    onChange={(e) => setEntryText(e.target.value)}
                    className="w-full p-5 text-base text-slate-800 placeholder:text-slate-400 leading-relaxed bg-white border border-slate-200 rounded-2xl outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    placeholder="Today I managed to build... Mention specific hours, goal progress, or task blockers."
                  />
                </div>
              )}

              {/* Image 2 Tip Banner */}
              <div className="rounded-2xl bg-purple-50/70 border border-purple-100 p-4 mb-6 text-sm text-purple-800 flex items-center gap-3 font-medium">
                <Sparkles size={18} className="text-purple-600 shrink-0 animate-pulse" />
                <span>
                  <strong>Tip:</strong> Mention specific hours and task blocker details for more detailed AI Coaching feedback.
                </span>
              </div>

              {/* Bottom Action Footer matching Image 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="text-sm text-slate-400 font-medium font-mono">
                  {charCount} characters • {wordCount} words
                </div>

                <button
                  onClick={() => handleSave(entryText, "text")}
                  disabled={submitting || !entryText.trim()}
                  className="primary-button px-6 py-3.5 text-sm font-bold shadow-md hover:shadow-indigo-200"
                >
                  <Sparkles size={17} />
                  {submitting ? "Analyzing with Gemini..." : "Analyze Entry ✨"}
                </button>
              </div>
            </section>

            {/* LATEST AI EXTRACTION BANNER */}
            {latestAnalysis && (
              <section className="rounded-3xl p-7 bg-gradient-to-r from-indigo-50 via-purple-50 to-white border border-indigo-200/90 shadow-md animate-fade-in">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-600 animate-pulse" /> AI Structured Journal Extraction
                </h3>

                {latestAnalysis.quick_summary && (
                  <p className="text-lg font-bold text-slate-900 italic mb-4">
                    "{latestAnalysis.quick_summary}"
                  </p>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  {latestAnalysis.activities?.length > 0 && (
                    <div className="rounded-2xl bg-white p-4 border border-indigo-100 shadow-sm">
                      <h4 className="text-xs font-bold text-slate-900 mb-2">Activities Extracted:</h4>
                      <ul className="space-y-2 text-xs text-slate-700 font-medium">
                        {latestAnalysis.activities.map((act, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                            <span>{act.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {latestAnalysis.blockers?.length > 0 && (
                    <div className="rounded-2xl bg-red-50 p-4 border border-red-100 shadow-sm">
                      <h4 className="text-xs font-bold text-red-600 mb-2">Active Blockers Detected:</h4>
                      <ul className="space-y-2 text-xs text-red-700 font-medium">
                        {latestAnalysis.blockers.map((b, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <AlertTriangle size={15} className="text-red-500 shrink-0" />
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
          <div className="lg:col-span-5 xl:col-span-4 min-w-0">
            <section className="sticky top-24 panel p-6 sm:p-7 shadow-sm bg-white border border-slate-200 rounded-3xl">
              <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 shrink-0">
                  Journal History ({journals.length})
                </h2>

                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-32 sm:w-36 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {loadingList ? (
                <JournalLoadingState />
              ) : filteredJournals.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <BookOpen size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-base text-slate-900 font-bold">No journal entries found</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Record your daily reflections above to populate your archive.</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-4 max-h-[720px] overflow-y-auto pr-1 animate-fade-in">
                    {paginatedJournals.map((j) => {
                      const tags = getTagsForJournal(j);
                      const emoji = getEmojiForJournal(j);
                      return (
                        <div
                          key={j.id}
                          onClick={() => setSelectedJournal(j)}
                          className={`group rounded-2xl p-5 border transition-all duration-200 cursor-pointer ${
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
                            <span className="text-base bg-white rounded-lg px-2 py-0.5 border border-slate-200 shadow-2xs">
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
                                handleDeleteJournal(j.id);
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

                  <Pagination
                    currentPage={currentPage}
                    totalItems={filteredJournals.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(newLimit) => {
                      setItemsPerPage(newLimit);
                      setCurrentPage(1);
                    }}
                    itemsPerPageOptions={[5, 10, 20]}
                  />
                </>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}