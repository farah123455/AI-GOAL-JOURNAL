import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Check,
  Sparkles,
  Target,
  BookOpen,
  X,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { goals, summary, journals } = useData();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [readIds, setReadIds] = useState([]);

  const popoverRef = useRef(null);
  const accountRef = useRef(null);

  const email = user?.email || "user@example.com";
  const initial = email.charAt(0).toUpperCase();

  const notificationsList = [
    {
      id: "notif-1",
      icon: Sparkles,
      title: summary?.headline ? "Weekly AI Summary Ready" : "AI Coach Insight Available",
      message: summary?.headline
        ? `"${summary.headline}"`
        : "Generate your weekly accountability review in the AI Coach tab.",
      link: "/coach",
      time: "Recent",
    },
    {
      id: "notif-2",
      icon: Target,
      title: "Goal Reminder",
      message:
        goals.length > 0
          ? `You have ${goals.filter((g) => g.status === "Active").length} active goals in progress. Keep up the momentum!`
          : "Set your first goal milestone to track progress.",
      link: "/goals",
      time: "Today",
    },
    {
      id: "notif-3",
      icon: BookOpen,
      title: "Daily Journal Prompt",
      message:
        journals.length > 0
          ? `Last entry logged ${new Date(journals[0]?.created_at || Date.now()).toLocaleDateString()}. How is your day going?`
          : "Record your daily voice or text reflection.",
      link: "/journal",
      time: "Daily",
    },
  ];

  const unreadCount = notificationsList.filter((n) => !readIds.includes(n.id)).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function markAllRead() {
    setReadIds(notificationsList.map((n) => n.id));
  }

  async function handleLogout() {
    setShowAccountMenu(false);
    await logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-[76px] shrink-0 items-center justify-between border-b border-border bg-[#190D0F]/95 px-5 backdrop-blur-xl md:px-8">
      {/* LEFT */}
      <div className="ml-12 lg:ml-0">
        <div className="hidden items-center gap-2 md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-burgundy" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-beige/60">
            Personal growth workspace
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* NOTIFICATION BUTTON & POPOVER */}
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-beige transition hover:border-burgundy hover:text-cream"
            title="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-burgundy animate-pulse" />
            )}
          </button>

          {/* NOTIFICATIONS POPOVER DROPDOWN */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-surface shadow-glow z-50 p-4">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-beige" />
                  <h3 className="text-sm font-bold text-cream">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-wine/30 px-2 py-0.5 text-[10px] font-bold text-cream border border-wine/50">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-beige/60 hover:text-cream transition flex items-center gap-1"
                    >
                      <Check size={12} /> Mark read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-beige/60 hover:text-cream"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notificationsList.map((n) => {
                  const Icon = n.icon;
                  const isRead = readIds.includes(n.id);
                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        setReadIds((prev) => [...prev, n.id]);
                        setShowNotifications(false);
                        if (n.link) navigate(n.link);
                      }}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                        isRead
                          ? "bg-surface2/50 border-border opacity-70"
                          : "bg-surface2 border-border hover:border-wine"
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-wine/30 text-cream mt-0.5">
                        <Icon size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-cream truncate">{n.title}</p>
                          <span className="text-[10px] text-beige/40 font-mono">{n.time}</span>
                        </div>
                        <p className="text-xs text-beige/70 mt-1 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ACCOUNT BUTTON & DROPDOWN MENU */}
        <div className="relative" ref={accountRef}>
          <button
            type="button"
            onClick={() => setShowAccountMenu((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3 py-1.5 transition hover:border-burgundy"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-burgundy text-xs font-bold text-cream">
              {initial}
            </div>
            <div className="hidden sm:block text-left">
              <p className="max-w-[120px] truncate text-xs font-semibold text-cream">
                {email}
              </p>
              <p className="text-[9px] text-beige/50">
                Account
              </p>
            </div>
            <ChevronDown size={14} className="text-beige/60 hidden sm:block" />
          </button>

          {/* ACCOUNT DROPDOWN MENU */}
          {showAccountMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-surface shadow-glow z-50 p-2">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-xs font-bold text-cream truncate">{email}</p>
                <p className="text-[10px] text-beige/50 uppercase tracking-wider mt-0.5">Personal Workspace</p>
              </div>

              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  navigate("/profile");
                }}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-cream hover:bg-surface2 transition"
              >
                <User size={15} className="text-beige" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  navigate("/settings");
                }}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-cream hover:bg-surface2 transition"
              >
                <Settings size={15} className="text-beige" />
                <span>Settings</span>
              </button>

              <div className="my-1 border-t border-border" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/30 transition"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}