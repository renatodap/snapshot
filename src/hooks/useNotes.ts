"use client";

import { useState, useEffect, useCallback } from "react";
import type { NoteGroup, Note } from "@/lib/notes-types";

type View = "groups" | "list" | "detail";

export function useNotes() {
  const [groups, setGroups] = useState<NoteGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<View>("groups");
  const [selectedGroup, setSelectedGroup] = useState<NoteGroup | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setGroups(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const selectGroup = useCallback((paraItemId: string | null) => {
    const group = groups.find((g) => g.para_item_id === paraItemId) ?? null;
    setSelectedGroup(group);
    setSelectedNote(null);
    setView("list");
  }, [groups]);

  const selectNote = useCallback((noteId: string) => {
    if (!selectedGroup) return;
    const note = selectedGroup.notes.find((n) => n.id === noteId) ?? null;
    setSelectedNote(note);
    setView("detail");
  }, [selectedGroup]);

  const goBack = useCallback(() => {
    if (view === "detail") {
      setSelectedNote(null);
      setView("list");
    } else if (view === "list") {
      setSelectedGroup(null);
      setView("groups");
    }
  }, [view]);

  const toggleCheckbox = useCallback(async (checkboxIndex: number) => {
    if (!selectedNote) return;

    // Find the nth checkbox in the markdown and toggle it
    let count = 0;
    const newContent = selectedNote.content.replace(
      /- \[([ xX])\]/g,
      (match, check) => {
        if (count++ === checkboxIndex) {
          return check === " " ? "- [x]" : "- [ ]";
        }
        return match;
      }
    );

    if (newContent === selectedNote.content) return;

    // Optimistic update
    const updatedNote = { ...selectedNote, content: newContent, updated_at: new Date().toISOString() };
    setSelectedNote(updatedNote);

    // Update in groups state too
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        notes: g.notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)),
      }))
    );
    if (selectedGroup) {
      setSelectedGroup((prev) =>
        prev ? { ...prev, notes: prev.notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)) } : prev
      );
    }

    // Persist to DB
    try {
      const res = await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedNote.id, content: newContent }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      // Revert on failure
      setSelectedNote(selectedNote);
      setGroups((prev) =>
        prev.map((g) => ({
          ...g,
          notes: g.notes.map((n) => (n.id === selectedNote.id ? selectedNote : n)),
        }))
      );
    }
  }, [selectedNote, selectedGroup]);

  return {
    groups,
    loading,
    error,
    view,
    selectedGroup,
    selectedNote,
    selectGroup,
    selectNote,
    goBack,
    toggleCheckbox,
    refresh: fetchNotes,
  };
}
