export interface Note {
  id: string;
  title: string;
  content: string;
  note_type: string;
  para_item_id: string | null;
  tags: string[];
  is_pinned: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface NoteGroup {
  para_item_id: string | null;
  para_item_name: string;
  para_item_type: string;
  note_count: number;
  latest_updated_at: string;
  notes: Note[];
}
