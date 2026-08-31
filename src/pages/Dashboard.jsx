import { useEffect } from "react";
import {
  Target,
  BookOpen,
  Flame,
  ArrowUpRight,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { DashboardSkeleton } from "../components/LoadingSkeleton";
import GrowthConstellation from "../components/GrowthConstellation";
import {
  animateCountUp,
  animateProgressFills,
  attachScrollReveals,
  stopAnim,
} from "../animations/motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    profile,
    goals = [],
    journals = [],
    summary,
    initialLoading,
    fetchAllData,
  } = useData();

  useEffect(() => {
    fetchAllData({ quiet: true });
  }, [fetchAllData]);

  const loading = initialLoading && !profile && goals.length === 0 && journals.length === 0;

  // Data reveals (count-ups, progress fills, scroll reveals) run once when
  // the dashboard content becomes available — never on every re-render.
  useEffect(() => {
    if (loading) return;
    const root = document.querySelector("[data-dashboard-root]");
    if (!root) return;
    const anims = [...animateCountUp(root), ...animateProgressFills(root)];
    const disconnect = attachScrollReveals(root);
    return () => {
      anims.forEach(stopAnim);
      disconnect();
    };
  }, [loading]);

  const latestJournal = journals[0];
  const latestAnalysis = latestJournal?.ai_analysis;
  const activeGoals = goals.filter((g) => g.status?.toLowerCase() === "active");
  const completedGoals = goals.filter((g) => g.status?.toLowerCase() === "completed");

  const recentBlockers = [];
  journals.slice(0, 5).forEach((j) => {
    const blockers = j.ai_analysis?.blockers || [];
    blockers.forEach((b) => recentBlockers.push(b));
  });

  const streak = (() => {
    if (!journals.length) return 0;
    const dates = new Set(
      journals.map((j) => new Date(j.created_at || j.createdAt).toDateString())
    );
    let count = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      if (dates.has(cursor.toDateString())) {
        count++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  })();

  const name = profile?.display_name || user?.displayName || user?.email?.split("@")[0] || "there";

  return (
    <div className="app-page bg-slate-50 min-h-screen relative" data-dashboard-root data-particle-scope>
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 py-8 md:px-10 lg:px-12">
        <div className="mx-auto max-w-[1350px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div data-motion>
            <div className="flex flex-wrap items-center gap-3.5">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
                Good day, {name} <span className="animate-bounce">👋</span>
              </h1>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-700 border border-amber-200 shadow-sm">
                <Flame size={16} className="text-amber-500 fill-amber-400" /> {streak} days streak
              </span>
            </div>
            <p className="mt-2.5 text-base text-slate-600 font-medium">
              Track daily momentum, conquer blockers, and align your activities with your goals.
            </p>
          </div>

          <div data-motion className="flex flex-col items-start sm:items-end gap-4">
            <GrowthConstellation className="hidden lg:block w-56 opacity-80" />
            <button
              onClick={() => navigate("/journal")}
              className="primary-button px-6 py-3 text-sm font-bold shadow-md hover:shadow-indigo-200 hover:-translate-y-0.5"
            >
              <Plus size={16} />
              New Journal Entry
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1350px] px-6 py-8 md:px-10 lg:px-12">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Key Metrics Grid (Enlarged Stat Cards) */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={<Target size={22} className="text-indigo-600" />}
                iconBg="bg-indigo-50"
                label="ACTIVE GOALS"
                value={String(activeGoals.length)}
                detail="in progress"
              />
              <StatCard
                icon={<CheckCircle2 size={22} className="text-emerald-600" />}
                iconBg="bg-emerald-50"
                label="COMPLETED GOALS"
                value={String(completedGoals.length)}
                detail="achieved"
              />
              <StatCard
                icon={<Flame size={22} className="text-amber-500" />}
                iconBg="bg-amber-50"
                label="CURRENT STREAK"
                value={String(streak)}
                detail="days active"
              />
              <StatCard
                icon={<AlertTriangle size={22} className="text-purple-600" />}
                iconBg="bg-purple-50"
                label="ACTIVE BLOCKERS"
                value={String(recentBlockers.length)}
                detail="identified"
              />
            </div>

            {/* AI Reflection Banner (Enlarged Box & Fonts) */}
            {latestAnalysis ? (
              <section data-scroll-reveal className="rounded-3xl p-7 md:p-9 bg-gradient-to-r from-indigo-50/90 via-purple-50/80 to-white border border-indigo-200/90 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
                    <Sparkles size={20} className="text-purple-600 animate-pulse" />
                    Latest AI Reflection Insight
                  </span>
                  <span className="text-sm text-slate-500 font-mono font-semibold">
                    {new Date(latestJournal.created_at || latestJournal.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {latestAnalysis.quick_summary && (
                  <p className="text-xl font-bold text-slate-900 italic mb-4 leading-relaxed">
                    "{latestAnalysis.quick_summary}"
                  </p>
                )}

                {latestAnalysis.insights?.length > 0 && (
                  <div className="rounded-2xl bg-white/95 p-5 border border-indigo-100 text-base text-slate-800 shadow-sm leading-relaxed font-medium">
                    <strong className="text-indigo-600 font-bold">Coach Note:</strong> {latestAnalysis.insights[0]}
                  </div>
                )}
              </section>
            ) : (
              <section className="panel p-8 text-center shadow-sm">
                <p className="text-base text-slate-600 font-medium">
                  You haven't logged any journal entries yet. Record your thoughts to unlock AI insights!
                </p>
                <button
                  onClick={() => navigate("/journal")}
                  className="primary-button mt-4 text-sm font-bold"
                >
                  Write First Journal
                </button>
              </section>
            )}

            {/* Middle Row: High-End AI Coach Summary & Active Blockers Cards */}
            <div className="grid gap-7 md:grid-cols-2">
              {/* AI ACCOUNTABILITY COACH CARD */}
              <section className="rounded-3xl p-7 sm:p-8 bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white border border-indigo-200/90 shadow-md flex flex-col justify-between hover:shadow-lg transition-all duration-300 min-h-[320px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-purple-100/80 px-3.5 py-1 text-xs font-bold text-purple-700 border border-purple-200 shadow-sm">
                      <Sparkles size={16} className="text-purple-600 animate-pulse" />
                      AI ACCOUNTABILITY COACH
                    </span>
                    <button
                      onClick={() => navigate("/coach")}
                      className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group transition"
                    >
                      View Report <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>

                  {summary ? (
                    <div className="mt-4">
                      <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3.5 leading-snug tracking-tight">
                        "{summary.headline}"
                      </h4>
                      {summary.coaching_suggestion && (
                        <div className="border-l-4 border-indigo-500 bg-white/90 p-4.5 rounded-r-2xl shadow-sm border border-slate-100 text-base text-slate-700 leading-relaxed font-medium">
                          {summary.coaching_suggestion}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-white/80 rounded-2xl border border-indigo-100 my-2">
                      <Sparkles size={32} className="mx-auto text-purple-400 mb-2 animate-pulse" />
                      <p className="text-base text-slate-700 font-bold">No weekly summary generated yet</p>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Reflect daily to unlock weekly accountability coaching.</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-indigo-100">
                  <button
                    onClick={() => navigate("/coach")}
                    className="primary-button w-full py-3.5 text-sm font-bold shadow-md hover:shadow-indigo-200"
                  >
                    <Sparkles size={16} />
                    Open Accountability Coach →
                  </button>
                </div>
              </section>

              {/* ACTIVE BLOCKERS CARD */}
              <section data-scroll-reveal className="panel p-7 sm:p-8 shadow-md bg-white border border-slate-200 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-all duration-300 min-h-[320px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-700 border border-rose-200 shadow-sm">
                      <AlertTriangle size={16} className="text-rose-500" />
                      ACTIVE BLOCKERS ({recentBlockers.length})
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">From recent logs</span>
                  </div>

                  {recentBlockers.length > 0 ? (
                    <ul className="flex flex-col gap-3 mt-4">
                      {recentBlockers.slice(0, 4).map((b, i) => (
                        <li
                          key={i}
                          className="text-base text-slate-800 flex items-center justify-between gap-3 bg-rose-50/70 p-4 rounded-2xl border border-rose-100 transition-all hover:bg-rose-100/60 font-semibold"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-lg shrink-0">⚠️</span>
                            <span className="truncate">{b.text}</span>
                          </div>
                          <span className="shrink-0 rounded-lg bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 capitalize border border-rose-200">
                            {b.category || "other"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-6 my-3 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mx-auto mb-3 shadow-sm">
                        <CheckCircle2 size={24} />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">Zero Active Blockers Detected</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Your goal momentum is smooth sailing! Keep reflecting to catch future friction early.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => navigate("/journal")}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-800 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                  >
                    View Journal History →
                  </button>
                </div>
              </section>
            </div>

            {/* Active Goals Preview (Enlarged Fonts) */}
            <section data-scroll-reveal>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-slate-900">Active Goals ({activeGoals.length})</h2>
                <button
                  onClick={() => navigate("/goals")}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
                >
                  Manage Goals <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>

              {activeGoals.length === 0 ? (
                <div className="panel p-8 text-center">
                  <p className="text-base text-slate-500 font-medium">No active goals currently defined.</p>
                  <button
                    onClick={() => navigate("/goals")}
                    className="primary-button mt-4 text-sm font-bold"
                  >
                    Set a Goal
                  </button>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {activeGoals.slice(0, 3).map((goal) => (
                    <div
                      key={goal.id}
                      className="panel p-7 hover:border-indigo-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                      onClick={() => navigate("/goals")}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3.5">
                          <span className="rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-600 border border-emerald-200">
                            On Track
                          </span>
                          {goal.target_date && (
                            <span className="text-xs text-slate-500 font-mono font-semibold">
                              Due {new Date(goal.target_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 leading-snug">{goal.title}</h3>
                        {goal.description && (
                          <p className="mt-2.5 text-base text-slate-600 line-clamp-2 leading-relaxed font-medium">{goal.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, iconBg = "bg-indigo-50", label, value, detail }) {
  return (
    <div
      data-motion
      className="panel p-6 sm:p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} shadow-sm`}>
        {icon}
      </div>
      <div>
        <p className="mt-5 section-label text-xs font-bold tracking-wider">{label}</p>
        <div className="mt-1.5 flex items-baseline gap-2.5">
          <span className="text-4xl font-bold text-slate-900" data-count-up>{value}</span>
          <span className="text-sm text-slate-500 font-semibold">{detail}</span>
        </div>
      </div>
    </div>
  );
}