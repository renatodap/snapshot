"use client";

import { useNotes } from "@/hooks/useNotes";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { relativeTime } from "@/lib/format";
import type { NoteGroup, Note } from "@/lib/notes-types";

const typeBadge: Record<string, { bg: string; text: string }> = {
  area: { bg: "bg-blue-900/60", text: "text-blue-300" },
  project: { bg: "bg-green-900/60", text: "text-green-300" },
  class: { bg: "bg-purple-900/60", text: "text-purple-300" },
  resource: { bg: "bg-amber-900/60", text: "text-amber-300" },
};

function TypeBadge({ type }: { type: string }) {
  const style = typeBadge[type] ?? typeBadge.resource;
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}>
      {type}
    </span>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-neutral-400 active:text-neutral-200 mb-4 min-h-[44px]"
    >
      <span className="text-lg leading-none">&larr;</span>
      <span>{label}</span>
    </button>
  );
}

function GroupsView({ groups, onSelect }: { groups: NoteGroup[]; onSelect: (id: string | null) => void }) {
  if (groups.length === 0) {
    return <p className="text-sm text-neutral-500 text-center mt-8">No notes yet.</p>;
  }

  return (
    <div className="space-y-2">
      {groups.map((g) => (
        <button
          key={g.para_item_id ?? "__ungrouped__"}
          onClick={() => onSelect(g.para_item_id)}
          className="w-full text-left bg-neutral-900 border border-neutral-800 rounded-lg p-4 active:bg-neutral-800 transition-colors min-h-[44px]"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-neutral-100 truncate mr-2">{g.para_item_name}</span>
            <TypeBadge type={g.para_item_type} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              {g.note_count} note{g.note_count !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-neutral-500">{relativeTime(g.latest_updated_at)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function ListView({ group, onSelect, onBack }: { group: NoteGroup; onSelect: (id: string) => void; onBack: () => void }) {
  return (
    <>
      <BackButton onClick={onBack} label="All Notes" />
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-base font-semibold text-neutral-100">{group.para_item_name}</h2>
        <TypeBadge type={group.para_item_type} />
      </div>
      <div className="space-y-2">
        {group.notes.map((n) => (
          <NoteCard key={n.id} note={n} onSelect={onSelect} />
        ))}
      </div>
    </>
  );
}

function NoteCard({ note, onSelect }: { note: Note; onSelect: (id: string) => void }) {
  const preview = note.content
    .replace(/^#+\s+/gm, "")
    .replace(/[*_~`\[\]()>|-]/g, "")
    .replace(/\n+/g, " ")
    .trim()
    .slice(0, 80);

  return (
    <button
      onClick={() => onSelect(note.id)}
      className="w-full text-left bg-neutral-900 border border-neutral-800 rounded-lg p-4 active:bg-neutral-800 transition-colors min-h-[44px]"
    >
      <div className="flex items-center gap-2 mb-1">
        {note.is_pinned && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300">pinned</span>}
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">{note.note_type}</span>
      </div>
      <p className="text-sm font-medium text-neutral-100 truncate">{note.title}</p>
      {preview && <p className="text-xs text-neutral-500 mt-0.5 truncate">{preview}</p>}
      <p className="text-xs text-neutral-600 mt-1">{relativeTime(note.updated_at)}</p>
    </button>
  );
}

function DetailView({ note, onBack }: { note: Note; onBack: () => void }) {
  return (
    <>
      <BackButton onClick={onBack} label="Back" />
      <div className="flex items-center gap-2 mb-1">
        {note.is_pinned && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300">pinned</span>}
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">{note.note_type}</span>
      </div>
      <h1 className="text-lg font-bold text-neutral-100 mb-4">{note.title}</h1>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <MarkdownRenderer content={note.content} />
      </div>
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {note.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-neutral-600 mt-3">Updated {relativeTime(note.updated_at)}</p>
    </>
  );
}

export function NotesPage() {
  const { groups, loading, error, view, selectedGroup, selectedNote, selectGroup, selectNote, goBack } = useNotes();

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-neutral-500 text-sm">Loading notes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-red-400 text-sm">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-4">
      {view === "groups" && (
        <>
          <h1 className="text-sm font-semibold text-neutral-400 mb-3">Notes</h1>
          <GroupsView groups={groups} onSelect={selectGroup} />
        </>
      )}
      {view === "list" && selectedGroup && (
        <ListView group={selectedGroup} onSelect={selectNote} onBack={goBack} />
      )}
      {view === "detail" && selectedNote && (
        <DetailView note={selectedNote} onBack={goBack} />
      )}
    </div>
  );
}
