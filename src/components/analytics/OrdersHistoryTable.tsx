"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ANALYTICS_ORDERS } from "@/lib/mock-data";

export function OrdersHistoryTable() {
  return (
    <div className="data-table-shell">
      <div className="px-5 py-4 border-b border-border/70 flex items-center justify-between bg-muted/40">
        <div>
          <h3 className="text-white font-bold text-base">سجل الطلبات</h3>
          <p className="text-muted-foreground text-xs mt-0.5">
            آخر {ANALYTICS_ORDERS.length} طلبات اليوم
          </p>
        </div>
        <button className="text-orange-600 dark:text-orange-400 text-xs font-medium hover:text-orange-700 dark:hover:text-orange-300 transition-colors px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/20">
          تصدير CSV
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-border/70 hover:bg-transparent">
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide text-right">
              رقم الطلب
            </TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide text-right">
              العميل
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide text-center hidden sm:table-cell">
              الأصناف
            </TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide text-right">
              الإجمالي
            </TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide text-right hidden md:table-cell">
              الدفع
            </TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide text-center hidden md:table-cell">
              الوقت
            </TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide text-center">
              الحالة
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {ANALYTICS_ORDERS.map((order) => (
            <TableRow
              key={order.id}
              className="border-border/70 hover:bg-muted/70 transition-colors"
            >
              <TableCell>
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">
                  #{order.id}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {order.customer.charAt(0)}
                  </div>
                  <span className="text-foreground text-sm font-medium">
                    {order.customer}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-center hidden sm:table-cell">
                <span className="text-muted-foreground text-sm">{order.items} صنف</span>
              </TableCell>

              <TableCell>
                <span className="text-foreground font-bold text-sm">
                  {order.total.toLocaleString("ar-SA")}
                  <span className="text-muted-foreground font-normal text-xs mr-1">
                    ر.س
                  </span>
                </span>
              </TableCell>

              <TableCell className="hidden md:table-cell">
                <span className="text-muted-foreground text-sm">{order.payment}</span>
              </TableCell>

              <TableCell className="text-center hidden md:table-cell">
                <span className="text-muted-foreground text-sm font-mono">
                  {order.time}
                </span>
              </TableCell>

              <TableCell className="text-center">
                <Badge
                  className={`text-xs font-semibold rounded-lg border px-2 py-0.5 ${
                    order.status === "مكتمل"
                      ? "status-badge-success"
                      : "status-badge-danger"
                  }`}
                >
                  {order.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
