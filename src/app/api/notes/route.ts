import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import type { Note, NoteGroup } from "@/lib/notes-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const sb = createServerClient();
  const uid = process.env.SNAPSHOT_USER_ID!.trim();

  const { data: rows, error } = await sb
    .from("notes")
    .select("id, title, content, note_type, para_item_id, tags, is_pinned, metadata, created_at, updated_at, para_items(name, type)")
    .eq("user_id", uid)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const groupMap = new Map<string, NoteGroup>();

  for (const row of rows ?? []) {
    const raw = row.para_items as unknown;
    const paraItem = Array.isArray(raw) ? (raw[0] as { name: string; type: string } | undefined) ?? null : raw as { name: string; type: string } | null;
    const groupKey = row.para_item_id ?? "__ungrouped__";

    const note: Note = {
      id: row.id,
      title: row.title,
      content: row.content,
      note_type: row.note_type,
      para_item_id: row.para_item_id,
      tags: row.tags ?? [],
      is_pinned: row.is_pinned ?? false,
      metadata: row.metadata ?? {},
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, {
        para_item_id: row.para_item_id,
        para_item_name: paraItem?.name ?? "Ungrouped",
        para_item_type: paraItem?.type ?? "resource",
        note_count: 0,
        latest_updated_at: row.updated_at,
        notes: [],
      });
    }

    const group = groupMap.get(groupKey)!;
    group.notes.push(note);
    group.note_count = group.notes.length;
    if (row.updated_at > group.latest_updated_at) {
      group.latest_updated_at = row.updated_at;
    }
  }

  // Sort groups by most recent note, pinned notes first within each group
  const groups = Array.from(groupMap.values()).sort(
    (a, b) => new Date(b.latest_updated_at).getTime() - new Date(a.latest_updated_at).getTime()
  );

  for (const group of groups) {
    group.notes.sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }

  return NextResponse.json(groups);
}
