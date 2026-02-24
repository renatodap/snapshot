import { openDB, type IDBPDatabase } from "idb";

interface QueuedCapture {
  id: string;
  raw_text: string | null;
  tags: string[];
  photos: { name: string; blob: Blob }[];
  captured_at: string;
}

const DB_NAME = "snapshot-offline";
const STORE_NAME = "captures";
const DB_VERSION = 1;

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

export async function enqueue(item: QueuedCapture): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, item);
}

export async function dequeueAll(): Promise<QueuedCapture[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function remove(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function queueCount(): Promise<number> {
  const db = await getDB();
  return db.count(STORE_NAME);
}
