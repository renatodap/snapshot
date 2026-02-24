import type { OpenLoop } from "@/lib/types";
import { relativeTime } from "@/lib/format";

export function OpenLoopsSection({ loops }: { loops: OpenLoop[] }) {
  if (loops.length === 0) return null;

  const statusColor: Record<string, string> = {
    pending: "bg-neutral-700",
    waiting: "bg-amber-900",
    in_progress: "bg-blue-900",
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
      <h2 className="text-sm font-semibold text-neutral-400 mb-3">
        Open Loops <span className="text-neutral-600">({loops.length})</span>
      </h2>
      <div className="space-y-2">
        {loops.slice(0, 15).map((l) => (
          <div key={l.id} className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm truncate">{l.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {l.project_name && <span className="text-[10px] text-neutral-500">{l.project_name}</span>}
                {l.waiting_on && <span className="text-[10px] text-amber-400">waiting: {l.waiting_on}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] text-neutral-600">{relativeTime(l.created_at)}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${statusColor[l.status] || "bg-neutral-700"}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
