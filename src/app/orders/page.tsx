"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OrderTabs } from "@/components/orders/OrderTabs";
import { KanbanBoard } from "@/components/orders/KanbanBoard";
import { useAudioAlert } from "@/hooks/useAudioAlert";
import { MOCK_ORDERS } from "@/lib/mock-data";
import type { Order, OrderStatus } from "@/lib/mock-data";
import { toast, Toaster } from "sonner";
import {
  ClipboardList,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Plus,
  LayoutGrid,
  Rows3,
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [isLive, setIsLive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [viewMode, setViewMode] = useState<"tabs" | "kanban">("tabs");
  const { playAlert } = useAudioAlert();

  const newOrdersCount = orders.filter((o) => o.status === "new").length;

  // محاكاة استلام طلب جديد
  const simulateNewOrder = useCallback(() => {
    const randomOrderNum = `ORD-${Math.floor(Math.random() * 9000) + 1000}`;
    const customers = [
      "عمرو عبدالفتاح",
      "منى السعيد",
      "أحمد عبدالرحمن",
      "مريم فاروق",
      "كريم الهواري",
    ];
    const customerName = customers[Math.floor(Math.random() * customers.length)];
    const totalAmount = Math.floor(Math.random() * 600) + 150;

    const newOrder: Order = {
      id: String(Date.now()),
      orderNumber: randomOrderNum,
      status: "new",
      type: Math.random() > 0.5 ? "delivery" : "pickup",
      createdAt: new Date(),
      customer: {
        name: customerName,
        phone: `010${Math.floor(Math.random() * 90000000 + 10000000)}`,
        address: Math.random() > 0.5 ? "القاهرة الجديدة، النرجس 3، عمارة 14" : undefined,
      },
      items: [
        {
          id: String(Date.now()),
          name: "برجر كايرو الخاص",
          quantity: Math.floor(Math.random() * 2) + 1,
          price: 185,
          extras: Math.random() > 0.5 ? ["جبنة موزاريلا زيادة", "صوص ثوم"] : ["بدون بصل"],
        },
        {
          id: String(Date.now() + 1),
          name: "عصير مانجو طازج",
          quantity: 2,
          price: 75,
        },
      ],
      total: totalAmount,
      paymentMethod: (["cash", "card", "online"] as const)[
        Math.floor(Math.random() * 3)
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    if (soundEnabled) {
      playAlert();
    }

    // إشعار Toast للطلب الجديد بلون يتناسب مع التصميم الأخضر
    toast.success(`طلب جديد وصل الآن #${randomOrderNum} 🔔`, {
      description: `العميل: ${customerName} • الإجمالي: ${totalAmount.toLocaleString("ar-EG")} ج.م`,
      duration: 6000,
      style: { background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#34d399" }
    });
  }, [soundEnabled, playAlert]);

  // محاكاة تلقائية كل 30 ثانية عند تفعيل البث الحي
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(simulateNewOrder, 30000);
    return () => clearInterval(interval);
  }, [isLive, simulateNewOrder]);

  // حساب الطلبات التأخرت (لم يتم تأكيدها خلال 10 دقائق من تاريخ الإنشئ)
  const isOrderDelayed = useCallback((o: Order) => {
    if (o.status !== "new") return false;
    const diffInMins = (Date.now() - new Date(o.createdAt).getTime()) / (1000 * 60);
    return diffInMins >= 10;
  }, []);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus, _rejectReason?: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };


  return (
    <DashboardLayout newOrdersCount={newOrdersCount}>
      {/* Toast Provider */}
      <Toaster
        position="top-center"
        richColors
        theme="dark"
        closeButton
        expand
        visibleToasts={4}
        offset="18px"
        gap={12}
        toastOptions={{
          duration: 5000,
          classNames: {
            toast:
              "group toast bg-slate-950/95 border border-slate-700/80 text-white shadow-[0_18px_45px_rgba(2,6,23,0.55)] rounded-2xl px-4 py-3 min-h-[72px] w-[min(420px,calc(100vw-24px))] backdrop-blur-md",
            title: "text-sm font-black text-white leading-5",
            description: "text-[11px] text-slate-300 mt-1 leading-5",
            actionButton: "bg-orange-500 text-white",
            cancelButton: "bg-slate-800 text-slate-200",
            closeButton: "border-slate-700 bg-slate-900 text-slate-300 hover:text-white",
          },
        }}
      />

      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(234,88,12,0.1) 100%)",
              border: "1px solid rgba(249,115,22,0.3)",
            }}
          >
            <ClipboardList className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">الطلبات الحية</h1>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                LIVE
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              {orders.length} <span className="font-bold text-slate-300">Total</span> •{" "}
              <span className="font-bold text-amber-400">{newOrdersCount} جديد</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-950/80 p-1 shadow-inner">
            <button
              onClick={() => setViewMode("tabs")}
              title="عرض التبويبات الفردية"
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                viewMode === "tabs"
                  ? "border border-orange-400/50 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Rows3 className="h-3.5 w-3.5" />
              <span>Tabs</span>
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              title="عرض الأعمدة الكانبان"
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                viewMode === "kanban"
                  ? "border border-orange-400/50 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={() => {
              const nextState = !soundEnabled;
              setSoundEnabled(nextState);
              toast.info(nextState ? "تم تفعيل التنبيه الصوتي 🔊" : "تم كتم التنبيه الصوتي 🔇");
            }}
            title={soundEnabled ? "كتم الصوت" : "تفعيل الصوت"}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all ${
              soundEnabled
                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-lg shadow-emerald-500/10"
                : "border-slate-700 bg-slate-800/60 text-slate-500 hover:text-slate-300"
            }`}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <button
            onClick={() => {
              const nextLive = !isLive;
              setIsLive(nextLive);
              toast.info(nextLive ? "تم تشغيل البث المباشر للطلبات 🟢" : "تم إيقاف البث المباشر مؤقتاً ⏸️");
            }}
            className={`flex items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-xs font-bold transition-all ${
              isLive
                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                : "border-slate-700 bg-slate-800/60 text-slate-400 hover:text-white"
            }`}
          >
            {isLive ? <Wifi className="h-4 w-4 text-emerald-400" /> : <WifiOff className="h-4 w-4 text-slate-500" />}
            <span>{isLive ? "بث مباشر" : "متوقف"}</span>
            {isLive && <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />}
          </button>

          <button
            onClick={simulateNewOrder}
            className="flex items-center gap-2 rounded-2xl border border-amber-500/35 bg-amber-500/20 px-3.5 py-2.5 text-xs font-bold text-amber-300 shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.01] hover:bg-amber-500/30 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>تجربة طلب جديد</span>
          </button>
        </div>
      </div>

      {/* عرض الطلبات: كانبان أو تابات */}
      {viewMode === "kanban" ? (
        <KanbanBoard
          orders={orders}
          onStatusChange={handleStatusChange}
          selectedStatusFilter="all"
          isOrderDelayed={isOrderDelayed}
        />
      ) : (
        <OrderTabs
          orders={orders}
          onStatusChange={handleStatusChange}
        />
      )}
    </DashboardLayout>
  );
}
