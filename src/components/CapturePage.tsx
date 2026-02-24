"use client";

import { useRef } from "react";
import { useCapture } from "@/hooks/useCapture";
import { relativeTime } from "@/lib/format";
import type { CaptureTag } from "@/lib/types";

const TAG_OPTIONS: { value: CaptureTag; label: string }[] = [
  { value: "meal", label: "Meal" },
  { value: "idea", label: "Idea" },
  { value: "health", label: "Health" },
  { value: "workout", label: "Workout" },
  { value: "weight", label: "Weight" },
];

export function CapturePage() {
  const {
    text, setText,
    tags, toggleTag,
    photos, addPhotos, removePhoto,
    sending, submit, canSend,
    captures, online, queued,
    listEndRef,
  } = useCapture();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && canSend) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] max-w-lg mx-auto">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
        <h1 className="text-sm font-semibold">Capture</h1>
        <div className="flex items-center gap-2">
          {queued > 0 && (
            <span className="text-[10px] text-amber-400">{queued} queued</span>
          )}
          <span className={`w-2 h-2 rounded-full ${online ? "bg-green-500" : "bg-amber-500 animate-pulse-dot"}`} />
        </div>
      </div>

      {/* Captures list */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 space-y-3">
        {captures.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-neutral-600 text-sm">No captures today. Start typing below.</p>
          </div>
        )}
        {captures.map((c) => (
          <div key={c.id} className={`relative bg-neutral-900 border border-neutral-800 rounded-lg p-3 ${c.processed ? "opacity-60" : ""}`}>
            {c.processed && (
              <span className="absolute top-2 right-2 text-green-500 text-xs">done</span>
            )}
            {c.raw_text && <p className="text-sm mb-1">{c.raw_text}</p>}
            {(() => {
              const photos = c.metadata?.photos;
              if (!photos || !Array.isArray(photos)) return null;
              return (
                <div className="flex gap-1.5 mb-1.5">
                  {(photos as string[]).map((path, i) => (
                    <div key={i} className="w-14 h-14 rounded bg-neutral-800 overflow-hidden">
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              );
            })()}
            <div className="flex items-center gap-2">
              {c.tags.length > 0 && c.tags.map((t) => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">{t}</span>
              ))}
              <span className="text-[10px] text-neutral-600 ml-auto">{relativeTime(c.captured_at)}</span>
            </div>
          </div>
        ))}
        <div ref={listEndRef} />
      </div>

      {/* Photo previews */}
      {photos.length > 0 && (
        <div className="flex gap-2 px-4 py-2 border-t border-neutral-800 overflow-x-auto no-scrollbar">
          {photos.map((p, i) => (
            <div key={i} className="relative w-[60px] h-[60px] shrink-0 rounded overflow-hidden bg-neutral-800">
              <img src={p.preview} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-0 right-0 w-5 h-5 bg-black/70 text-white text-xs flex items-center justify-center rounded-bl"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tag pills */}
      <div className="flex gap-2 px-4 py-2 border-t border-neutral-800 overflow-x-auto no-scrollbar">
        {TAG_OPTIONS.map((t) => (
          <button
            key={t.value}
            onClick={() => toggleTag(t.value)}
            className={`text-xs px-3 py-1.5 rounded-full shrink-0 transition-colors ${
              tags.includes(t.value)
                ? "bg-blue-600 text-white"
                : "bg-neutral-800 text-neutral-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex items-end gap-2 px-4 py-3 border-t border-neutral-800 bg-neutral-950">
        {/* Camera button — opens native camera */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-300"
          title="Take photo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
        </button>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => { if (e.target.files) addPhotos(e.target.files); e.target.value = ""; }}
        />
        {/* Gallery button — opens file picker / photo library */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-300"
          title="Choose from gallery"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files) addPhotos(e.target.files); e.target.value = ""; }}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Capture anything..."
          rows={1}
          className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 resize-none focus:outline-none focus:border-neutral-600"
          autoFocus
        />
        <button
          onClick={submit}
          disabled={!canSend || sending}
          className={`w-11 h-11 shrink-0 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
            canSend && !sending
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-neutral-600"
          }`}
        >
          {sending ? "..." : "Go"}
        </button>
      </div>
    </div>
  );
}
