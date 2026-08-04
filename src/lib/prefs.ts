import { useCallback, useEffect, useState } from "react";

const FAV_KEY = "toolforge:favorites";
const RECENT_KEY = "toolforge:recent";
const THEME_KEY = "toolforge:theme";

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(key: string, value: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("toolforge:prefs"));
  } catch {
    /* storage unavailable */
  }
}

function useStoredList(key: string) {
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setList(read(key));
    sync();
    window.addEventListener("toolforge:prefs", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("toolforge:prefs", sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);

  return [list, (next: string[]) => write(key, next)] as const;
}

export function useFavorites() {
  const [favorites, save] = useStoredList(FAV_KEY);
  const toggle = useCallback(
    (slug: string) => {
      const current = read(FAV_KEY);
      save(current.includes(slug) ? current.filter((s) => s !== slug) : [slug, ...current]);
    },
    [save],
  );
  return { favorites, toggle, isFavorite: (slug: string) => favorites.includes(slug) };
}

export function useRecents() {
  const [recents] = useStoredList(RECENT_KEY);
  return recents;
}

export function pushRecent(slug: string) {
  if (typeof window === "undefined") return;
  const current = read(RECENT_KEY).filter((s) => s !== slug);
  write(RECENT_KEY, [slug, ...current].slice(0, 8));
}

export type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY) as Theme | null;
    const initial =
      stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const update = useCallback((next: Theme) => {
    setTheme(next);
    window.localStorage.setItem(THEME_KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  return { theme, setTheme: update, toggle: () => update(theme === "dark" ? "light" : "dark") };
}