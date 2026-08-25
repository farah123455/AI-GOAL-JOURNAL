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
} from "lucide-react";
import VoiceRecorder from "../components/VoiceRecorder";
import { journalApi } from "../services/api";
import { useData } from "../context/DataContext";

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

  const loadingList = !hasLoadedJournals;

  useEffect(() => {
    fetchJournals({ quiet: hasLoadedJournals });
  }, [fetchJournals, hasLoadedJournals]);

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

  return (
    <div className="app-page bg-slate-50 min-h-screen">
      <header className="border-b border-slate-200 bg-white px-5 py-7 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1250px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="section-label">DAILY REFLECTION</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Journaling Workspace
            </h1>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              Speak or write conversationally. AI structures your activities, matches goals, and categorizes blockers.
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setActiveTab("text")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                activeTab === "text"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText size={15} />
              Text Mode
            </button>
            <button
              onClick={() => setActiveTab("voice")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                activeTab === "voice"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Mic size={15} />
              Voice Mode (Whisper)
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1250px] px-5 py-7 md:px-8 lg:px-10">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
            <strong>Error: </strong> {error}
          </div>
        )}

        {/* VOICE MODE */}
        {activeTab === "voice" && (
          <VoiceRecorder
            onTranscriptReady={handleVoiceTranscriptReady}
            onDirectSubmit={(text) => handleSave(text, "voice")}
            isSubmitting={submitting}
          />
        )}

        {/* TEXT MODE */}
        {activeTab === "text" && (
          <section className="panel p-6 shadow-sm mb-8">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileText size={18} className="text-indigo-600" /> Write Your Daily Reflection
            </h3>
            <textarea
              rows={5}
              value={entryText}
              onChange={(e) => setEntryText(e.target.value)}
              className="input-field p-4 text-sm text-slate-900 placeholder:text-slate-400 leading-relaxed mb-3 bg-white border border-slate-200 rounded-xl"
              placeholder="What did you work on today? Any obstacles or progress on your goals?"
            />
            <div className="flex justify-end">
              <button
                onClick={() => handleSave(entryText, "text")}
                disabled={submitting || !entryText.trim()}
                className="primary-button text-xs"
              >
                <Send size={14} />
                {submitting ? "Analyzing with Gemini..." : "Submit Journal & Analyze"}
              </button>
            </div>
          </section>
        )}

        {/* LATEST AI EXTRACTION RESULT BANNER */}
        {latestAnalysis && (
          <section className="rounded-2xl p-6 mb-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-white border border-indigo-200 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-purple-600" /> AI Structured Journal Extraction
            </h3>

            {latestAnalysis.quick_summary && (
              <p className="text-sm font-semibold text-slate-900 italic mb-3">
                "{latestAnalysis.quick_summary}"
              </p>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {latestAnalysis.activities?.length > 0 && (
                <div className="rounded-xl bg-white p-3.5 border border-indigo-100 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-900 mb-2">Activities Extracted:</h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                    {latestAnalysis.activities.map((act, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span>{act.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {latestAnalysis.blockers?.length > 0 && (
                <div className="rounded-xl bg-red-50 p-3.5 border border-red-100 shadow-sm">
                  <h4 className="text-xs font-bold text-red-600 mb-2">Active Blockers Detected:</h4>
                  <ul className="space-y-1.5 text-xs text-red-700 font-medium">
                    {latestAnalysis.blockers.map((b, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-red-500 shrink-0" />
                        <span>{b.text} ({b.category || "other"})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* JOURNAL HISTORY LIST */}
        <section className="panel p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <p className="section-label">HISTORY</p>
              <h2 className="text-xl font-bold text-slate-900">Reflection Archive ({journals.length})</h2>
            </div>
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field px-3.5 py-2 text-xs max-w-xs bg-white border border-slate-200 rounded-xl"
            />
          </div>

          {loadingList ? (
            <p className="text-xs text-slate-400 text-center py-8 font-medium">Loading journal history...</p>
          ) : filteredJournals.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-900 font-bold">No journal entries found</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Record your daily reflections above to populate your archive.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredJournals.map((j) => (
                <div
                  key={j.id}
                  onClick={() => setSelectedJournal(j)}
                  className={`panel p-5 cursor-pointer transition border ${
                    selectedJournal?.id === j.id ? "border-indigo-500 bg-indigo-50/40 shadow-sm" : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-2">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar size={12} />
                      {new Date(j.created_at || j.createdAt).toLocaleDateString()}
                    </span>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 border border-indigo-100 uppercase">
                      {j.source || "text"}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                    {j.title || j.ai_analysis?.title || "Reflection Entry"}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {j.content}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium">
                      {j.ai_analysis?.mood ? `Mood: ${j.ai_analysis.mood}` : "Raw Entry"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJournal(j.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 transition"
                      title="Delete Journal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}