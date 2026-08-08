"use client";

import { MENU_CATEGORIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
  counts: Record<string, number>;
}

export function CategoryFilter({
  selected,
  onSelect,
  counts,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {MENU_CATEGORIES.map((category) => {
        const count = category === "الكل"
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : (counts[category] ?? 0);
        const isActive = selected === category;

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap",
              "border transition-all duration-200 flex-shrink-0",
              isActive
                ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "bg-card/70 border-border/70 text-muted-foreground hover:border-orange-500/30 hover:text-foreground hover:bg-muted/80"
            )}
          >
            {category}
            {count > 0 && (
              <span
                className={cn(
                  "text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
