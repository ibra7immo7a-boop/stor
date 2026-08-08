"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-2xl bg-slate-800/40 border border-slate-700/50" />
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 bg-background/80 border border-border/70 hover:border-orange-500/50 text-foreground shadow-sm hover:scale-105 active:scale-95 group overflow-hidden backdrop-blur"
      title={isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"}
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun
          className={`w-5 h-5 absolute transition-all duration-500 transform ${
            isDark
              ? "rotate-0 scale-100 opacity-100 text-amber-400"
              : "-rotate-90 scale-0 opacity-0 text-amber-500"
          }`}
        />
        <Moon
          className={`w-5 h-5 absolute transition-all duration-500 transform ${
            isDark
              ? "rotate-90 scale-0 opacity-0 text-muted-foreground"
              : "rotate-0 scale-100 opacity-100 text-indigo-500"
          }`}
        />
      </div>
      <span className="sr-only">تبديل الثيم</span>
    </button>
  );
}
