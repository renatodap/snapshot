import type { Goal } from "@/lib/types";
import { progressColor } from "@/lib/format";

export function GoalsSection({ goals }: { goals: Goal[] }) {
  if (goals.length === 0) return null;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
      <h2 className="text-sm font-semibold text-neutral-400 mb-3">Goals</h2>
      <div className="space-y-3">
        {goals.map((g) => {
          const pct = g.target_value && g.current_value
            ? Math.round((g.current_value / g.target_value) * 100)
            : 0;
          return (
            <div key={g.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{g.name}</span>
                {g.category && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">{g.category}</span>
                )}
              </div>
              {g.target_value != null && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-neutral-800 rounded-full">
                    <div className={`h-1.5 rounded-full ${progressColor(pct)}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <span className="text-xs text-neutral-500">
                    {g.current_value ?? 0} / {g.target_value}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
