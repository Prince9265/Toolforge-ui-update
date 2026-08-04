import { useCallback, useEffect, useState } from "react";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Hydration-safe localStorage state: renders fallback on server + first paint. */
export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(read<T>(key, fallback));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private mode — non-fatal */
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>("toolforge:favorites", []);

  const toggle = useCallback(
    (slug: string) =>
      setFavorites((prev) =>
        prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
      ),
    [setFavorites],
  );

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  return { favorites, toggle, isFavorite };
}

export function useRecentlyUsed() {
  const [recent, setRecent] = useLocalStorage<string[]>("toolforge:recent", []);

  const push = useCallback(
    (slug: string) => setRecent((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 8)),
    [setRecent],
  );

  return { recent, push, clear: () => setRecent([]) };
}

export type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("toolforge:theme") as Theme | null;
    const preferred: Theme =
      stored ?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setTheme(preferred);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("toolforge:theme", theme);
  }, [theme]);

  return { theme, setTheme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/** Simulated processing state — keeps users engaged while heavy work runs. */
export function useProcessing() {
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState("Processing");

  const run = useCallback(
    async <T,>(fn: () => Promise<T> | T, opts?: { label?: string; minMs?: number }) => {
      setLabel(opts?.label ?? "Processing");
      setBusy(true);
      const min = opts?.minMs ?? 1500 + Math.random() * 1000;
      const started = Date.now();
      try {
        const result = await fn();
        const wait = Math.max(0, min - (Date.now() - started));
        if (wait) await new Promise((r) => setTimeout(r, wait));
        return result;
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  return { busy, label, run };
}
