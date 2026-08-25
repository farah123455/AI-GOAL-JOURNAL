import {
  TrendingUp,
  Flame,
  CheckCircle2,
  CalendarDays,
  Target,
} from "lucide-react";
import { useData } from "../context/DataContext";

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

    return { day: label, value: count };
  });

  const max = Math.max(...raw.map((d) => d.value), 1);

  return raw.map((d) => ({
    day: d.day,
    value: Math.round((d.value / max) * 100),
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
  const { goals, journals, loading } = useData();

  const weeklyData = computeWeeklyData(journals, goals);
  const average = Math.round(
    weeklyData.reduce((sum, item) => sum + item.value, 0) / (weeklyData.length || 1)
  );
  const streak = computeStreak(journals);
  const completedActivities = goals.length + journals.length;
  const completedGoalsCount = goals.filter((g) => g.status?.toLowerCase() === "completed").length;
  const overallProgress =
    goals.length > 0
      ? Math.round((completedGoalsCount / goals.length) * 100)
      : 0;

  const activeGoalsCount = goals.filter((g) => g.status?.toLowerCase() !== "completed").length;

  const recentActivity = [
    ...journals.map((j) => ({
      id: `journal-${j.id}`,
      title: j.title || "Untitled entry",
      detail: j.content?.substring(0, 60) || "",
      time: formatRelativeDate(j.created_at || j.createdAt),
      sortDate: j.created_at || j.createdAt,
    })),
    ...goals.map((g) => ({
      id: `goal-${g.id}`,
      title: g.title,
      detail: g.description || "No description provided.",
      time: formatRelativeDate(g.created_at || g.createdAt),
      sortDate: g.created_at || g.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate))
    .slice(0, 4);

  return (
    <div className="app-page bg-slate-50 min-h-screen">
      <header className="border-b border-slate-200 bg-white px-5 py-7 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1250px]">
          <p className="section-label">PERFORMANCE</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Progress
          </h1>
          <p className="mt-2 text-sm text-slate-600 font-medium">
            Understand your consistency and movement toward your goals.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1250px] px-5 py-7 md:px-8 lg:px-10">
        {loading ? (
          <section className="panel px-6 py-20 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-500">Loading your progress…</p>
          </section>
        ) : (
          <>
            {/* METRICS */}
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                icon={<TrendingUp size={18} className="text-indigo-600" />}
                iconBg="bg-indigo-50"
                label="WEEKLY PROGRESS"
                value={`${average}%`}
                detail="average this week"
              />
              <StatCard
                icon={<Flame size={18} className="text-amber-500" />}
                iconBg="bg-amber-50"
                label="CURRENT STREAK"
                value={String(streak)}
                detail="days active"
              />
              <StatCard
                icon={<CheckCircle2 size={18} className="text-emerald-600" />}
                iconBg="bg-emerald-50"
                label="COMPLETED"
                value={String(completedActivities)}
                detail="activities"
              />
            </div>

            {/* CHART + OVERALL */}
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_0.8fr]">
              <div className="panel p-6 shadow-sm md:p-7">
                <p className="section-label">ACTIVITY OVERVIEW</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Weekly consistency
                </h2>
                <div className="mt-8 flex h-56 items-end gap-3">
                  {weeklyData.map((item) => (
                    <div key={item.day} className="flex h-full flex-1 flex-col justify-end">
                      <div className="flex h-full items-end">
                        <div
                          className="mx-auto w-full max-w-[42px] rounded-t-lg bg-indigo-600 transition hover:bg-indigo-700"
                          style={{ height: `${item.value}%` }}
                        />
                      </div>
                      <span className="mt-3 text-center text-[9px] font-bold tracking-wider text-slate-400">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel p-6 shadow-sm md:p-7">
                <p className="section-label">GOAL COMPLETION</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Overall progress
                </h2>
                <div className="mt-8 flex justify-center">
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[12px] border-slate-100">
                    <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-l-indigo-600 border-t-indigo-600 border-r-indigo-600 rotate-[-35deg]" />
                    <div className="text-center">
                      <p className="text-3xl font-bold text-slate-900">{overallProgress}%</p>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-slate-400 font-bold">
                        complete
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-7 border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium">Goals on track</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {goals.length === 0 ? "0 / 0" : `${activeGoalsCount} / ${goals.length}`}
                      </p>
                    </div>
                    <Target size={18} className="text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIVITY LOG */}
            <section className="panel mt-5 p-6 shadow-sm md:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-label">ACTIVITY LOG</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">Recent progress</h2>
                </div>
                <CalendarDays size={18} className="text-slate-400" />
              </div>

              <div className="mt-5 divide-y divide-slate-100">
                {recentActivity.length === 0 ? (
                  <div className="py-8 text-center">
                    <CheckCircle2 size={22} className="mx-auto text-slate-300" />
                    <p className="mt-3 text-sm font-bold text-slate-900">Nothing yet</p>
                    <p className="mt-1 text-xs text-slate-500 font-medium">
                      Your recent activity will appear here.
                    </p>
                  </div>
                ) : (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 py-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{activity.title}</p>
                        <p className="mt-1 text-xs text-slate-600 font-medium">{activity.detail}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{activity.time}</span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
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
