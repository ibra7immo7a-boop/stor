"use client";

import { useState } from "react";
import {
  Phone,
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  Package,
  Bike,
  CheckCircle2,
  XCircle,
  ChevronUp,
  Printer,
  Receipt,
  Sparkles,
  AlertCircle,
  UserCheck,
  Archive,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { OrderTimer } from "./OrderTimer";
import { RejectModal } from "./RejectModal";
import { InvoiceModal } from "@/components/modals/InvoiceModal";
import type { Order, OrderStatus } from "@/lib/mock-data";

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus, rejectReason?: string) => void;
}

const paymentConfig = {
  cash: { icon: <Banknote className="w-3.5 h-3.5 text-emerald-400" />, label: "كاش", color: "text-emerald-400" },
  card: { icon: <CreditCard className="w-3.5 h-3.5 text-blue-400" />, label: "فيزا / ماستر", color: "text-blue-400" },
  online: { icon: <Smartphone className="w-3.5 h-3.5 text-purple-400" />, label: "دفع أونلاين", color: "text-purple-400" },
};

// إعدادات الألوان الديناميكية حسب الحالة بناءً على طلب العميل
const statusConfig: Record<OrderStatus, {
  next: OrderStatus | null;
  label: string;
  gradient: string;
  glowShadow: string;
  cardBorder: string;
  cardBg: string;
  cardGlow: string;
}> = {
  new: {
    next: "preparing",
    label: "قبول وتوجيه للمطبخ",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    glowShadow: "0 4px 20px rgba(16, 185, 129, 0.35)",
    cardBorder: "border-emerald-500/50",
    cardBg: "bg-emerald-500/5",
    cardGlow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
  },
  preparing: {
    next: "delivered",
    label: "جاهز — أرشفة",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    glowShadow: "0 4px 20px rgba(59, 130, 246, 0.35)",
    cardBorder: "border-blue-500/50",
    cardBg: "bg-blue-500/5",
    cardGlow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
  },
  ready: {
    next: "delivered",
    label: "تم الاستلام",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    glowShadow: "0 4px 20px rgba(245, 158, 11, 0.35)",
    cardBorder: "border-amber-500/50",
    cardBg: "bg-amber-500/5",
    cardGlow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
  },
  delivered: {
    next: null,
    label: "مؤرشف",
    gradient: "linear-gradient(135deg, #475569 0%, #334155 100%)",
    glowShadow: "none",
    cardBorder: "border-slate-600/40",
    cardBg: "bg-slate-800/20",
    cardGlow: "",
  },
  cancelled: {
    next: null,
    label: "طلب ملغي",
    gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", // Crimson Red
    glowShadow: "none",
    cardBorder: "border-red-500/50",
    cardBg: "bg-red-500/5",
    cardGlow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]",
  },
};

