"use client";

import { Inbox, Loader2, XCircle, Archive, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OrderCard } from "./OrderCard";
import type { Order, OrderStatus } from "@/lib/mock-data";

interface KanbanBoardProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus, rejectReason?: string) => void;
  selectedStatusFilter?: string;
  isOrderDelayed?: (o: Order) => boolean;
}

// الأعمدة الخاصة بمهام الكاشير داخل المطعم فقط
const columns: {
  status: OrderStatus | "delayed";
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  headerGlow: string;
  headerBorder: string;
  countBadge: string;
  columnBg: string;
  columnBorder: string;
  emptyIcon: React.ReactNode;
  emptyMsg: string;
  dot: string;
}[] = [
  {
    status: "new",
    label: "طلبات جديدة",
    sublabel: "تنتظر القبول",
    icon: <Inbox className="w-4 h-4" />,
    headerGlow: "shadow-[0_0_20px_rgba(34,197,94,0.25)]",
    headerBorder: "border-green-500/40",
    countBadge: "bg-green-500/20 text-green-300 border-green-500/40 shadow-[0_0_10px_rgba(34,197,94,0.3)]",
    columnBg: "rgba(34,197,94,0.02)",
    columnBorder: "rgba(34,197,94,0.12)",
    emptyIcon: <Inbox className="w-7 h-7 text-green-500/30" />,
    emptyMsg: "لا توجد طلبات جديدة",
    dot: "bg-green-400",
  },
  {
    status: "preparing",
    label: "قيد التحضير",
    sublabel: "في المطبخ الآن",
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    headerGlow: "shadow-[0_0_20px_rgba(59,130,246,0.25)]",
    headerBorder: "border-blue-500/40",
    countBadge: "bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]",
    columnBg: "rgba(59,130,246,0.02)",
    columnBorder: "rgba(59,130,246,0.12)",
    emptyIcon: <Loader2 className="w-7 h-7 text-blue-500/30" />,
    emptyMsg: "المطبخ فارغ حالياً",
    dot: "bg-blue-400",
  },
  {
    status: "delayed",
    label: "متأخرة ⚠️",
    sublabel: "+10 دق بدون قبول",
    icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    headerGlow: "shadow-[0_0_20px_rgba(245,158,11,0.35)]",
    headerBorder: "border-amber-500/60",
    countBadge: "bg-amber-500/25 text-amber-200 border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.4)]",
    columnBg: "rgba(245,158,11,0.03)",
    columnBorder: "rgba(245,158,11,0.20)",
    emptyIcon: <AlertTriangle className="w-7 h-7 text-amber-500/30" />,
    emptyMsg: "لا توجد طلبات متأخرة 🎉",
    dot: "bg-amber-400",
  },
  {
    status: "cancelled",
    label: "ملغي / مرفوض",
    sublabel: "رُفض أو لُغي",
    icon: <XCircle className="w-4 h-4 text-red-400" />,
    headerGlow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    headerBorder: "border-red-500/40",
    countBadge: "bg-red-500/20 text-red-300 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    columnBg: "rgba(239,68,68,0.02)",
    columnBorder: "rgba(239,68,68,0.12)",
    emptyIcon: <XCircle className="w-7 h-7 text-red-500/30" />,
    emptyMsg: "لا توجد طلبات ملغية",
    dot: "bg-red-500",
  },
  {
    status: "delivered",
    label: "أرشيف / استلام",
    sublabel: "مكتمل أو تم الاستلام",
    icon: <Archive className="w-4 h-4 text-slate-400" />,
    headerGlow: "shadow-[0_0_10px_rgba(148,163,184,0.15)]",
    headerBorder: "border-slate-600/40",
    countBadge: "bg-slate-700/50 text-slate-300 border-slate-600/40",
    columnBg: "rgba(148,163,184,0.015)",
    columnBorder: "rgba(148,163,184,0.10)",
    emptyIcon: <Archive className="w-7 h-7 text-slate-600/40" />,
    emptyMsg: "لا يوجد سجل بعد",
    dot: "bg-slate-500",
  },
];

