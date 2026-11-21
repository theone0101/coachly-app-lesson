"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

export const LEVELS = [
  { name: "Rookie", at: 0 },
  { name: "Regular", at: 5 },
  { name: "Athlete", at: 12 },
  { name: "Elite", at: 22 },
  { name: "Champion", at: 35 },
  { name: "Legend", at: 50 },
] as const;

export function levelFor(count: number) {
  let index = 0;
  LEVELS.forEach((l, i) => {
    if (count >= l.at) index = i;
  });
  const current = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  const progress = next ? (count - current.at) / (next.at - current.at) : 1;
  return { index, current, next, progress, toNext: next ? next.at - count : 0 };
}

/**
 * Storage adapter. Today: this browser's localStorage.
 * To move progress to n8n or a database, replace load/save/subscribe.
 */
const KEY = "coachly.progress.v1";
const listeners = new Set<() => void>();

export const progressStore = {
  load(): number {
    try {
      const n = Number(localStorage.getItem(KEY));
      return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
    } catch {
      return 0;
    }
  },
  save(count: number) {
    try {
      localStorage.setItem(KEY, String(count));
    } catch {
      /* storage unavailable: progress lasts for this visit only */
    }
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    window.addEventListener("storage", listener);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", listener);
    };
  },
};

export function useProgress() {
  const count = useSyncExternalStore(progressStore.subscribe, progressStore.load, () => 0);
  const [leveledTo, setLeveledTo] = useState<number | null>(null);

  const increment = useCallback(() => {
    const prev = progressStore.load();
    const next = prev + 1;
    progressStore.save(next);
    if (levelFor(next).index > levelFor(prev).index) {
      setLeveledTo(levelFor(next).index);
    }
  }, []);

  return { count, leveledTo, increment, ...levelFor(count) };
}
