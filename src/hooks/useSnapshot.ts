"use client";

import { useState, useEffect, useCallback } from "react";
import type { SnapshotData } from "@/lib/types";

const POLL_INTERVAL = 60_000;

export function useSnapshot() {
  const [data, setData] = useState<SnapshotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSnapshot = useCallback(async () => {
    try {
      const res = await fetch("/api/snapshot");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSnapshot();
    const interval = setInterval(fetchSnapshot, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchSnapshot]);

  return { data, loading, error, lastUpdated, refresh: fetchSnapshot };
}
