"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { OrderCard } from "./OrderCard";
import { Inbox, Loader2, Archive, XCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Order, OrderStatus } from "@/lib/mock-data";

interface OrderTabsProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus, rejectReason?: string) => void;
  activeFilter?: string;
  isOrderDelayed?: (o: Order) => boolean;
}

const tabsConfig: {
  value: string;
  label: string;
  icon: React.ReactNode;
  emptyMsg: string;
  badgeStyle: string;
  activeColor: string;
}[] = [
  {
    value: "new",
    label: "جديدة",
    icon: <Inbox className="w-4 h-4 text-emerald-400" />,
    emptyMsg: "لا توجد طلبات جديدة حالياً 🎉",
    badgeStyle: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(34,197,94,0.3)]",
    activeColor: "data-active:text-emerald-300 data-active:bg-[#0f1f1b] data-active:border-emerald-500/50 data-active:shadow-[0_6px_18px_rgba(16,185,129,0.18)]",
  },
  {
    value: "preparing",
    label: "قيد التحضير",
    icon: <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />,
    emptyMsg: "المطبخ فارغ حالياً — لا توجد طلبات قيد التحضير",
    badgeStyle: "bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]",
    activeColor: "data-active:text-blue-300 data-active:bg-[#0d172a] data-active:border-blue-500/50 data-active:shadow-[0_6px_18px_rgba(59,130,246,0.18)]",
  },
  {
    value: "delayed",
    label: "متأخرة ⚠️",
    icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    emptyMsg: "ممتاز! لا توجد طلبات متأخرة 🎉",
    badgeStyle: "bg-amber-500/25 text-amber-200 border-amber-400/60 shadow-[0_0_10px_rgba(245,158,11,0.4)]",
    activeColor: "data-active:text-amber-200 data-active:bg-[#1b1710] data-active:border-amber-500/60 data-active:shadow-[0_6px_18px_rgba(245,158,11,0.2)]",
  },
  {
    value: "cancelled",
    label: "ملغي / مرفوض",
    icon: <XCircle className="w-4 h-4 text-red-400" />,
    emptyMsg: "لا توجد طلبات ملغية",
    badgeStyle: "bg-red-500/20 text-red-300 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    activeColor: "data-active:text-red-300 data-active:bg-[#1d1216] data-active:border-red-500/50 data-active:shadow-[0_6px_18px_rgba(239,68,68,0.18)]",
  },
  {
    value: "delivered",
    label: "أرشيف / استلام",
    icon: <Archive className="w-4 h-4 text-slate-400" />,
    emptyMsg: "سجل الأرشيف فارغ حالياً",
    badgeStyle: "bg-slate-700/50 text-slate-300 border-slate-600/40",
    activeColor: "data-active:text-slate-100 data-active:bg-[#121922] data-active:border-slate-500/50 data-active:shadow-[0_6px_18px_rgba(148,163,184,0.18)]",
  },
];

export function OrderTabs({ orders, onStatusChange, isOrderDelayed }: OrderTabsProps) {
  const [activeTab, setActiveTab] = useState("new");

  const getOrdersForTab = (tabVal: string) => {
    if (tabVal === "delayed") {
      return isOrderDelayed ? orders.filter(isOrderDelayed) : [];
    }
    return orders.filter((o) => o.status === tabVal);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(String(value))}
      className="w-full select-none"
    >
      {/* شريط التابات الملون والفاخر */}
      <TabsList className="w-full h-auto p-0 bg-transparent border-none shadow-none rounded-[26px] mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 ring-0 outline-none">
        {tabsConfig.map((tab) => {
          const tabOrders = getOrdersForTab(tab.value);
          const count = tabOrders.length;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`
                flex items-center justify-center gap-2.5 py-3 px-3.5 rounded-[18px] text-xs sm:text-sm font-bold border-none bg-transparent shadow-none
                transition-all duration-300 ease-out cursor-pointer text-slate-400 hover:text-slate-200 hover:bg-transparent
                data-active:text-white data-active:shadow-none ${tab.activeColor}
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {count > 0 && (
                <Badge
                  className={`text-[11px] font-black px-2 py-0.5 rounded-full border transition-all duration-200 ${tab.badgeStyle}`}
                >
                  {count}
                </Badge>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* المحتوى مع شبكة Grid مفرودة (3 إلى 4 كروت بالصف على الشاشات الكبيرة) */}
      {tabsConfig.map((tab) => {
        const tabOrders = getOrdersForTab(tab.value);

        return (
          <TabsContent key={tab.value} value={tab.value} className="mt-0 focus-visible:outline-none">
            {tabOrders.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-slate-800/60 bg-slate-950/40 backdrop-blur-md"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-4 text-slate-400 shadow-inner">
                  {tab.icon}
                </div>
                <h3 className="text-white font-bold text-base mb-1">{tab.emptyMsg}</h3>
                <p className="text-slate-500 text-xs max-w-xs">
                  ستظهر الطلبات تلقائياً هنا بمجرد تحديث حالتها من الشيف أو النظام
                </p>
              </motion.div>
            ) : (
              <motion.div 
                layout 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {tabOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={onStatusChange}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
