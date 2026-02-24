import type { CalendarEvent } from "@/lib/types";
import { formatTime } from "@/lib/format";

export function CalendarSection({ events }: { events: CalendarEvent[] }) {
  if (events.length === 0) return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
      <h2 className="text-sm font-semibold text-neutral-400 mb-2">Calendar</h2>
      <p className="text-sm text-neutral-500">No events today</p>
    </div>
  );

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
      <h2 className="text-sm font-semibold text-neutral-400 mb-3">Calendar</h2>
      <div className="space-y-2">
        {events.map((e) => (
          <div key={e.id} className="flex items-start gap-3">
            <span className="text-xs text-neutral-500 w-16 shrink-0 pt-0.5">{formatTime(e.start_time)}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{e.title}</p>
              {e.description && <p className="text-xs text-neutral-500 truncate">{e.description}</p>}
            </div>
            {e.block_type && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 shrink-0 ml-auto">
                {e.block_type}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
