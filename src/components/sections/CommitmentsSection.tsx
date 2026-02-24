import type { Commitment, Reminder } from "@/lib/types";
import { relativeTime, formatTime } from "@/lib/format";

export function CommitmentsSection({ commitments, reminders }: { commitments: Commitment[]; reminders: Reminder[] }) {
  if (commitments.length === 0 && reminders.length === 0) return null;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
      <h2 className="text-sm font-semibold text-neutral-400 mb-3">Commitments & Reminders</h2>

      {reminders.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {reminders.map((r) => (
            <div key={r.id} className="flex items-start gap-2">
              <span className="text-xs mt-0.5 text-amber-400">!</span>
              <div className="min-w-0">
                <p className="text-sm">{r.content}</p>
                <p className="text-[10px] text-neutral-500">{formatTime(r.remind_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {commitments.length > 0 && (
        <div className="space-y-1.5">
          {commitments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <span className="text-xs mt-0.5 text-blue-400">-</span>
              <div className="min-w-0">
                <p className="text-sm">{c.content}</p>
                <p className="text-[10px] text-neutral-500">{relativeTime(c.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
