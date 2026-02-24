import type { JournalEntry } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function JournalSection({ entries }: { entries: JournalEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
      <h2 className="text-sm font-semibold text-neutral-400 mb-3">Journal</h2>
      <div className="space-y-3">
        {entries.map((e, i) => (
          <div key={i} className="border-l-2 border-neutral-800 pl-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-neutral-500">{formatDate(e.entry_date)}</span>
              {e.category && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">{e.category}</span>
              )}
            </div>
            <p className="text-sm text-neutral-300 line-clamp-3">{e.content}</p>
            {e.tags && e.tags.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {e.tags.map((t) => (
                  <span key={t} className="text-[10px] text-neutral-500">#{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
