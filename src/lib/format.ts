import { formatDistanceToNow, format, parseISO, isToday, isTomorrow } from "date-fns";

export function getESTDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

export function getESTTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function relativeTime(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function formatTime(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "h:mm a");
  } catch {
    return dateStr;
  }
}

export function formatDate(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    if (isToday(d)) return "Today";
    if (isTomorrow(d)) return "Tomorrow";
    return format(d, "MMM d");
  } catch {
    return dateStr;
  }
}

export function sleepHours(seconds: number | null): string {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export function durationMin(seconds: number | null): string {
  if (!seconds) return "—";
  return `${Math.round(seconds / 60)}min`;
}

export function pctString(value: number | null, goal: number | null): string {
  if (!value || !goal) return "—";
  return `${Math.round((value / goal) * 100)}%`;
}

export function progressColor(pct: number): string {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-red-500";
}

export function dayTypeBadge(dayType: string): { bg: string; text: string } {
  switch (dayType?.toLowerCase()) {
    case "rest":
    case "recovery":
      return { bg: "bg-neutral-700", text: "text-neutral-200" };
    case "light":
      return { bg: "bg-blue-900", text: "text-blue-200" };
    case "normal":
      return { bg: "bg-green-900", text: "text-green-200" };
    case "heavy":
    case "training":
      return { bg: "bg-amber-900", text: "text-amber-200" };
    case "monster":
    case "match":
      return { bg: "bg-red-900", text: "text-red-200" };
    default:
      return { bg: "bg-neutral-700", text: "text-neutral-200" };
  }
}
