"use client";

import { ImageIcon, Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MenuItem } from "@/lib/mock-data";

interface MenuTableProps {
  items: MenuItem[];
  onToggleAvailability: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onEditItem?: (item: MenuItem) => void;
}

export function MenuTable({
  items,
  onToggleAvailability,
  onDeleteItem,
  onEditItem,
}: MenuTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-card/70 rounded-2xl border border-border/60">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm">لا توجد أصناف في هذا القسم</p>
      </div>
    );
  }

  return (
    <div className="bg-card/70 border border-border/60 rounded-2xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wide w-16 text-right">
              #
            </TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wide text-right">
              الصنف
            </TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wide hidden md:table-cell text-right">
              القسم
            </TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wide text-right">
              السعر
            </TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wide text-center">
              الحالة
            </TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wide text-center">
              إجراءات
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={item.id}
              className={`border-border/50 transition-colors hover:bg-muted/70 ${
                !item.available ? "opacity-60" : ""
              }`}
            >
              {/* الرقم */}
              <TableCell className="text-muted-foreground text-sm font-mono">
                {String(index + 1).padStart(2, "0")}
              </TableCell>

              {/* الصنف */}
              <TableCell>
                <div className="flex items-center gap-3">
                  {/* الصورة */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted/80 flex items-center justify-center flex-shrink-0">
                    {item.image && !item.image.includes("default") ? (
                      <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                        <span className="text-2xl">
                          {item.category === "برجر"
                            ? "🍔"
                            : item.category === "دجاج"
                            ? "🍗"
                            : item.category === "بيتزا"
                            ? "🍕"
                            : item.category === "مشويات"
                            ? "🥩"
                            : item.category === "سلطات"
                            ? "🥗"
                            : item.category === "مشروبات"
                            ? "🥤"
                            : item.category === "حلويات"
                            ? "🧁"
                            : "🍽️"}
                        </span>
                      </div>
                    ) : (
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-foreground text-sm font-semibold truncate">
                      {item.name}
                    </p>
                    <p className="text-muted-foreground text-xs truncate max-w-[200px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* القسم */}
              <TableCell className="hidden md:table-cell">
                <Badge className="bg-muted/80 text-foreground border-border/70 text-xs rounded-lg">
                  {item.category}
                </Badge>
              </TableCell>

              {/* السعر */}
              <TableCell>
                <span className="text-orange-500 font-bold text-sm whitespace-nowrap">
                  {item.price.toLocaleString("ar-SA")} ر.س
                </span>
              </TableCell>

              {/* التبديل */}
              <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <Switch
                    checked={item.available}
                    onCheckedChange={() => onToggleAvailability(item.id)}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                  <span
                    className={`text-[10px] font-medium ${
                      item.available ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {item.available ? "متوفر" : "نفذت الكمية"}
                  </span>
                </div>
              </TableCell>

              {/* الإجراءات */}
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => onEditItem && onEditItem(item)}
                    className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 hover:text-blue-600 flex items-center justify-center transition-colors"
                    title="تعديل الصنف"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600 flex items-center justify-center transition-colors"
                    title="حذف الصنف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
