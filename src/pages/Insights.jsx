import {
  Sparkles,
  TrendingUp,
  Target,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Insights() {
  const navigate = useNavigate();

  const insights = [
    {
      icon: TrendingUp,
      title: "Your consistency is improving",
      text: "You have been showing up regularly. Keeping the habit small and consistent can help maintain your momentum.",
    },
    {
      icon: Target,
      title: "Focus on one priority",
      text: "Choose one important goal for the next few days and give it your main attention.",
    },
    {
      icon: BookOpen,
      title: "Reflection can reveal patterns",
      text: "Your journal entries can help you notice what improves or affects your productivity.",
    },
  ];

  return (
    <div className="app-page">
      <header className="border-b border-border bg-surface px-5 py-7 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1250px]">
          <p className="section-label">PERSONAL INTELLIGENCE</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-cream">
            Insights
          </h1>
          <p className="mt-2 text-sm text-beige/60">
            Understand your patterns and make better decisions.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1250px] px-5 py-7 md:px-8 lg:px-10">
        <section className="panel p-7 md:p-9 bg-gradient-to-br from-burgundy to-surface border border-border shadow-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cream text-burgundy">
            <Sparkles size={22} />
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-cream">
            Your personal growth snapshot
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-beige/80">
            Your progress is built from the small actions you take every day. Keep your goals realistic, reflect regularly, and focus on consistency rather than perfection.
          </p>

          <button
            onClick={() => navigate("/progress")}
            className="mt-6 flex items-center gap-2 rounded-xl bg-cream px-4 py-3 text-xs font-bold text-burgundy hover:bg-beige transition"
          >
            View progress
            <ArrowUpRight size={14} />
          </button>
        </section>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {insights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="panel p-6 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-burgundy text-beige">
                  <Icon size={18} />
                </div>
                <h3 className="mt-5 font-semibold text-cream">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-beige/70">{item.text}</p>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
