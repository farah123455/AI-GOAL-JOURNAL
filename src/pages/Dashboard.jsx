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
    <div className="app-page bg-slate-50 min-h-screen">
      <header className="border-b border-slate-200 bg-white px-5 py-7 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1250px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="section-label">OVERVIEW</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Good day, {name} 👋
            </h1>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              Track daily momentum, conquer blockers, and align your activities with your goals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/journal")}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition shadow-sm"
            >
              <BookOpen size={15} className="text-indigo-600" />
              New Journal
            </button>
            <button
              onClick={() => navigate("/goals")}
              className="primary-button"
            >
              <Plus size={15} />
              New Goal
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1250px] px-5 py-7 md:px-8 lg:px-10">
        {loading ? (
          <section className="panel px-6 py-20 text-center shadow-sm">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">Loading productivity metrics…</p>
          </section>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Key Metrics Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={<Target size={18} className="text-indigo-600" />}
                iconBg="bg-indigo-50"
                label="ACTIVE GOALS"
                value={String(activeGoals.length)}
                detail="in progress"
              />
              <StatCard
                icon={<CheckCircle2 size={18} className="text-emerald-600" />}
                iconBg="bg-emerald-50"
                label="COMPLETED GOALS"
                value={String(completedGoals.length)}
                detail="achieved"
              />
              <StatCard
                icon={<Flame size={18} className="text-amber-500" />}
                iconBg="bg-amber-50"
                label="CURRENT STREAK"
                value={String(streak)}
                detail="days active"
              />
              <StatCard
                icon={<AlertTriangle size={18} className="text-purple-600" />}
                iconBg="bg-purple-50"
                label="ACTIVE BLOCKERS"
                value={String(recentBlockers.length)}
                detail="identified"
              />
            </div>

            {/* AI Reflection Banner */}
            {latestAnalysis ? (
              <section className="rounded-2xl p-6 bg-gradient-to-r from-indigo-50/90 via-purple-50/80 to-white border border-indigo-200/80 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                    <Sparkles size={16} className="text-purple-600" />
                    Latest AI Reflection Insight
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono font-medium">
                    {new Date(latestJournal.created_at || latestJournal.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {latestAnalysis.quick_summary && (
                  <p className="text-sm font-semibold text-slate-900 italic mb-3 leading-relaxed">
                    "{latestAnalysis.quick_summary}"
                  </p>
                )}

                {latestAnalysis.insights?.length > 0 && (
                  <div className="rounded-xl bg-white/90 p-3.5 border border-indigo-100 text-xs text-slate-700 shadow-sm">
                    <strong className="text-indigo-600 font-semibold">Coach Note:</strong> {latestAnalysis.insights[0]}
                  </div>
                )}
              </section>
            ) : (
              <section className="panel p-6 text-center shadow-sm">
                <p className="text-xs text-slate-500 font-medium">
                  You haven't logged any journal entries yet. Record your thoughts to unlock AI insights!
                </p>
                <button
                  onClick={() => navigate("/journal")}
                  className="primary-button mt-3"
                >
                  Write First Journal
                </button>
              </section>
            )}

            {/* Middle Row: AI Coach Summary & Active Blockers */}
            <div className="grid gap-6 md:grid-cols-2">
              <section className="panel p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="section-label flex items-center gap-1.5 text-indigo-600">
                      <Sparkles size={14} className="text-indigo-600" />
                      AI ACCOUNTABILITY COACH
                    </h3>
                    <button
                      onClick={() => navigate("/coach")}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      View Report <ArrowUpRight size={13} />
                    </button>
                  </div>

                  {summary ? (
                    <div>
                      <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                        "{summary.headline}"
                      </h4>
                      {summary.coaching_suggestion && (
                        <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
                          {summary.coaching_suggestion}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-xs text-slate-400 font-medium">
                        No weekly summary generated yet.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => navigate("/coach")}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-xs font-semibold text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition"
                  >
                    Open Accountability Coach
                  </button>
                </div>
              </section>

              <section className="panel p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="section-label flex items-center gap-1.5 text-red-600">
                      <AlertTriangle size={14} />
                      ACTIVE BLOCKERS ({recentBlockers.length})
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">From recent logs</span>
                  </div>

                  {recentBlockers.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {recentBlockers.slice(0, 4).map((b, i) => (
                        <li
                          key={i}
                          className="text-xs text-slate-800 flex items-center justify-between gap-2 bg-red-50 p-2.5 rounded-xl border border-red-100"
                        >
                          <span className="truncate font-medium">{b.text}</span>
                          <span className="shrink-0 rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 capitalize">
                            {b.category || "other"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-6 text-center">
                      Zero blockers detected in your recent reflections. Smooth sailing!
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => navigate("/journal")}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
                  >
                    View Journal History →
                  </button>
                </div>
              </section>
            </div>

            {/* Active Goals Preview */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Active Goals ({activeGoals.length})</h2>
                <button
                  onClick={() => navigate("/goals")}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  Manage Goals <ArrowUpRight size={13} />
                </button>
              </div>

              {activeGoals.length === 0 ? (
                <div className="panel p-6 text-center">
                  <p className="text-xs text-slate-500 font-medium">No active goals currently defined.</p>
                  <button
                    onClick={() => navigate("/goals")}
                    className="primary-button mt-3"
                  >
                    Set a Goal
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeGoals.slice(0, 3).map((goal) => (
                    <div
                      key={goal.id}
                      className="panel p-5 hover:border-indigo-300 hover:shadow-md transition cursor-pointer"
                      onClick={() => navigate("/goals")}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-200">
                          On Track
                        </span>
                        {goal.target_date && (
                          <span className="text-[10px] text-slate-400 font-mono font-medium">
                            Due {new Date(goal.target_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{goal.title}</h3>
                      {goal.description && (
                        <p className="mt-1 text-xs text-slate-600 line-clamp-2">{goal.description}</p>
                      )}
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
    <div className="panel p-5 shadow-sm">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <p className="mt-5 section-label">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        <span className="text-[11px] text-slate-500 font-medium">{detail}</span>
      </div>
    </div>
  );
}