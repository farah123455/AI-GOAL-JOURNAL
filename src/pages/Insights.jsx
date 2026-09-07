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
    <div className="app-page bg-[#F4F1E8] min-h-screen">
      <main className="mx-auto max-w-7xl px-5 py-6 md:px-8 animate-rise">
        <section className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-[#26261F] via-[#3A492E] to-[#4B5D3C] border border-[#3A492E] shadow-md text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white">
            <Sparkles size={20} />
          </div>

          <h2 className="mt-5 text-xl sm:text-2xl font-bold text-white font-serif">
            Your personal growth snapshot
          </h2>

          <p className="mt-2.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#E2E9DF] font-medium">
            Your progress is built from the small actions you take every day. Keep your goals realistic, reflect regularly, and focus on consistency rather than perfection.
          </p>

          <button
            onClick={() => navigate("/progress")}
            className="mt-5 flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#26261F] hover:bg-[#E2E9DF] transition shadow-xs"
          >
            View progress
            <ArrowUpRight size={14} />
          </button>
        </section>

        <div className="mt-6 grid gap-5 md:grid-cols-3 stagger-in">
          {insights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="panel p-5 shadow-xs border-[#E2E9DF] hover-lift">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E2E9DF] text-[#4B5D3C]">
                  <Icon size={18} />
                </div>
                <h3 className="mt-4 font-bold text-[#26261F] text-base">{item.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">{item.text}</p>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
