"use client";

export const dynamic = "force-dynamic";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/analytics/KPICard";
import { OrdersHistoryTable } from "@/components/analytics/OrdersHistoryTable";
import { ANALYTICS_ORDERS } from "@/lib/mock-data";
import {
  BarChart3,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Percent,
  Calendar,
  Download,
} from "lucide-react";

export default function AnalyticsPage() {
  // حساب الإحصائيات من البيانات
  const completedOrders = ANALYTICS_ORDERS.filter(
    (o) => o.status === "مكتمل"
  );
  const totalSales = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrder = Math.round(totalSales / completedOrders.length);
  const commission = Math.round(totalSales * 0.15); // 15% عمولة

  return (
    <DashboardLayout>
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-foreground font-bold text-xl">التقارير والإحصائيات</h1>
            <p className="text-muted-foreground text-sm">
              <Calendar className="w-3.5 h-3.5 inline ml-1" />
              {new Date().toLocaleDateString("ar-SA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-border/80 bg-card/90 text-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Download className="w-4 h-4" />
          تصدير التقرير
        </button>
      </div>

      {/* كروت KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="مبيعات اليوم"
          value={`${totalSales.toLocaleString("ar-SA")} ر.س`}
          subtitle="إجمالي المبيعات"
          icon={DollarSign}
          iconColor="text-emerald-300"
          iconBg="bg-emerald-500/20"
          trend={12.5}
          trendLabel="مقارنة بالأمس"
        />

        <KPICard
          title="عدد الطلبات"
          value={String(ANALYTICS_ORDERS.length)}
          subtitle={`${completedOrders.length} مكتمل • ${ANALYTICS_ORDERS.length - completedOrders.length} ملغي`}
          icon={ShoppingBag}
          iconColor="text-blue-300"
          iconBg="bg-blue-500/20"
          trend={8.3}
          trendLabel="مقارنة بالأمس"
        />

        <KPICard
          title="متوسط الطلب"
          value={`${avgOrder.toLocaleString("ar-SA")} ر.س`}
          subtitle="متوسط قيمة الطلب الواحد"
          icon={TrendingUp}
          iconColor="text-orange-300"
          iconBg="bg-orange-500/20"
          trend={-2.1}
          trendLabel="مقارنة بالأمس"
        />

        <KPICard
          title="العمولة المستحقة"
          value={`${commission.toLocaleString("ar-SA")} ر.س`}
          subtitle="15% من إجمالي المبيعات"
          icon={Percent}
          iconColor="text-purple-300"
          iconBg="bg-purple-500/20"
          trend={12.5}
          trendLabel="مقارنة بالأمس"
        />
      </div>

      {/* توزيع طرق الدفع */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "نقداً",
            count: ANALYTICS_ORDERS.filter((o) => o.payment === "نقداً").length,
            color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
            barColor: "bg-emerald-500",
          },
          {
            label: "بطاقة",
            count: ANALYTICS_ORDERS.filter((o) => o.payment === "بطاقة").length,
            color: "bg-blue-500/20 border-blue-500/30 text-blue-400",
            barColor: "bg-blue-500",
          },
          {
            label: "أونلاين",
            count: ANALYTICS_ORDERS.filter((o) => o.payment === "أونلاين").length,
            color: "bg-purple-500/20 border-purple-500/30 text-purple-400",
            barColor: "bg-purple-500",
          },
        ].map((method) => {
          const pct = Math.round((method.count / ANALYTICS_ORDERS.length) * 100);
          return (
            <div
              key={method.label}
              className={`p-4 rounded-2xl border ${method.color} bg-opacity-50`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm">{method.label}</span>
                <span className="font-bold text-lg">{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted/70 overflow-hidden">
                <div
                  className={`h-full rounded-full ${method.barColor} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs opacity-70 mt-2">
                {method.count} {method.count === 1 ? "طلب" : "طلبات"}
              </p>
            </div>
          );
        })}
      </div>

      {/* جدول سجل الطلبات */}
      <OrdersHistoryTable />
    </DashboardLayout>
  );
}
