import {
  Target,
  Plus,
  X,
  CheckCircle2,
  Trash2,
  Pencil,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useData } from "../context/DataContext";
import { goalApi } from "../services/api";
import CircularProgress from "../components/CircularProgress";
import GoalCompletionCelebration from "../components/GoalCompletionCelebration";
import { GridSkeleton, GoalLoadingState } from "../components/LoadingSkeleton";

export default function Goals() {
  const {
    goals,
    loading,
    addGoal,
    updateGoalInCache,
    deleteGoalFromCache,
  } = useData();

  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  // In-memory only: set solely when a user actively completes a goal (Active -> Completed).
  // Never persisted, so it never replays on page load/refresh or when completed
  // goals are fetched from the backend.
  const [celebratingGoal, setCelebratingGoal] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Active");
  const [targetDate, setTargetDate] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const [progressNote, setProgressNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const filteredGoals = statusFilter
    ? goals.filter((g) => g.status?.toLowerCase() === statusFilter.toLowerCase())
    : goals;

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("");
    setStatus("Active");
    setTargetDate("");
    setProgressValue(0);
    setProgressNote("");
    setEditingGoal(null);
    setFormError("");
    setShowCreateModal(false);
  }

  function openEdit(goal) {
    setEditingGoal(goal);
    setTitle(goal.title || "");
    setDescription(goal.description || "");
    setCategory(goal.category || "");
    setStatus(goal.status || "Active");
    setTargetDate(goal.target_date || "");
    setProgressValue(goal.progress_value || 0);
    setProgressNote(goal.latest_progress_note || "");
    setFormError("");
    setShowCreateModal(true);
  }

  async function handleSaveGoal(e) {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Goal title is required");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      if (editingGoal) {
        const payload = {
          title: title.trim(),
          description: description.trim() || null,
          category: category.trim() || null,
          status,
          target_date: targetDate || null,
          progress_value: Number(progressValue),
          latest_progress_note: progressNote.trim() || null,
        };
        const updated = await goalApi.updateGoal(editingGoal.id, payload);
        updateGoalInCache(updated);
        if (editingGoal.status !== "Completed" && status === "Completed") {
          setCelebratingGoal(updated);
        }
      } else {
        const payload = {
          title: title.trim(),
          description: description.trim() || null,
          category: category.trim() || null,
          status,
          target_date: targetDate || null,
          progress_value: Number(progressValue),
        };
        const created = await goalApi.createGoal(payload);
        addGoal(created);
      }
      resetForm();
    } catch (err) {
      setFormError(err.message || "Failed to save goal.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(goalId) {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    try {
      await goalApi.deleteGoal(goalId);
      deleteGoalFromCache(goalId);
    } catch (err) {
      alert("Failed to delete goal: " + err.message);
    }
  }

  async function handleQuickStatusChange(goalId, newStatus) {
    try {
      const updated = await goalApi.updateGoal(goalId, { status: newStatus });
      updateGoalInCache(updated);
      if (goals.find((g) => g.id === goalId)?.status !== "Completed" && newStatus === "Completed") {
        setCelebratingGoal(updated);
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  }

  return (
    <div className="app-page bg-slate-50 min-h-screen">
      <main className="mx-auto max-w-[1250px] px-5 py-7 md:px-8 lg:px-10">
        {/* Status Filter & Action Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {["", "Active", "Completed", "Stalled"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  statusFilter === st
                    ? "bg-indigo-600 text-white shadow-sm font-bold"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {st === "" ? "All Goals" : st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3.5">
            <span className="text-xs text-slate-500 font-mono font-medium">
              Showing {filteredGoals.length} {filteredGoals.length === 1 ? "goal" : "goals"}
            </span>

            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="primary-button text-sm"
            >
              <Plus size={16} />
              Create Goal
            </button>
          </div>
        </div>

        {/* Create / Edit Modal Form */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="panel w-full max-w-xl p-6 shadow-xl border border-slate-200 bg-white max-h-[90vh] overflow-y-auto rounded-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Target size={18} className="text-indigo-600" />
                  {editingGoal ? "Edit Goal" : "Create New Goal"}
                </h3>
                <button onClick={resetForm} className="text-slate-400 hover:text-slate-700">
                  <X size={18} />
                </button>
              </div>

              {formError && (
                <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200 font-medium">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSaveGoal} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master FastAPI Backend Architecture"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="Career, Academics"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="input-field p-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="input-field p-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900"
                    >
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Stalled">Stalled</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="input-field p-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Progress (%): {progressValue}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progressValue}
                      onChange={(e) => setProgressValue(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Latest Progress Note
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Finished modules 1 & 2"
                      value={progressNote}
                      onChange={(e) => setProgressNote(e.target.value)}
                      className="input-field p-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Description & Success Criteria
                  </label>
                  <textarea
                    rows={3}
                    placeholder="What does completing this goal look like?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="primary-button text-xs">
                    {saving ? "Saving…" : editingGoal ? "Update Goal" : "Create Goal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Goals Grid */}
        {loading ? (
          <GoalLoadingState />
        ) : filteredGoals.length === 0 ? (
          <section className="panel px-6 py-16 text-center shadow-sm">
            <Target size={36} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No goals found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto font-medium">
              {statusFilter
                ? `You have no goals with '${statusFilter}' status.`
                : "Start your accountability journey by creating your first goal milestone."}
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="primary-button mt-4 text-xs"
            >
              <Plus size={14} /> Create a Goal
            </button>
          </section>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 animate-fade-in">
            {filteredGoals.map((goal) => {
              const prog = goal.status === "Completed" ? 100 : (goal.progress_value || 0);

              return (
                <div
                  key={goal.id}
                  className={`panel p-6 shadow-sm flex flex-col justify-between border-slate-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 ${goal.status === "Completed" ? "ring-1 ring-emerald-100 bg-emerald-50/30 shadow-emerald-500/30 hover:translate-y-0" : ""}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            goal.status === "Completed"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : goal.status === "Stalled"
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : "bg-indigo-50 text-indigo-600 border border-indigo-200"
                          }`}
                        >
                          {goal.status === "Active" ? "On Track" : goal.status}
                        </span>

                        {goal.category && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
                            {goal.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(goal)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 transition rounded-lg hover:bg-slate-100"
                          title="Edit Goal"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-slate-100"
                          title="Delete Goal"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <CircularProgress
                          value={prog}
                          className="w-16 h-16"
                          trackClass="stroke-slate-200"
                          fillClass={goal.status === "Completed" ? "stroke-emerald-500" : "stroke-indigo-600"}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-base font-bold text-slate-900 leading-snug flex items-center gap-2">
                          {goal.title}{goal.status === "Completed" && (<CheckCircle2 size={15} className="text-emerald-500" />)}
                        </h3>

                        {goal.description && (
                          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                            {goal.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {goal.latest_progress_note && (
                      <div className="mt-3.5 rounded-xl bg-slate-50 p-2.5 border border-slate-200 text-[11px] text-slate-700 italic font-medium">
                        Latest: {goal.latest_progress_note}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="text-[11px] font-medium">
                      {goal.target_date
                        ? `Target: ${new Date(goal.target_date).toLocaleDateString()}`
                        : `Created: ${new Date(goal.created_at || goal.createdAt).toLocaleDateString()}`}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium">Status:</span>
                      <select
                        value={goal.status}
                        onChange={(e) => handleQuickStatusChange(goal.id, e.target.value)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-800 focus:outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Stalled">Stalled</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {celebratingGoal && (
        <GoalCompletionCelebration
          goal={celebratingGoal}
          onClose={() => setCelebratingGoal(null)}
        />
      )}
    </div>
  );
}