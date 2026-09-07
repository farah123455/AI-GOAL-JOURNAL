import {
  LayoutDashboard,
  Calendar,
  Target,
  BookOpen,
  Sparkles,
  TrendingUp,
  User,
  Settings,
  Repeat,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const navigation = [
  {
    label: "Overview",
    items: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Calendar",
        path: "/calendar",
        icon: Calendar,
      },
      {
        name: "Progress",
        path: "/progress",
        icon: TrendingUp,
      },
    ],
  },
  {
    label: "Growth",
    items: [
      {
        name: "AI Journal",
        path: "/journal",
        icon: BookOpen,
      },
      {
        name: "Manual Goal",
        path: "/goals",
        icon: Target,
      },
      {
        name: "Habits",
        path: "/habits",
        icon: Repeat,
      },
      {
        name: "AI Coach",
        path: "/coach",
        icon: Sparkles,
      },
      {
        name: "AI Insights",
        path: "/insights",
        icon: Sparkles,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        name: "Profile",
        path: "/profile",
        icon: User,
      },
      {
        name: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* MOBILE BUTTON */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E9DF] bg-white text-[#26261F] shadow-xs transition hover:scale-105 hover:border-[#4B5D3C] lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#26261F]/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* STATIC SIDEBAR (Broader 285px width) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[285px] shrink-0 flex-col border-r border-[#E2E9DF] bg-white transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* BRAND (Broader 84px header height) */}
        <div className="flex h-[84px] shrink-0 items-center justify-between border-b border-[#E2E9DF] px-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-[#E2E9DF] shadow-xs p-1 animate-float overflow-hidden">
              <img src="/logo.png" alt="AI Journal Logo" className="h-full w-full object-contain rounded-lg" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-[#26261F] font-serif">
                AI JOURNAL
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#4B5D3C] font-extrabold">
                Growth workspace
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="text-slate-500 hover:text-[#26261F] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 px-4 py-6 overflow-y-auto space-y-7">
          {navigation.map((section) => (
            <div key={section.label}>
              <p className="mb-2.5 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#4B5D3C]">
                {section.label}
              </p>
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-[14px] font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-[#E2E9DF]/70 text-[#4B5D3C] shadow-xs font-bold"
                            : "text-[#26261F] hover:bg-[#F4F1E8] hover:text-[#4B5D3C] hover:translate-x-0.5"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#4B5D3C]" />
                          )}
                          <Icon
                            size={19}
                            strokeWidth={item.path === "/coach" || item.path === "/insights" ? 2 : 1.8}
                            className={
                              isActive
                                ? "text-[#4B5D3C]"
                                : "text-slate-400 group-hover:text-[#4B5D3C] transition-colors"
                            }
                          />
                          <span>{item.name}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}