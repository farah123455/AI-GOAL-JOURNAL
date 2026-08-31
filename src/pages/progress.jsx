import {
  TrendingUp,
  Flame,
  CheckCircle2,
  CalendarDays,
  Target,
  BookOpen,
} from "lucide-react";
import { useData } from "../context/DataContext";
import CircularProgress from "../components/CircularProgress";

function computeStreak(journals) {
  if (!journals || journals.length === 0) return 0;
  const dates = new Set(
    journals.map((j) => new Date(j.created_at || j.createdAt).toDateString())
  );
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    if (dates.has(cursor.toDateString())) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function computeWeeklyData(journals, goals) {
  const labels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const raw = labels.map((label, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);

    const count = [...journals, ...goals].filter((item) => {
      const d = new Date(item.created_at || item.createdAt);
      return (
        d.getFullYear() === day.getFullYear() &&
        d.getMonth() === day.getMonth() &&
        d.getDate() === day.getDate()
      );
    }).length;

    return { day: label, count };
  });

  const max = Math.max(...raw.map((d) => d.count), 1);

  return raw.map((d) => ({
    day: d.day,
    count: d.count,
    value: d.count > 0 ? Math.max(20, Math.round((d.count / max) * 100)) : 0,
  }));
}

function formatRelativeDate(date) {
  if (!date) return "";
  const created = new Date(date);
  if (Number.isNaN(created.getTime())) return "";
  const now = new Date();
  const diff = now.getTime() - created.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  return created.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export default function Progress() {
  const { goals = [], journals = [], initialLoading } = useData();

  const loading = initialLoading && goals.length === 0 && journals.length === 0;

  const weeklyData = computeWeeklyData(journals, goals);
  const totalWeeklyActivities = weeklyData.reduce((sum, item) => sum + item.count, 0);
  const average = Math.round(
    (totalWeeklyActivities / 7) * 100
  );
  const streak = computeStreak(journals);
  const completedActivities = goals.length + journals.length;
  
  const completedGoalsCount = goals.filter((g) => g.status?.toLowerCase() === "completed").length;
  const activeGoalsCount = goals.filter((g) => g.status?.toLowerCase() === "active").length;

  const overallProgress = (() => {
    if (goals.length > 0) {
      return Math.min(
        100,
        Math.round(((completedGoalsCount * 1.0 + activeGoalsCount * 0.5) / goals.length) * 100)
      );
    }
    if (journals.length > 0) {
      return Math.min(100, journals.length * 25);
    }
    return 0;
  })();

  const recentActivity = [
    ...journals.map((j) => ({
      id: `journal-${j.id}`,
      title: j.title || "Reflection Entry",
      detail: j.content?.substring(0, 70) || "",
      time: formatRelativeDate(j.created_at || j.createdAt),
      sortDate: j.created_at || j.createdAt,
      type: "journal",
    })),
    ...goals.map((g) => ({
      id: `goal-${g.id}`,
      title: g.title,
      detail: g.description || "Goal milestone",
      time: formatRelativeDate(g.created_at || g.createdAt),
      sortDate: g.created_at || g.createdAt,
      type: "goal",
    })),
  ]
    .sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate))
    .slice(0, 5);

  return (
    <div className="app-page bg-slate-50 min-h-screen">
      <main className="mx-auto max-w-[1350px] px-6 py-8 md:px-10 lg:px-12">
        {loading ? (
          <section className="panel px-6 py-20 text-center shadow-sm">
            <p className="text-base font-medium text-slate-500">Loading your performance metrics…</p>
          </section>
        ) : (
          <div className="space-y-8">
            {/* METRICS STAT CARDS */}
            <div className="grid gap-5 md:grid-cols-3 stagger-in">
              <StatCard
                icon={<TrendingUp size={20} className="text-indigo-600" />}
                iconBg="bg-indigo-50"
                label="WEEKLY ACTIVITY"
                value={`${totalWeeklyActivities} logs`}
                detail="this week"
              />
              <StatCard
                icon={<Flame size={20} className="text-amber-500" />}
                iconBg="bg-amber-50"
                label="ACTIVE STREAK"
                value={`${streak} Days`}
                detail="consistent momentum"
              />
              <StatCard
                icon={<CheckCircle2 size={20} className="text-emerald-600" />}
                iconBg="bg-emerald-50"
                label="TOTAL ACTIVITIES"
                value={String(completedActivities)}
                detail="reflections & goals"
              />
            </div>

            {/* CHART + OVERALL GOAL PROGRESS */}
            <div className="grid gap-7 lg:grid-cols-[1.6fr_0.9fr]">
              {/* WEEKLY CONSISTENCY BAR CHART */}
              <div className="panel p-7 sm:p-8 shadow-sm bg-white rounded-3xl">
                <p className="section-label">ACTIVITY OVERVIEW</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Weekly Consistency
                </h2>
                <p className="mt-1 text-sm text-slate-500 font-medium">
                  Reflections and goal milestones logged over the current week.
                </p>

                <div className="mt-8 flex h-60 items-end gap-3 sm:gap-4 border-b border-slate-100 pb-4">
                  {weeklyData.map((item) => (
                    <div key={item.day} className="flex h-full flex-1 flex-col justify-end items-center">
                      {item.count > 0 && (
                        <span className="mb-2 text-xs font-bold text-indigo-600 font-mono">
                          {item.count}
                        </span>
                      )}
                      <div className="flex h-full w-full items-end justify-center">
                        <div
                          className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                            item.count > 0
                              ? "bg-gradient-to-t from-indigo-700 to-indigo-500 shadow-sm hover:brightness-110"
                              : "bg-slate-100 h-2"
                          }`}
                          style={{ height: item.count > 0 ? `${item.value}%` : "8px" }}
                        />
                      </div>
                      <span className="mt-3 text-center text-xs font-bold tracking-wider text-slate-500">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* OVERALL GOAL PROGRESS CIRCLE */}
              <div className="panel p-7 sm:p-8 shadow-sm bg-white rounded-3xl flex flex-col justify-between">
                <div>
                  <p className="section-label">GOAL COMPLETION</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Overall Progress
                  </h2>

                  <div className="mt-8 flex justify-center">
                    <CircularProgress
                      value={overallProgress}
                      className="w-44 h-44"
                      fillClass="stroke-indigo-600"
                      trackClass="stroke-slate-100"
                      center={
                        <div className="text-center">
                          <span className="text-3xl font-bold text-slate-900">{overallProgress}%</span>
                          <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                            Complete
                          </p>
                        </div>
                      }
                    />
                  </div>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">
                        {goals.length > 0 ? "Active Goals on Track" : "Reflections Logged"}
                      </p>
                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {goals.length > 0
                          ? `${activeGoalsCount} / ${goals.length}`
                          : `${journals.length} entries`}
                      </p>
                    </div>
                    <Target size={22} className="text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT ACTIVITY LOG */}
            <section className="panel p-7 sm:p-8 shadow-sm bg-white rounded-3xl">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                <div>
                  <p className="section-label">ACTIVITY LOG</p>
                  <h2 className="mt-1.5 text-2xl font-bold text-slate-900">Recent Progress & Activity</h2>
                </div>
                <CalendarDays size={22} className="text-indigo-600" />
              </div>

              <div className="divide-y divide-slate-100">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-slate-400 italic py-8 text-center font-medium">
                    No recent activity recorded yet.
                  </p>
                ) : (
                  recentActivity.map((act) => (
                    <div key={act.id} className="py-4.5 flex items-start justify-between gap-4 first:pt-2 last:pb-2">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          act.type === "journal" ? "bg-purple-50 text-purple-600" : "bg-indigo-50 text-indigo-600"
                        }`}>
                          {act.type === "journal" ? <BookOpen size={16} /> : <Target size={16} />}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 leading-snug">{act.title}</h3>
                          <p className="text-sm text-slate-600 mt-1 line-clamp-1 font-medium">{act.detail}</p>
                        </div>
                      </div>

                      <span className="shrink-0 text-xs text-slate-400 font-mono font-medium">
                        {act.time}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, iconBg = "bg-indigo-50", label, value, detail }) {
  return (
    <div className="panel p-6 shadow-sm bg-white rounded-3xl flex flex-col justify-between hover-lift">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg}`}>
        {icon}
      </div>
      <div className="mt-5">
        <p className="section-label text-xs font-bold">{label}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900">{value}</span>
          <span className="text-xs text-slate-500 font-medium">{detail}</span>
        </div>
      </div>
    </div>
  );
}