export function KanbanBoard({
  orders,
  onStatusChange,
  selectedStatusFilter = "all",
  isOrderDelayed,
}: KanbanBoardProps) {
  // تحديد الأعمدة المرئية بناءً على الفلتر
  const getVisibleColumns = () => {
    if (selectedStatusFilter === "all") return columns;
    if (selectedStatusFilter === "delayed") return columns.filter(c => c.status === "delayed");
    return columns.filter(c => c.status === selectedStatusFilter);
  };

  const visibleColumns = getVisibleColumns();
  const isSingleColumn = visibleColumns.length === 1;

  // حساب طلبات كل عمود
  const getColumnOrders = (colStatus: OrderStatus | "delayed"): Order[] => {
    if (colStatus === "delayed") {
      return isOrderDelayed ? orders.filter(isOrderDelayed) : [];
    }
    return orders.filter(o => o.status === colStatus);
  };

  const colCount = visibleColumns.length;
  const gridClass =
    isSingleColumn
      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full"
      : colCount === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-5 w-full"
      : colCount === 3
      ? "grid grid-cols-1 md:grid-cols-3 gap-5 w-full"
      : colCount === 4
      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full"
      : "flex gap-4 min-w-[1100px] xl:min-w-0 xl:grid xl:grid-cols-5 w-full items-start";

  return (
    <div className={colCount >= 5 ? "w-full overflow-x-auto pb-4" : "w-full"}>
      <div className={gridClass}>
        {visibleColumns.map((col) => {
          const colOrders = getColumnOrders(col.status);
          const count = colOrders.length;
          const isDelayedCol = col.status === "delayed";

          return (
            <div
              key={col.status}
              className={
                colCount >= 5
                  ? "flex flex-col w-72 xl:w-full flex-shrink-0 xl:flex-shrink"
                  : "flex flex-col w-full"
              }
            >
              {/* ====== رأس العمود (يظهر فقط في عرض الأعمدة الكانبان الشامل لمنع التكرار البصري) ====== */}
              {!isSingleColumn && (
                <div
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl mb-3 border ${col.headerBorder} ${col.headerGlow} ${isDelayedCol && count > 0 ? "animate-pulse" : ""}`}
                  style={{
                    background: `linear-gradient(135deg, ${col.columnBg.replace("0.02", "0.09").replace("0.015", "0.07").replace("0.03", "0.09")} 0%, transparent 100%)`,
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex-shrink-0">
                      <span className={`w-2.5 h-2.5 rounded-full block ${col.dot}`} />
                      {count > 0 && (
                        <span className={`absolute inset-0 rounded-full animate-ping opacity-60 ${col.dot}`} />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-black text-sm leading-none">{col.label}</p>
                      <p className="text-slate-500 text-[10px] mt-0.5 leading-none">{col.sublabel}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-xl border ${col.countBadge}`}>
                    {count}
                  </span>
                </div>
              )}

              {/* ====== جسم العمود بتمرير عمودي مستقل ====== */}
              <div
                className="rounded-2xl flex flex-col gap-3 p-2.5 overflow-y-auto"
                style={{
                  background: col.columnBg,
                  border: `1px dashed ${col.columnBorder}`,
                  minHeight: "140px",
                  maxHeight: "calc(100vh - 260px)",
                }}
              >
                <AnimatePresence mode="popLayout">
                  {count === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col items-center justify-center py-10 text-center gap-2"
                    >
                      {col.emptyIcon}
                      <p className="text-slate-600 text-xs font-bold">{col.emptyMsg}</p>
                    </motion.div>
                  ) : (
                    colOrders.map((order) => (
                      <motion.div
                        key={order.id}
                        layout
                        initial={{ opacity: 0, y: 16, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.95 }}
                        transition={{ duration: 0.35, type: "spring", bounce: 0.3 }}
                      >
                        <OrderCard order={order} onStatusChange={onStatusChange} />
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* عداد أسفل العمود */}
              {count > 0 && (
                <p className="text-center text-[10px] text-slate-600 mt-2 font-bold">
                  {count} {count === 1 ? "طلب" : "طلبات"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
