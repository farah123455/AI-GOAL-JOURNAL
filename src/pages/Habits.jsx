import {
  Repeat,
  Plus,
  X,
  Check,
  Flame,
  Trash2,
  Pencil,
  CalendarCheck,
  Trophy,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  loadHabits,
  loadCompletions,
  persist,
  makeHabit,
  lastNDays,
  dayLabel,
  todayISO,
  calculateCurrentStreak,
  calculateBestStreak,
  habitStats,
} from "../utils/habitStorage";

const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
];

function StatCard({ icon: Icon, iconClass, value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${iconClass}`}>
        <Icon size={20} />
      </div>
      <p className="mt-4 text-2xl font-bold text-slate-900 leading-tight">{value}</p>
      <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function Habits() {
  const { user } = useAuth();
  const userId = user?.uid;

  const [habits, setHabits] = useState(() => loadHabits(userId));
  const [completions, setCompletions] = useState(() => loadCompletions(userId));

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deletingHabit, setDeletingHabit] = useState(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [formError, setFormError] = useState("");

  const week = useMemo(() => lastNDays(7), []);
  const stats = useMemo(() => habitStats(habits, completions), [habits, completions]);

  function saveToStorage(nextHabits, nextCompletions) {
    setHabits(nextHabits);
    setCompletions(nextCompletions);
    persist(userId, nextHabits, nextCompletions);
  }

  function resetForm() {
    setName("");
    setDescription("");
    setFrequency("daily");
    setEditingHabit(null);
    setFormError("");
    setShowFormModal(false);
  }

  function openCreate() {
    setEditingHabit(null);
    setName("");
    setDescription("");
    setFrequency("daily");
    setFormError("");
    setShowFormModal(true);
  }

  function openEdit(habit) {
    setEditingHabit(habit);
    setName(habit.name || "");
    setDescription(habit.description || "");
    setFrequency(habit.frequency || "daily");
    setFormError("");
    setShowFormModal(true);
  }

  function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Habit name is required");
      return;
    }
    if (editingHabit) {
      const nextHabits = habits.map((h) =>
        h.id === editingHabit.id
          ? {
              ...h,
              name: name.trim(),
              description: description.trim() || null,
              frequency,
            }
          : h
      );
      saveToStorage(nextHabits, completions);
    } else {
      const habit = makeHabit({ name, description, frequency });
      saveToStorage([habit, ...habits], completions);
    }
    resetForm();
  }

  function handleDelete() {
    if (!deletingHabit) return;
    const nextCompletions = { ...completions };
    delete nextCompletions[deletingHabit.id];
    saveToStorage(habits.filter((h) => h.id !== deletingHabit.id), nextCompletions);
    setDeletingHabit(null);
  }

  function toggleCheck(habitId, date) {
    const dates = completions[habitId] || [];
    const nextDates = dates.includes(date)
      ? dates.filter((d) => d !== date)
      : [...dates, date];
    saveToStorage(habits, { ...completions, [habitId]: nextDates });
  }

  const today = todayISO();


  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* PAGE HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Habit Tracker
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Build consistency with daily check-offs and streaks.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <Plus size={17} />
          Add Habit
        </button>
      </header>

      {/* STATS */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={Repeat}
          iconClass="bg-indigo-50 border-indigo-100 text-indigo-600"
          value={stats.totalHabits}
          label="Total Habits"
        />
        <StatCard
          icon={CalendarCheck}
          iconClass="bg-emerald-50 border-emerald-100 text-emerald-600"
          value={`${stats.doneToday}/${stats.dueToday}`}
          label="Checked Off Today"
        />
        <StatCard
          icon={Flame}
          iconClass="bg-orange-50 border-orange-100 text-orange-600"
          value={stats.activeStreaks}
          label="Active Streaks"
        />
        <StatCard
          icon={Trophy}
          iconClass="bg-amber-50 border-amber-100 text-amber-600"
          value={stats.bestStreak}
          label="Best Streak (days)"
        />
      </div>

      {/* HABIT LIST */}
      {habits.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm animate-fade-in">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm mb-5">
            <Repeat size={34} className="text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Habits Tracked Yet</h3>
          <p className="mt-1.5 text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
            Add your first recurring habit — like reading, exercising, or journaling —
            then check it off each day to grow your streak.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
            >
              <Plus size={16} />
              Create Your First Habit
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {habits.map((habit) => {
            const dates = completions[habit.id] || [];
            const currentStreak = calculateCurrentStreak(dates, habit.frequency);
            const bestStreak = calculateBestStreak(dates);
            const doneToday = dates.includes(today);

            return (
              <div
                key={habit.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 leading-snug truncate">
                        {habit.name}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          habit.frequency === "weekly"
                            ? "bg-purple-50 text-purple-600"
                            : "bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        {habit.frequency}
                      </span>
                    </div>
                    {habit.description && (
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                        {habit.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(habit)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 transition rounded-lg hover:bg-slate-100"
                      title="Edit Habit"
                      aria-label={`Edit ${habit.name}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingHabit(habit)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-slate-100"
                      title="Delete Habit"
                      aria-label={`Delete ${habit.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* TODAY CHECK-OFF */}
                {habit.frequency !== "weekly" && (
                  <button
                    type="button"
                    onClick={() => toggleCheck(habit.id, today)}
                    aria-pressed={doneToday}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      doneToday
                        ? "bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-500"
                        : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-600 focus-visible:ring-emerald-400"
                    }`}
                  >
                    <Check size={16} strokeWidth={3} />
                    {doneToday ? "Completed Today" : "Mark Today Complete"}
                  </button>
                )}

                {/* LAST 7 DAYS GRID */}
                <div className="mt-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Last 7 days
                  </p>
                  <div className="flex gap-1.5">
                    {week.map((date) => {
                      const checked = dates.includes(date);
                      const isToday = date === today;
                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => toggleCheck(habit.id, date)}
                          aria-pressed={checked}
                          aria-label={`${checked ? "Uncheck" : "Check off"} ${habit.name} on ${date}`}
                          title={date}
                          className={`flex flex-1 flex-col items-center gap-1 rounded-xl border py-2 transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                            checked
                              ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-50 text-slate-400 hover:border-indigo-300 hover:text-indigo-500"
                          } ${isToday ? "ring-2 ring-indigo-200" : ""}`}
                        >
                          <span className="text-[10px] font-bold">{dayLabel(date)}</span>
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full ${
                              checked ? "bg-emerald-500 text-white" : "bg-white border border-slate-200"
                            }`}
                          >
                            {checked && <Check size={12} strokeWidth={3.5} />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STREAK FOOTER */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span
                    className={`inline-flex items-center gap-1.5 font-bold ${
                      currentStreak > 0 ? "text-orange-600" : "text-slate-400"
                    }`}
                  >
                    <Flame size={14} />
                    {currentStreak > 0
                      ? `${currentStreak} ${habit.frequency === "weekly" ? "week" : "day"}${currentStreak === 1 ? "" : "s"} streak`
                      : "No active streak"}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Best: {bestStreak} {bestStreak === 1 ? "day" : "days"} ·{" "}
                    {dates.length} total check-offs
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showFormModal && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label={editingHabit ? "Edit Habit" : "Add Habit"}
          onClick={(e) => {
            if (e.target === e.currentTarget) resetForm();
          }}
        >
          <form
            onSubmit={handleSave}
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl animate-fade-in"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                {editingHabit ? "Edit Habit" : "Add New Habit"}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                className="p-1.5 text-slate-400 hover:text-slate-700 transition rounded-lg hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="habit-name" className="text-sm font-bold text-slate-800">
                  Habit Name *
                </label>
                <input
                  id="habit-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Read 20 minutes"
                  maxLength={80}
                  aria-invalid={!!formError}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="habit-description" className="text-sm font-bold text-slate-800">
                  Description
                </label>
                <textarea
                  id="habit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why does this habit matter? (optional)"
                  rows={3}
                  maxLength={300}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-slate-800">Frequency</span>
                <div className="flex gap-2">
                  {FREQUENCIES.map((freq) => (
                    <button
                      key={freq.value}
                      type="button"
                      onClick={() => setFrequency(freq.value)}
                      aria-pressed={frequency === freq.value}
                      className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        frequency === freq.value
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300"
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>

              {formError && (
                <p className="text-xs font-semibold text-red-500" role="alert">
                  {formError}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                {editingHabit ? "Save Changes" : "Add Habit"}
              </button>
            </div>
          </form>
        </div>
      )}



      {/* DELETE CONFIRMATION MODAL */}
      {deletingHabit && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Delete Habit"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeletingHabit(null);
          }}
        >
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-7 shadow-xl text-center animate-fade-in">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 border border-red-100 mb-4">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Delete Habit?</h2>
            <p className="mt-1.5 text-xs text-slate-500 font-medium leading-relaxed">
              "{deletingHabit.name}" and all of its check-off history will be permanently
              removed. This cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingHabit(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                Delete Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
