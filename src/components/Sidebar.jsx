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
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

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
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  };

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

      {/* STATIC SIDEBAR (Collapsible: 285px expanded / 80px contracted) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen shrink-0 flex-col border-r border-[#E2E9DF] bg-white transition-all duration-300 ease-out lg:static lg:translate-x-0 ${
          isCollapsed ? "w-[80px]" : "w-[285px]"
        } ${mobileOpen ? "translate-x-0 w-[285px]" : "-translate-x-full"}`}
      >
        {/* BRAND HEADER */}
        <div className={`flex h-[84px] shrink-0 items-center justify-between border-b border-[#E2E9DF] ${isCollapsed ? "px-3 justify-center" : "px-6"}`}>
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-[#E2E9DF] shadow-xs p-1 animate-float overflow-hidden">
              <img src="/logo.png" alt="AI Journal Logo" className="h-full w-full object-contain rounded-lg" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-base font-bold tracking-tight text-[#26261F] font-serif truncate">
                  AI JOURNAL
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#4B5D3C] font-extrabold truncate">
                  Growth workspace
                </p>
              </div>
            )}
          </div>

          {/* Mobile Close Button Only */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="text-slate-500 hover:text-[#26261F] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <div className={`flex-1 py-6 overflow-y-auto space-y-6 ${isCollapsed ? "px-2" : "px-4"}`}>
          {navigation.map((section) => (
            <div key={section.label}>
              {!isCollapsed ? (
                <p className="mb-2.5 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#4B5D3C]">
                  {section.label}
                </p>
              ) : (
                <div className="my-2 border-t border-[#E2E9DF]/80 mx-2" />
              )}
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      title={isCollapsed ? item.name : undefined}
                      className={({ isActive }) =>
                        `group relative flex items-center rounded-xl transition-all duration-200 ${
                          isCollapsed
                            ? "justify-center h-11 w-11 mx-auto"
                            : "gap-3.5 px-3.5 py-3 text-[14px] font-medium"
                        } ${
                          isActive
                            ? "bg-[#E2E9DF]/70 text-[#4B5D3C] shadow-xs font-bold"
                            : "text-[#26261F] hover:bg-[#F4F1E8] hover:text-[#4B5D3C]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className={`absolute top-1/2 -translate-y-1/2 rounded-r-full bg-[#4B5D3C] ${isCollapsed ? "left-0 h-5 w-1" : "left-0 h-6 w-1"}`} />
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
                          {!isCollapsed && <span>{item.name}</span>}

                          {/* Hover Tooltip when sidebar is contracted */}
                          {isCollapsed && (
                            <div className="pointer-events-none absolute left-full ml-3 hidden rounded-lg bg-[#26261F] px-2.5 py-1 text-xs font-bold text-white shadow-md group-hover:block z-50 whitespace-nowrap animate-fade-in">
                              {item.name}
                            </div>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM QUICK TOGGLE FOOTER */}
        <div className={`p-3 border-t border-[#E2E9DF] flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <span className="text-[11px] font-semibold text-slate-500 pl-2">
              Sidebar View
            </span>
          )}
          <button
            type="button"
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand Sidebar" : "Contract Sidebar"}
            className={`flex items-center gap-2 rounded-xl transition-all duration-200 ${
              isCollapsed
                ? "h-10 w-10 justify-center bg-[#F4F1E8] text-[#4B5D3C] hover:bg-[#E2E9DF] border border-[#E2E9DF]"
                : "px-3 py-2 text-xs font-bold text-[#4B5D3C] bg-[#F4F1E8] hover:bg-[#E2E9DF] border border-[#E2E9DF]"
            }`}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={16} /> Contract Sidebar
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}