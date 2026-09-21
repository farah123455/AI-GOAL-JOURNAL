import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Roadmap from '../components/Roadmap';
import { roadmapApi, USE_MOCK_ROADMAP_API } from '../services/roadmapApi';
import { useData } from '../context/DataContext';

/**
 * AI Roadmap page (Panshobh) — opened from an accepted (Active) goal.
 * Route: /goals/:goalId/roadmap
 *
 * Data source: roadmapApi. Until Aditya's backend endpoint lands
 * (USE_MOCK_ROADMAP_API = true in services/roadmapApi.js) the local mock is
 * used and completion state is local UI state only — never presented as
 * backend persistence. Flipping the flag is the ONLY change needed to go live.
 *
 * Local state preview hooks (mock mode): append ?simulate=empty, ?simulate=error
 * or ?simulate=taskError to the URL to preview the empty / load-error / task
 * completion failure UI states without a backend.
 */

/** Stable ids for milestones & tasks + `key_action_item` → single-task fallback. */
function normalizeRoadmap(data) {
  if (!data?.milestones?.length) return data;
  return {
    ...data,
    milestones: data.milestones.map((m) => {
      const milestoneId = String(m.id ?? m.step_number);
      const tasks = (
        m.tasks?.length
          ? m.tasks
          : m.key_action_item
            ? [{ title: m.key_action_item }]
            : []
      ).map((t, i) => ({
        // Real backend: milestone action items are keyed by the milestone's
        // step_number (POST .../milestones/{step_number}/toggle). Explicit
        // task ids (mock-only) are namespaced to avoid collisions.
        id: String(t.id ?? milestoneId),
        title: t.title,
        completed: Boolean(t.completed),
      }));
      return { ...m, id: milestoneId, tasks };
    }),
  };
}

// Swayam integration callbacks — positive-reinforcement hooks. No celebration
// logic is implemented here (that is Swayam's feature); the page only emits
// clean completion events the feedback layer can subscribe to.
const noop = () => {};

