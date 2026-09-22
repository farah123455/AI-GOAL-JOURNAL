import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Trophy,
  AlertTriangle,
  Target,
  Zap,
  Send,
  Bot,
  User,
  MessageSquare,
  FileText,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { summaryApi, coachApi } from "../services/api";
import { useData } from "../context/DataContext";
import { CoachLoadingState } from "../components/LoadingSkeleton";
import MoodBadge from "../components/MoodBadge";

const SUGGESTED_PROMPTS = [
  "I'm feeling friction starting my tasks today. How can I build momentum?",
  "Break down my most urgent goal into 3 low-friction daily actions.",
  "Look at my recent blockers and suggest a practical workaround.",
  "Give me an energizing 45-minute focus routine for today.",
];

export default function AiCoach() {
  const { summary, hasLoadedSummary, fetchSummary, setSummaryInCache, journals, goals, profile } = useData();

  const [activeTab, setActiveTab] = useState("chat"); // 'chat' | 'weekly'
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  // Conversational Groq Coach state
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Accountability Coach, powered by Groq Cloud. I'm connected to your live goals, habit streaks, and recent emotional reflections. What challenge or priority would you like to unpack today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState("");
  const chatEndRef = useRef(null);

  const latestJournal = journals && journals.length > 0 ? journals[0] : null;
  const currentMood = latestJournal?.detected_mood;
  const moodConfidence = latestJournal?.mood_confidence;
  const triggerKeywords = latestJournal?.trigger_keywords || [];

  const loading = !hasLoadedSummary;

  useEffect(() => {
    fetchSummary({ quiet: hasLoadedSummary });
  }, [fetchSummary, hasLoadedSummary]);

  // Auto-scroll chat to bottom on new message
  useEffect(() => {
    if (activeTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  async function handleSendMessage(textToSend) {
    const text = (textToSend || inputMessage).trim();
    if (!text || sending) return;

    setInputMessage("");
    setChatError("");

    const newHistory = [...messages, { role: "user", content: text }];
    setMessages(newHistory);
    setSending(true);

    try {
      // Send previous conversation context to Groq
      const apiHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await coachApi.chat(text, apiHistory);
      const reply = res.reply || "Taking a steady step forward today is what counts most. How can we simplify your next task?";
      setMessages([...newHistory, { role: "assistant", content: reply, model: res.model }]);
    } catch (err) {
      console.error("Coach chat error:", err);
      setChatError(err.message || "Failed to connect to AI Coach. Please try again.");
      setMessages([
        ...newHistory,
        {
          role: "assistant",
          content:
            "I encountered a temporary connection issue reaching Groq Cloud. Keep your focus on your single next high-priority task, and we'll sync back up shortly!",
          isError: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  async function handleGenerateFresh() {
    try {
      setGenerating(true);
      setError("");
      const data = await summaryApi.generateWeeklySummary();
      setSummaryInCache(data);
    } catch (err) {
      console.error("Failed to generate summary:", err);
      setError(err.message || "Could not generate weekly summary.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="app-page bg-[#EEF3EC] min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8 animate-rise">
        {/* TOP TAB CONTROLS & STATUS BAR */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E9DF] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all shadow-2xs ${
                activeTab === "chat"
                  ? "bg-[#4B5D3C] text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-[#E2E9DF]/60 border border-[#E2E9DF]"
              }`}
            >
              <MessageSquare size={16} />
              <span>Live AI Coach (Groq)</span>
            </button>

            <button
              onClick={() => setActiveTab("weekly")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all shadow-2xs ${
                activeTab === "weekly"
                  ? "bg-[#4B5D3C] text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-[#E2E9DF]/60 border border-[#E2E9DF]"
              }`}
            >
              <FileText size={16} />
              <span>Weekly Synthesis (Gemini)</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {currentMood && (
              <div className="hidden md:flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 border border-[#E2E9DF] shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Emotional Pulse:
                </span>
                <MoodBadge
                  mood={currentMood}
                  confidence={moodConfidence}
                  keywords={triggerKeywords}
                  size="sm"
                  showKeywords={false}
                />
              </div>
            )}

            {activeTab === "weekly" && (
              <button
                onClick={handleGenerateFresh}
                disabled={generating}
                className="primary-button text-xs font-bold"
              >
                <Zap size={14} />
                {generating ? "Synthesizing with Gemini..." : "Generate Fresh Summary"}
              </button>
            )}
          </div>
        </div>

        {/* ----------------- TAB 1: CONVERSATIONAL AI COACH (GROQ) ----------------- */}
        {activeTab === "chat" && (
          <div className="flex flex-col rounded-2xl bg-white border border-[#E2E9DF] shadow-xs overflow-hidden h-[calc(100vh-210px)] min-h-[550px]">
            {/* Coach Header Banner */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E9DF] bg-gradient-to-r from-[#E2E9DF]/60 via-white to-[#F4F1E8]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4B5D3C] text-white shadow-2xs">
                  <Bot size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#26261F] flex items-center gap-2">
                    Two-Way Accountability Coach
                    <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.2 text-[10px] font-bold">
                      Groq Cloud Active
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Grounded in your {goals.length} active goals and recent reflections.
                  </p>
                </div>
              </div>

              {currentMood && (
                <div className="flex md:hidden">
                  <MoodBadge mood={currentMood} confidence={moodConfidence} size="sm" showKeywords={false} />
                </div>
              )}
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FBFBFA]">
              {messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} animate-fade-in`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-2xs text-xs font-bold ${
                        isUser ? "bg-[#26261F] text-white" : "bg-[#4B5D3C] text-white"
                      }`}
                    >
                      {isUser ? <User size={15} /> : <Bot size={16} />}
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isUser
                          ? "bg-[#3A492E] text-white rounded-tr-none font-medium"
                          : "bg-white text-[#26261F] border border-[#E2E9DF] rounded-tl-none font-medium"
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.content}</p>
                    </div>
                  </div>
                );
              })}

              {sending && (
                <div className="flex items-start gap-3 animate-pulse">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#4B5D3C] text-white shadow-2xs">
                    <Bot size={16} />
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-white p-4 border border-[#E2E9DF] text-xs text-slate-500 shadow-2xs flex items-center gap-2">
                    <RefreshCw size={14} className="animate-spin text-[#4B5D3C]" />
                    <span>Coach is reviewing your goals and reflecting...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Suggested Prompt Pills */}
            <div className="px-4 py-2 border-t border-[#E2E9DF] bg-white flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Lightbulb size={12} className="text-[#4B5D3C]" /> Suggestions:
              </span>
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={sending}
                  className="rounded-full bg-[#F4F1E8] px-3 py-1 text-[11px] font-semibold text-[#26261F] border border-[#E2E9DF] hover:bg-[#E2E9DF] hover:text-[#4B5D3C] transition-all disabled:opacity-50 text-left truncate max-w-[280px]"
                  title={prompt}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Input Box */}
            <div className="p-4 border-t border-[#E2E9DF] bg-white">
              {chatError && (
                <p className="text-[11px] font-bold text-red-600 mb-2">⚠️ {chatError}</p>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask for feedback on your goals, habits, or how to tackle friction..."
                  disabled={sending}
                  className="flex-1 rounded-xl border border-[#E2E9DF] bg-[#F4F1E8]/50 px-4 py-2.5 text-xs sm:text-sm text-[#26261F] outline-none transition focus:border-[#4B5D3C] focus:bg-white focus:ring-1 focus:ring-[#4B5D3C]/20 disabled:opacity-50"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={sending || !inputMessage.trim()}
                  className="primary-button px-4 py-2.5 text-xs sm:text-sm font-bold shadow-xs disabled:opacity-50 shrink-0"
                >
                  <Send size={15} />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: WEEKLY SYNTHESIS (GEMINI) ----------------- */}
        {activeTab === "weekly" && (
          <div>
            {error && (
              <div role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-xs text-red-600 border border-red-200">
                <strong>Notice: </strong> {error}
              </div>
            )}

            {loading || generating ? (
              <CoachLoadingState />
            ) : summary ? (
              <div className="flex flex-col gap-6">
                {/* Executive Headline & Coaching Advice Banner */}
                <section className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-[#E2E9DF]/80 via-[#FAF8F5] to-white border border-[#E2E9DF] shadow-sm">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-full bg-[#E2E9DF] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#3A492E] border border-[#E2E9DF]">
                      Weekly Evaluation
                    </span>

                    {summary.mood_trend && (
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase ${
                          summary.mood_trend === "improving"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : summary.mood_trend === "declining"
                            ? "bg-red-50 text-red-600 border border-red-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        Trend: {summary.mood_trend}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-[#26261F] mb-4 leading-snug">
                    "{summary.headline}"
                  </h2>

                  {summary.coaching_suggestion && (
                    <div className="rounded-xl bg-white p-4 border border-[#E2E9DF] shadow-sm text-sm text-slate-800 leading-relaxed">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4B5D3C] mb-2">
                        <Sparkles size={14} /> Coach Recommendation
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {summary.coaching_suggestion}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 text-right text-[11px] text-slate-400 font-mono font-medium">
                    Report Generated: {new Date(summary.created_at).toLocaleString()}
                  </div>
                </section>

                {/* Wins and Blockers Columns */}
                <div className="grid gap-6 md:grid-cols-2">
                  <section className="panel p-6 shadow-sm">
                    <h3 className="section-label text-emerald-600 mb-3 flex items-center gap-2">
                      <Trophy size={16} /> Key Wins & Progress ({summary.wins?.length || 0})
                    </h3>
                    {summary.wins && summary.wins.length > 0 ? (
                      <ul className="flex flex-col gap-2.5">
                        {summary.wins.map((win, i) => (
                          <li
                            key={i}
                            className="text-xs text-slate-800 flex items-start gap-2 bg-emerald-50 p-3 rounded-xl border border-emerald-100 font-medium"
                          >
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span className="leading-relaxed">{win}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-2">
                        Keep recording your daily activities to surface wins.
                      </p>
                    )}
                  </section>

                  <section className="panel p-6 shadow-sm">
                    <h3 className="section-label text-red-600 mb-3 flex items-center gap-2">
                      <AlertTriangle size={16} /> Recurring Blockers & Hazards ({summary.recurring_blockers?.length || 0})
                    </h3>
                    {summary.recurring_blockers && summary.recurring_blockers.length > 0 ? (
                      <ul className="flex flex-col gap-2.5">
                        {summary.recurring_blockers.map((blk, i) => (
                          <li
                            key={i}
                            className="text-xs text-slate-800 flex items-start gap-2 bg-red-50 p-3 rounded-xl border border-red-100 font-medium"
                          >
                            <span className="text-red-500 font-bold">!</span>
                            <span className="leading-relaxed">{blk}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-2">
                        No major recurring blockers detected this week. Excellent flow!
                      </p>
                    )}
                  </section>
                </div>

                {/* Goal Status Evolutions */}
                {summary.goal_status_changes && summary.goal_status_changes.length > 0 && (
                  <section className="panel p-6 shadow-sm">
                    <h3 className="section-label mb-3 flex items-center gap-2 text-[#4B5D3C]">
                      <Target size={16} /> Goal Milestones Evolution
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {summary.goal_status_changes.map((g, i) => (
                        <div key={i} className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs">
                          <div className="font-bold text-slate-900">{g.goal_title}</div>
                          <div className="text-slate-600 mt-1 font-medium">{g.change}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <section className="panel p-12 text-center shadow-sm">
                <Sparkles size={36} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No Weekly Summary Generated Yet</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                  Record a few journal reflections, then generate your weekly report to let Gemini synthesize your habits, wins, and blocker trends.
                </p>
                <div className="mt-5">
                  <button onClick={handleGenerateFresh} disabled={generating} className="primary-button text-xs">
                    Generate Weekly Summary
                  </button>
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
