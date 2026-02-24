import type { Deadline } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function DeadlinesSection({ deadlines }: { deadlines: Deadline[] }) {
  if (deadlines.length === 0) return null;

  const isUrgent = (d: Deadline) => {
    const diff = Math.ceil((new Date(d.due_date).getTime() - Date.now()) / 86_400_000);
    return diff <= 3;
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
      <h2 className="text-sm font-semibold text-neutral-400 mb-3">Deadlines</h2>
      <div className="space-y-2">
        {deadlines.map((d) => (
          <div key={d.id} className={`flex items-start justify-between ${isUrgent(d) ? "border-l-2 border-red-500 pl-2" : ""}`}>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{d.title}</p>
              {d.project_title && <p className="text-xs text-neutral-500">{d.project_title}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className={`text-xs ${isUrgent(d) ? "text-red-400 font-medium" : "text-neutral-500"}`}>
                {formatDate(d.due_date)}
              </span>
              {d.priority === "high" && (
                <span className="text-[10px] px-1 py-0.5 rounded bg-red-900/50 text-red-300">high</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