export default function RoadmapPage({
  onTaskComplete = noop,
  onMilestoneComplete = noop,
  onRoadmapComplete = noop,
}) {
  const { goalId } = useParams();
  const [searchParams] = useSearchParams();
  const { goals } = useData();

  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'empty' | 'error'
  const [roadmap, setRoadmap] = useState(null);
  const [completedTaskIds, setCompletedTaskIds] = useState(() => new Set());
  const [updatingTaskIds, setUpdatingTaskIds] = useState(() => new Set());
  const [taskErrors, setTaskErrors] = useState(() => ({})); // taskId -> message
  const [fetchNonce, setFetchNonce] = useState(0); // bumped to retry a failed load

  const goal = goals.find((g) => g.id === goalId) || null;
  const simulate = searchParams.get('simulate') || undefined;

  // Track previously-completed milestones / roadmap so completion events fire
  // exactly once per transition (never on initial load).
  const prevMilestoneDoneRef = useRef(null);
  const prevRoadmapDoneRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    setStatus('loading');

    roadmapApi
      .getRoadmap(goalId, { simulate })
      .then((data) => {
        if (!isMounted) return;
        const normalized = normalizeRoadmap(data);
        setRoadmap(normalized);
        // Seed completion from the roadmap payload itself (backend persistence
        // in mock mode: sampleRoadmap.json has no `completed`, so all pending).
        const seeded = new Set(
          (normalized?.milestones || []).flatMap((m) =>
            m.tasks.filter((t) => t.completed).map((t) => t.id),
          ),
        );
        setCompletedTaskIds(seeded);
        setTaskErrors({});
        // Baseline the completion-transition trackers (no events on load).
        prevMilestoneDoneRef.current = new Set(
          (normalized?.milestones || [])
            .filter((m) => m.tasks.length > 0 && m.tasks.every((t) => seeded.has(t.id)))
            .map((m) => m.id),
        );
        prevRoadmapDoneRef.current = null;
        setStatus(normalized?.milestones?.length ? 'ready' : 'empty');
      })
      .catch(() => {
        if (isMounted) setStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, [goalId, simulate, fetchNonce]);

  /**
   * Swayam integration point: derive task → milestone → roadmap completion
   * transitions and emit the corresponding callbacks (once per transition).
   */
  useEffect(() => {
    if (status !== 'ready' || !roadmap?.milestones?.length) return;
    const milestoneDone = new Set(
      roadmap.milestones
        .filter((m) => m.tasks.length > 0 && m.tasks.every((t) => completedTaskIds.has(t.id)))
        .map((m) => m.id),
    );
    const roadmapDone =
      roadmap.milestones.length > 0 && milestoneDone.size === roadmap.milestones.length;

    const prevMilestones = prevMilestoneDoneRef.current;
    const prevRoadmap = prevRoadmapDoneRef.current;

    if (prevMilestones) {
      milestoneDone.forEach((id) => {
        if (!prevMilestones.has(id)) {
          onMilestoneComplete(roadmap.milestones.find((m) => m.id === id));
        }
      });
    }
    if (prevRoadmap === false && roadmapDone) {
      onRoadmapComplete(roadmap);
    }
    prevRoadmapDoneRef.current = roadmapDone;
    prevMilestoneDoneRef.current = milestoneDone;
  }, [completedTaskIds, roadmap, status, onMilestoneComplete, onRoadmapComplete]);

  const toggleTask = useCallback(
    (taskId, completed) => {
      // Ignore clicks while a completion request for this task is in flight —
      // prevents accidental duplicate requests.
      if (updatingTaskIds.has(taskId)) return;

      // Optimistic update; reverted below if the save fails.
      setCompletedTaskIds((prev) => {
        const next = new Set(prev);
        if (completed) next.add(taskId);
        else next.delete(taskId);
        return next;
      });
      setTaskErrors((prev) => {
        if (!prev[taskId]) return prev;
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
      setUpdatingTaskIds((prev) => new Set(prev).add(taskId));

      roadmapApi
        .setTaskCompletion(goalId, taskId, completed, { simulate })
        .then(() => {
          if (completed) onTaskComplete(taskId);
        })
        .catch((err) => {
          // Failure: revert the checkbox and surface an inline error.
          setCompletedTaskIds((prev) => {
            const next = new Set(prev);
            if (completed) next.delete(taskId);
            else next.add(taskId);
            return next;
          });
          setTaskErrors((prev) => ({
            ...prev,
            [taskId]: err?.message || 'Could not save the task completion. Please try again.',
          }));
        })
        .finally(() => {
          setUpdatingTaskIds((prev) => {
            const next = new Set(prev);
            next.delete(taskId);
            return next;
          });
        });
    },
    [goalId, simulate, updatingTaskIds, onTaskComplete],
  );

  const handleRetry = useCallback(() => setFetchNonce((n) => n + 1), []);

  return (
    <div className="app-page bg-slate-50 min-h-screen">
      <main className="mx-auto max-w-3xl px-4 py-6 md:px-6 lg:px-8">
        <Link
          to="/goals"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4B5D3C] hover:text-[#3A492E] transition mb-5"
        >
          <ArrowLeft size={14} />
          Back to Goals
        </Link>

        <Roadmap
          goalTitle={goal?.title}
          goalDescription={goal?.description}
          roadmap={roadmap}
          status={status}
          isMock={USE_MOCK_ROADMAP_API}
          completedTaskIds={completedTaskIds}
          updatingTaskIds={updatingTaskIds}
          taskErrors={taskErrors}
          onToggleTask={toggleTask}
          onRetry={handleRetry}
          /* Swayam slot: pass a render node (celebration / encouragement
             component) to render it inside the reserved feedback area. */
          celebrationSlot={null}
        />
      </main>
    </div>
  );
}
