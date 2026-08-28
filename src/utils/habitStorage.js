/**
 * Habit Tracker — Frontend/localStorage persistence layer.
 *
 * NOTE: Intentionally client-side only for the current phase (per roadmap:
 * Habit Tracker → Daily Streak System). No backend/PostgreSQL changes.
 * Data is stored per Firebase user id so different accounts don't clash.
 *
 * Data shape:
 *   habits: Array<{
 *     id: string,
 *     name: string,
 *     description: string | null,
 *     frequency: 'daily' | 'weekly',
 *     created_at: string (ISO),
 *   }>
 *   completions: Record<habitId, string[]> — array of 'YYYY-MM-DD' dates checked off.
 */

const STORAGE_PREFIX = 'ai-goal-journal:habits';

function storageKey(userId) {
  return `${STORAGE_PREFIX}:${userId || 'anonymous'}`;
}

/* ---------- Date helpers (local-time based, no TZ surprises) ---------- */

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayISO() {
  return toISODate(new Date());
}

/** Parse 'YYYY-MM-DD' into a local Date at midnight. */
export function fromISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Add n days to a 'YYYY-MM-DD' string. */
export function addDaysISO(iso, n) {
  const date = fromISODate(iso);
  date.setDate(date.getDate() + n);
  return toISODate(date);
}

/** Full day name for an ISO date, e.g. 'Mon'. */
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export function dayLabel(iso) {
  return DAY_LABELS[fromISODate(iso).getDay()];
}

/** Most recent `count` ISO dates ending today (chronological). */
export function lastNDays(count = 7) {
  const days = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    days.push(addDaysISO(todayISO(), -i));
  }
  return days;
}

/* -------------------------- Persistence -------------------------- */

function safeParse(raw, fallback) {
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function loadHabits(userId) {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  const data = safeParse(window.localStorage.getItem(storageKey(userId)), { habits: [], completions: {} });
  return Array.isArray(data.habits) ? data.habits : [];
}

export function loadCompletions(userId) {
  if (typeof window === 'undefined' || !window.localStorage) return {};
  const data = safeParse(window.localStorage.getItem(storageKey(userId)), { habits: [], completions: {} });
  return data.completions && typeof data.completions === 'object' ? data.completions : {};
}

export function persist(userId, habits, completions) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify({ habits, completions }));
  } catch (err) {
    console.error('habitStorage persist error:', err);
  }
}

export function makeHabit({ name, description = null, frequency = 'daily' }) {
  return {
    id: `habit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    description: description?.trim() || null,
    frequency,
    created_at: new Date().toISOString(),
  };
}

/* ----------------------- Streak calculation ----------------------- */

/**
 * Current streak = consecutive checked-off days counting backwards from
 * today. If today is not yet checked, the streak counts from yesterday
 * (today is still "in progress" and shouldn't break the streak).
 * For weekly habits, streak = consecutive weeks with at least one completion.
 */
export function calculateCurrentStreak(completedDates, frequency = 'daily') {
  if (!completedDates || completedDates.length === 0) return 0;
  const set = new Set(completedDates);
  const today = todayISO();

  if (frequency === 'weekly') {
    // Map each completion to the ISO date of the Monday of its week.
    const toWeekStart = (iso) => {
      const d = fromISODate(iso);
      const offset = (d.getDay() + 6) % 7; // Monday = 0
      return addDaysISO(iso, -offset);
    };
    const weeks = new Set([...set].map(toWeekStart));
    const todayWeek = toWeekStart(today);
    let cursor = weeks.has(todayWeek) ? todayWeek : addDaysISO(todayWeek, -7);
    let streak = 0;
    while (weeks.has(cursor)) {
      streak += 1;
      cursor = addDaysISO(cursor, -7);
    }
    return streak;
  }

  // Daily: start anchor — today if checked, otherwise yesterday.
  let cursor = set.has(today) ? today : addDaysISO(today, -1);
  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = addDaysISO(cursor, -1);
  }
  return streak;
}

/** Longest run of consecutive daily completions ever recorded. */
export function calculateBestStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) return 0;
  const sorted = [...new Set(completedDates)].sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    run = addDaysISO(sorted[i - 1], 1) === sorted[i] ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
}

/** Convenience aggregate for the stats header. */
export function habitStats(habits, completions) {
  const today = todayISO();
  const dueToday = habits.filter((h) => h.frequency !== 'weekly');
  const doneToday = dueToday.filter((h) => (completions[h.id] || []).includes(today)).length;

  let activeStreaks = 0;
  let bestStreak = 0;
  let totalCheckoffs = 0;

  habits.forEach((habit) => {
    const dates = completions[habit.id] || [];
    totalCheckoffs += dates.length;
    bestStreak = Math.max(bestStreak, calculateBestStreak(dates));
    if (calculateCurrentStreak(dates, habit.frequency) > 0) activeStreaks += 1;
  });

  return {
    totalHabits: habits.length,
    dueToday: dueToday.length,
    doneToday,
    activeStreaks,
    bestStreak,
    totalCheckoffs,
  };
}