const statusBadge: Record<OrderStatus, { label: string; class: string }> = {
  new: { label: "طلب جديد", class: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  preparing: { label: "قيد التحضير 🍳", class: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
  ready: { label: "جاهز للتوصيل", class: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  delivered: { label: "أرشيف ✅", class: "bg-slate-600/30 text-slate-400 border-slate-600/40" },
  cancelled: { label: "ملغي ❌", class: "bg-red-500/20 text-red-300 border-red-500/40" },
};

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const config = statusConfig[order.status];
  const badge = statusBadge[order.status];
  const payment = paymentConfig[order.paymentMethod];

  const handleAccept = () => {
    if (!config.next) return;
    onStatusChange(order.id, config.next);

    if (config.next === "preparing") {
      toast.success(`تم قبول الطلب #${order.orderNumber} 🚀`, {
        description: `العميل: ${order.customer.name} • ${order.total.toLocaleString("ar-EG")} ج.م`,
        duration: 4000,
        style: { background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#34d399" },
      });
    } else if (config.next === "delivered") {
      toast.success(`تم أرشفة الطلب #${order.orderNumber} ✅`, {
        description: `تم الاستلام أو التسليم بنجاح`,
        duration: 4000,
        style: { background: "rgba(100, 116, 139, 0.15)", border: "1px solid rgba(100, 116, 139, 0.4)", color: "#94a3b8" },
      });
    }
  };

  const handleAssignDriver = () => {
    // إرسال إشعار للمندوب (محاكاة)
    onStatusChange(order.id, "delivered");
    toast.success(`تم إسناد الطلب #${order.orderNumber} لمندوب التوصيل 🛵`, {
      description: `سيصل إشعار للمندوب فوراً — تم نقل الطلب للأرشيف`,
      duration: 5000,
      style: { background: "rgba(249, 115, 22, 0.15)", border: "1px solid rgba(249, 115, 22, 0.4)", color: "#fb923c" },
    });
  };

  const handleRejectConfirm = (reason: string) => {
    onStatusChange(order.id, "cancelled", reason); // Mark as cancelled

    toast.error(`تم رفض الطلب #${order.orderNumber} ❌`, {
      description: `سبب الرفض: ${reason}`,
      duration: 5000,
    });
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
        className={`w-full rounded-3xl overflow-hidden transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl border ${config.cardBorder} ${config.cardBg} ${config.cardGlow}`}
      >
        {/* ====== Header ====== */}
        <div
          className="flex items-center justify-between px-4 py-3.5"
          style={{
            background: "rgba(255,255,255,0.025)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-2">
            {/* نوع الطلب */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold shadow-sm"
              style={
                order.type === "delivery"
                  ? { background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa" }
                  : { background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc" }
              }
            >
              {order.type === "delivery" ? (
                <Bike className="w-3.5 h-3.5" />
              ) : (
                <Package className="w-3.5 h-3.5" />
              )}
              {order.type === "delivery" ? "توصيل" : "استلام دليفري"}
            </div>

            {/* رقم الطلب */}
            <span className="text-white font-black text-sm tracking-wide">
              #{order.orderNumber}
            </span>

            {/* Badge الحالة */}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.class}`}>
              {badge.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Smart Order Timer */}
            <OrderTimer createdAt={order.createdAt} />

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <motion.div animate={{ rotate: isExpanded ? 0 : 180 }} transition={{ duration: 0.2 }}>
                <ChevronUp className="w-4 h-4" />
              </motion.div>
            </button>
          </div>
        </div>

        {/* ====== Body ====== */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* بيانات العميل */}
                <div
                  className="rounded-2xl p-3.5 space-y-2.5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-md"
                      style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" }}
                    >
                      {order.customer.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{order.customer.name}</p>
                      <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span className="text-xs font-mono" dir="ltr">{order.customer.phone}</span>
                      </div>
                    </div>
                  </div>

                  {order.customer.address && (
                    <div className="flex items-start gap-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <MapPin className="w-3.5 h-3.5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-300 text-xs leading-relaxed">{order.customer.address}</p>
                    </div>
                  )}
                </div>

                {/* الأصناف المطلوبة */}
                <div
                  className="rounded-2xl p-3.5 space-y-3"
                  style={{
                    background: "rgba(6, 10, 22, 0.65)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.4)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-slate-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                      الأصناف المطلوبة
                    </p>
                    <span className="text-slate-500 text-[10px]">
                      {order.items.length} أصناف
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5 text-orange-300"
                            style={{ background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.35)" }}
                          >
                            {item.quantity}x
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-bold leading-tight">{item.name}</p>

                            {/* إضافات الشيف */}
                            {item.extras && item.extras.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {item.extras.map((extra, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[11px] font-bold px-2 py-0.5 rounded-md text-amber-300 flex items-center gap-1"
                                    style={{
                                      background: "rgba(245, 158, 11, 0.15)",
                                      border: "1px solid rgba(245, 158, 11, 0.35)",
                                    }}
                                  >
                                    <AlertCircle className="w-3 h-3 text-amber-400" />
                                    {extra}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="text-white font-bold text-sm flex-shrink-0 tabular-nums">
                          {(item.price * item.quantity).toLocaleString("ar-EG")}{" "}
                          <span className="text-slate-500 text-xs font-normal">ج.م</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* الإجمالي والدفع */}
                <div
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className={`flex items-center gap-2 text-xs font-bold ${payment.color}`}>
                    {payment.icon}
                    <span>{payment.label}</span>
                  </div>

                  <div className="text-left">
                    <p className="text-slate-500 text-[10px]">إجمالي الفاتورة</p>
                    <p className="text-white font-black text-xl leading-none tabular-nums">
                      {order.total.toLocaleString("ar-EG")}
                      <span className="text-orange-400 text-xs font-bold mr-1"> ج.م</span>
                    </p>
                  </div>
                </div>

                {/* الأزرار والتفاعلات */}
                {order.status !== "delivered" && (
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex gap-2">
                      {/* زر القبول الرئيسي */}
                      {config.next && (
                        <button
                          onClick={handleAccept}
                          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-2xl text-white font-bold text-sm transition-all duration-200 active:scale-95 hover:scale-[1.02]"
                          style={{ background: config.gradient, boxShadow: config.glowShadow }}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {config.label}
                        </button>
                      )}

                      {/* رفض — للطلبات الجديدة فقط */}
                      {order.status === "new" && (
                        <button
                          onClick={() => setShowRejectModal(true)}
                          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-2xl font-bold text-sm text-red-400 hover:text-red-300 transition-all duration-200 active:scale-95"
                          style={{
                            background: "rgba(239, 68, 68, 0.12)",
                            border: "1px solid rgba(239, 68, 68, 0.35)",
                            boxShadow: "0 4px 15px rgba(239, 68, 68, 0.15)",
                          }}
                        >
                          <XCircle className="w-4 h-4" />
                          رفض
                        </button>
                      )}

                      {/* طباعة */}
                      <button
                        onClick={() => setShowInvoiceModal(true)}
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:bg-white/10 flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        title="طباعة الفاتورة"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>

                    {/* زر إسناد لمندوب — للطلبات قيد التحضير + نوع دليفري */}
                    {order.status === "preparing" && order.type === "delivery" && (
                      <button
                        onClick={handleAssignDriver}
                        className="w-full flex items-center justify-center gap-2.5 h-10 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95 hover:scale-[1.01]"
                        style={{
                          background: "linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(234,88,12,0.12) 100%)",
                          border: "1px solid rgba(249,115,22,0.45)",
                          color: "#fb923c",
                          boxShadow: "0 4px 15px rgba(249,115,22,0.2)",
                        }}
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>إسناد لمندوب توصيل 🛵</span>
                      </button>
                    )}
                  </div>
                )}

                {/* أرشيف */}
                {order.status === "delivered" && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setShowInvoiceModal(true)}
                      className="flex-1 flex items-center justify-center gap-2 h-9 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800/60 transition-colors"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      عرض الفاتورة
                    </button>
                    <div
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold text-slate-500"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <Archive className="w-3 h-3" />
                      مؤرشف
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <RejectModal
        isOpen={showRejectModal}
        orderNumber={order.orderNumber}
        onConfirm={handleRejectConfirm}
        onClose={() => setShowRejectModal(false)}
      />

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        order={order}
      />
    </>
  );
}
