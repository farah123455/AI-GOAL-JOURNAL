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
    <div className="app-page">
      <header className="border-b border-border bg-surface px-5 py-7 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1250px]">
          <p className="section-label">PERFORMANCE</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-cream">
            Progress
          </h1>
          <p className="mt-2 text-sm text-beige/60">
            Understand your consistency and movement toward your goals.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1250px] px-5 py-7 md:px-8 lg:px-10">
        {loading ? (
          <section className="panel px-6 py-20 text-center shadow-card">
            <p className="text-sm text-beige/55">Loading your progress…</p>
          </section>
        ) : (
          <>
            {/* METRICS */}
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                icon={<TrendingUp size={18} />}
                label="WEEKLY PROGRESS"
                value={`${average}%`}
                detail="average this week"
              />
              <StatCard
                icon={<Flame size={18} />}
                label="CURRENT STREAK"
                value={String(streak)}
                detail="days in a row"
              />
              <StatCard
                icon={<CheckCircle2 size={18} />}
                label="COMPLETED"
                value={String(completedActivities)}
                detail="activities"
              />
            </div>

            {/* CHART + OVERALL */}
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_0.8fr]">
              <div className="panel p-6 shadow-card md:p-7">
                <p className="section-label">ACTIVITY OVERVIEW</p>
                <h2 className="mt-2 text-xl font-semibold text-cream">
                  Weekly consistency
                </h2>
                <div className="mt-8 flex h-56 items-end gap-3">
                  {weeklyData.map((item) => (
                    <div key={item.day} className="flex h-full flex-1 flex-col justify-end">
                      <div className="flex h-full items-end">
                        <div
                          className="mx-auto w-full max-w-[42px] rounded-t-lg bg-burgundy transition hover:bg-wine"
                          style={{ height: `${item.value}%` }}
                        />
                      </div>
                      <span className="mt-3 text-center text-[9px] font-semibold tracking-wider text-beige/40">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel p-6 shadow-card md:p-7">
                <p className="section-label">GOAL COMPLETION</p>
                <h2 className="mt-2 text-xl font-semibold text-cream">
                  Overall progress
                </h2>
                <div className="mt-8 flex justify-center">
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[12px] border-[#32191D]">
                    <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-l-burgundy border-t-burgundy border-r-burgundy rotate-[-35deg]" />
                    <div className="text-center">
                      <p className="text-3xl font-semibold text-cream">{overallProgress}%</p>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-beige/45">
                        complete
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-7 border-t border-border pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-beige/45">Goals on track</p>
                      <p className="mt-1 text-lg font-semibold text-cream">
                        {goals.length === 0 ? "0 / 0" : `${activeGoalsCount} / ${goals.length}`}
                      </p>
                    </div>
                    <Target size={18} className="text-beige/50" />
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIVITY LOG */}
            <section className="panel mt-5 p-6 shadow-card md:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-label">ACTIVITY LOG</p>
                  <h2 className="mt-2 text-xl font-semibold text-cream">Recent progress</h2>
                </div>
                <CalendarDays size={18} className="text-beige/50" />
              </div>

              <div className="mt-5 divide-y divide-border">
                {recentActivity.length === 0 ? (
                  <div className="py-8 text-center">
                    <CheckCircle2 size={22} className="mx-auto text-beige/35" />
                    <p className="mt-3 text-sm font-semibold text-cream">Nothing yet</p>
                    <p className="mt-1 text-xs text-beige/45">
                      Your recent activity will appear here.
                    </p>
                  </div>
                ) : (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 py-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-wine/25 text-cream">
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-cream">{activity.title}</p>
                        <p className="mt-1 text-xs text-beige/50">{activity.detail}</p>
                      </div>
                      <span className="text-[10px] text-beige/35">{activity.time}</span>
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

function StatCard({ icon, label, value, detail }) {
  return (
    <div className="panel p-5 shadow-card">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-wine/25 text-cream">
        {icon}
      </div>
      <p className="mt-5 section-label">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-cream">{value}</span>
        <span className="text-[11px] text-beige/45">{detail}</span>
      </div>
    </div>
  );
}
