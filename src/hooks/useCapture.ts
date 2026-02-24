"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabaseClient } from "@/lib/supabase-client";
import { compressImage } from "@/lib/compress";
import { enqueue, dequeueAll, remove, queueCount } from "@/lib/offline-queue";
import type { InboxItem, CaptureTag } from "@/lib/types";

export function useCapture() {
  const [text, setText] = useState("");
  const [tags, setTags] = useState<CaptureTag[]>([]);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [sending, setSending] = useState(false);
  const [captures, setCaptures] = useState<InboxItem[]>([]);
  const [online, setOnline] = useState(true);
  const [queued, setQueued] = useState(0);
  const listEndRef = useRef<HTMLDivElement>(null);

  const sb = getSupabaseClient();

  const loadCaptures = useCallback(async () => {
    const estDate = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (sb.from("inbox") as any)
      .select("id,raw_text,tags,source,captured_at,processed,metadata")
      .gte("captured_at", `${estDate}T00:00:00`)
      .order("captured_at", { ascending: true })
      .limit(20);
    if (data) setCaptures(data as InboxItem[]);
  }, [sb]);

  useEffect(() => {
    loadCaptures();
    setOnline(navigator.onLine);

    const goOnline = () => { setOnline(true); flushQueue(); };
    const goOffline = () => setOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    queueCount().then(setQueued).catch(() => {});
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => listEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const toggleTag = (tag: CaptureTag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const addPhotos = (files: FileList) => {
    const newPhotos = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const submit = async () => {
    if (!text.trim() && photos.length === 0) return;
    setSending(true);

    const capturedAt = new Date().toISOString();
    const id = crypto.randomUUID();

    if (!online) {
      const compressedPhotos = await Promise.all(
        photos.map(async (p) => ({ name: p.file.name, blob: await compressImage(p.file) }))
      );
      await enqueue({ id, raw_text: text.trim() || null, tags, photos: compressedPhotos, captured_at: capturedAt });
      const count = await queueCount();
      setQueued(count);
      clearForm();
      setSending(false);
      return;
    }

    try {
      const photoPaths: string[] = [];

      for (const photo of photos) {
        const compressed = await compressImage(photo.file);
        const ext = photo.file.name.split(".").pop() || "jpg";
        const path = `inbox/${id}/${Date.now()}.${ext}`;
        const { error } = await sb.storage.from("inbox-photos").upload(path, compressed, { contentType: "image/jpeg" });
        if (!error) photoPaths.push(path);
      }

      const metadata: Record<string, unknown> = {};
      if (photoPaths.length > 0) metadata.photos = photoPaths;

      const row = {
        id,
        raw_text: text.trim() || null,
        tags,
        source: "mobile",
        captured_at: capturedAt,
        metadata,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (sb.from("inbox") as any).insert(row).select().single();
      if (!error && data) {
        setCaptures((prev) => [...prev, data as InboxItem]);
        scrollToBottom();
      }
    } catch {
      // Fallback to offline queue
      const compressedPhotos = await Promise.all(
        photos.map(async (p) => ({ name: p.file.name, blob: await compressImage(p.file) }))
      );
      await enqueue({ id, raw_text: text.trim() || null, tags, photos: compressedPhotos, captured_at: capturedAt });
      const count = await queueCount();
      setQueued(count);
    }

    clearForm();
    setSending(false);
  };

  const clearForm = () => {
    setText("");
    setTags([]);
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setPhotos([]);
  };

  const flushQueue = async () => {
    const items = await dequeueAll();
    for (const item of items) {
      try {
        const photoPaths: string[] = [];
        for (const photo of item.photos) {
          const ext = photo.name.split(".").pop() || "jpg";
          const path = `inbox/${item.id}/${Date.now()}.${ext}`;
          await sb.storage.from("inbox-photos").upload(path, photo.blob, { contentType: "image/jpeg" });
          photoPaths.push(path);
        }

        const metadata: Record<string, unknown> = {};
        if (photoPaths.length > 0) metadata.photos = photoPaths;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (sb.from("inbox") as any).insert({
          id: item.id,
          raw_text: item.raw_text,
          tags: item.tags,
          source: "mobile",
          captured_at: item.captured_at,
          metadata,
        });

        await remove(item.id);
      } catch {
        break; // Stop flushing on failure
      }
    }
    const count = await queueCount();
    setQueued(count);
    loadCaptures();
  };

  const canSend = text.trim().length > 0 || photos.length > 0;

  return {
    text, setText,
    tags, toggleTag,
    photos, addPhotos, removePhoto,
    sending, submit, canSend,
    captures, online, queued,
    listEndRef,
  };
}
