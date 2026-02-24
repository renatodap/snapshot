import type { Activity, WorkoutPlan } from "@/lib/types";
import { durationMin } from "@/lib/format";

export function WorkoutSection({ activities, plans }: { activities: Activity[]; plans: WorkoutPlan[] }) {
  if (activities.length === 0 && plans.length === 0) return null;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
      <h2 className="text-sm font-semibold text-neutral-400 mb-3">Workouts</h2>

      {activities.length > 0 && (
        <div className="space-y-2 mb-3">
          {activities.map((a) => (
            <div key={a.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{a.activity_name || a.activity_type}</p>
                <p className="text-xs text-neutral-500">
                  {durationMin(a.duration_seconds)}
                  {a.active_calories != null && <> &middot; {a.active_calories} cal</>}
                  {a.avg_heart_rate != null && <> &middot; {a.avg_heart_rate} bpm</>}
                </p>
              </div>
              {a.category && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">{a.category}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {plans.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-neutral-500">Planned</p>
          {plans.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span>{p.workout_templates?.name || "Workout"}</span>
              <span className="text-xs text-neutral-500">{p.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
