import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.classList.toggle("light", theme === "light");
}

const savedTheme = localStorage.getItem("theme");
const initialTheme: Theme = isTheme(savedTheme) ? savedTheme : "dark";

applyTheme(initialTheme);

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: initialTheme,

  setTheme: (theme) => {
    localStorage.setItem("theme", theme);

    applyTheme(theme);

    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme = get().theme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", nextTheme);

    applyTheme(nextTheme);

    set({
      theme: nextTheme,
    });
  },
}));
