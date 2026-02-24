import type { SnapshotData } from "@/lib/types";
import { dayTypeBadge } from "@/lib/format";

export function StatusHeader({ data, lastUpdated }: { data: SnapshotData; lastUpdated: Date | null }) {
  const nc = data.nutritionContext;
  const badge = nc ? dayTypeBadge(nc.day_type) : null;

  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-xl font-bold">Snapshot</h1>
        <p className="text-xs text-neutral-500">
          {data.timestamp}
          {lastUpdated && <> &middot; updated {lastUpdated.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</>}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {nc?.days_to_competition != null && nc.days_to_competition <= 7 && (
          <span className="text-xs px-2 py-1 rounded bg-red-900 text-red-200">
            {nc.competition_name} in {nc.days_to_competition}d
          </span>
        )}
        {badge && (
          <span className={`text-xs px-2 py-1 rounded font-medium ${badge.bg} ${badge.text}`}>
            {nc!.day_type}
          </span>
        )}
      </div>
    </div>
  );
}
