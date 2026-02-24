import type { Habit } from "@/lib/types";

export function HabitsSection({ habits }: { habits: Habit[] }) {
  if (habits.length === 0) return null;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
      <h2 className="text-sm font-semibold text-neutral-400 mb-3">Habits</h2>
      <div className="space-y-2">
        {habits.map((h) => (
          <div key={h.id} className="flex items-center justify-between">
            <span className="text-sm">{h.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">{h.frequency}</span>
              <span className={`text-xs font-medium ${h.current_streak > 0 ? "text-green-400" : "text-neutral-500"}`}>
                {h.current_streak}d streak
              </span>
              {h.best_streak > 0 && h.best_streak > h.current_streak && (
                <span className="text-[10px] text-neutral-600">best: {h.best_streak}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
