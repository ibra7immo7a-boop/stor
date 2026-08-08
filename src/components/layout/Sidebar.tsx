"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  UtensilsCrossed,
  BarChart3,
  X,
  ChefHat,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  ShoppingCart,
  Wallet,
  Bike,
  MapPin,
  Printer,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, type AuthUser } from "@/contexts/AuthContext";

const navItems = [
  {
    href: "/orders",
    label: "الطلبات الحية",
    sublabel: "متابعة فورية للطلبات",
    icon: ClipboardList,
    color: "text-amber-400",
    activeBg: "from-amber-500/20 to-orange-600/10",
    activeGlow: "shadow-amber-500/20",
    dot: "bg-amber-500",
  },
  {
    href: "/menu",
    label: "إدارة المنيو",
    sublabel: "الأصناف والتعديلات",
    icon: UtensilsCrossed,
    color: "text-blue-400",
    activeBg: "from-blue-500/20 to-cyan-600/10",
    activeGlow: "shadow-blue-500/20",
    dot: "bg-blue-500",
  },
  {
    href: "/messages",
    label: "المحادثات",
    sublabel: "رسائل العملاء والدعم",
    icon: MessageSquare,
    color: "text-indigo-400",
    activeBg: "from-indigo-500/20 to-purple-600/10",
    activeGlow: "shadow-indigo-500/20",
    dot: "bg-indigo-500",
  },
  {
    href: "/cashiers",
    label: "إدارة الموظفين",
    sublabel: "الصلاحيات والوصول",
    icon: ShieldCheck,
    color: "text-red-400",
    activeBg: "from-red-500/20 to-rose-600/10",
    activeGlow: "shadow-red-500/20",
    dot: "bg-red-500",
  },
  {
    href: "/analytics",
    label: "التقارير المتقدمة",
    sublabel: "تحليل الأداء والمبيعات",
    icon: BarChart3,
    color: "text-emerald-400",
    activeBg: "from-emerald-500/20 to-teal-600/10",
    activeGlow: "shadow-emerald-500/20",
    dot: "bg-emerald-500",
  },
];

const opsItems = [
  {
    href: "/pos",
    label: "الكاشير المباشر",
    sublabel: "طلبات المحل والتليفون",
    icon: ShoppingCart,
    color: "text-orange-400",
    activeBg: "from-orange-500/20 to-amber-600/10",
    activeGlow: "shadow-orange-500/20",
    dot: "bg-orange-500",
  },
  {
    href: "/shifts",
    label: "ورديات الخزينة",
    sublabel: "فتح وإغلاق الشيفت",
    icon: Wallet,
    color: "text-yellow-400",
    activeBg: "from-yellow-500/20 to-amber-600/10",
    activeGlow: "shadow-yellow-500/20",
    dot: "bg-yellow-500",
  },
  {
    href: "/drivers",
    label: "السائقين والمناديب",
    sublabel: "توجيه طلبات الدليفري",
    icon: Bike,
    color: "text-cyan-400",
    activeBg: "from-cyan-500/20 to-sky-600/10",
    activeGlow: "shadow-cyan-500/20",
    dot: "bg-cyan-500",
  },
  {
    href: "/zones",
    label: "مناطق التوصيل",
    sublabel: "الأسعار والحد الأدنى",
    icon: MapPin,
    color: "text-pink-400",
    activeBg: "from-pink-500/20 to-rose-600/10",
    activeGlow: "shadow-pink-500/20",
    dot: "bg-pink-500",
  },
  {
    href: "/printer",
    label: "إعدادات الطابعة",
    sublabel: "الطباعة الحرارية التلقائية",
    icon: Printer,
    color: "text-violet-400",
    activeBg: "from-violet-500/20 to-purple-600/10",
    activeGlow: "shadow-violet-500/20",
    dot: "bg-violet-500",
  },
];


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  newOrdersCount?: number;
  user?: AuthUser | null;
}

const permissionMap: Record<string, string> = {
  "/orders": "liveOrders",
  "/menu": "menuManagement",
  "/messages": "messages",
  "/cashiers": "staffManagement",
  "/analytics": "advancedReports",
  "/pos": "directPOS",
  "/shifts": "registerShifts",
  "/drivers": "driverDelivery",
  "/zones": "driverDelivery",
  "/printer": "printerSettings",
};

export function Sidebar({ isOpen, onClose, newOrdersCount = 0, user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const visibleNavItems = [...navItems, ...opsItems].filter((item) => {
    const permission = permissionMap[item.href];
    if (!permission) return true;
    if (!user) return false;
    if (user.role === "admin" || user.username === "super_admin" || user.permissionNames?.includes("all")) {
      return true;
    }
    return Boolean(user.permissions?.[permission as keyof typeof user.permissions]);
  });
  const mainNavItems = visibleNavItems.filter((item) => navItems.some((nav) => nav.href === item.href));
  const opsNavItems = visibleNavItems.filter((item) => opsItems.some((nav) => nav.href === item.href));

  return (
    <>
      {/* Overlay للموبايل */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/75 z-40 lg:hidden backdrop-blur-md transition-opacity"
          onClick={onClose}
        />
      )}

      {/* الشريط الجانبي */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-72 z-50 flex flex-col select-none border-l border-border/60 bg-background/95 backdrop-blur-xl",
          "transition-transform duration-300 ease-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        {/* العوامل البصرية والخلفية الإشعاعية */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-[0.1] blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #f97316, transparent)" }}
          />
          <div
            className="absolute bottom-10 left-0 w-48 h-48 rounded-full opacity-[0.05] blur-2xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
          />
        </div>

        {/* Header الهوية - "ماي أوردر" */}
        <div className="relative flex items-center justify-between px-5 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 relative group cursor-pointer transition-transform duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                boxShadow: "0 8px 25px rgba(249, 115, 22, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
              }}
            >
              <ChefHat className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1
                  className="font-black text-xl leading-none tracking-tight"
                  style={{
                    color: '#facc15',
                    textShadow: '0 0 12px rgba(250, 204, 21, 0.35)',
                  }}
                >
                  <span style={{ color: '#facc15' }}>My</span> <span style={{ color: '#facc15' }}>Order</span>
                </h1>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase">
                  PRO
                </span>
              </div>
              <p className="text-muted-foreground text-xs font-medium mt-1">نظام إدارة المطاعم الذكي</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-xl bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

        {/* قائمة التنقل */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
          <div className="flex items-center justify-between px-2 mb-3">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-400" />
              اللوحة الرئيسية
            </p>
          </div>

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? `bg-gradient-to-l ${item.activeBg} shadow-lg ${item.activeGlow}`
                      : "hover:bg-muted/70"
                )}
                style={{
                  border: isActive ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
                }}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0",
                    isActive
                      ? `${item.color.replace("text-", "bg-").replace("400", "500/20")} ${item.color} shadow-sm`
                    : "bg-muted/70 text-muted-foreground group-hover:text-foreground group-hover:bg-muted"
                  )}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-bold leading-tight",
                    isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                  )}>
                    {item.label}
                  </p>
                  <p className="text-slate-500 text-[10px] mt-0.5 group-hover:text-slate-400 transition-colors">
                    {item.sublabel}
                  </p>
                </div>

                {item.href === "/orders" && newOrdersCount > 0 && (
                  <span className="text-[11px] font-black text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                    {newOrdersCount}
                  </span>
                )}

                {isActive && (
                  <div
                    className={`absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full ${item.dot}`}
                    style={{ boxShadow: "0 0 10px currentColor" }}
                  />
                )}
              </Link>
            );
          })}

          {/* فاصل قسم أدوات التشغيل */}
          <div className="mx-2 my-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex items-center justify-between px-2 mb-3">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="text-orange-400">⚙️</span>
              أدوات التشغيل
            </p>
          </div>

          {opsNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? `bg-gradient-to-l ${item.activeBg} shadow-lg ${item.activeGlow}`
                    : "hover:bg-white/[0.04]"
                )}
                style={{
                  border: isActive ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
                }}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0",
                    isActive
                      ? `${item.color.replace("text-", "bg-").replace("400", "500/20")} ${item.color} shadow-sm`
                      : "bg-white/5 text-slate-400 group-hover:text-slate-200 group-hover:bg-white/10"
                  )}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-bold leading-tight",
                    isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                  )}>
                    {item.label}
                  </p>
                  <p className="text-slate-500 text-[10px] mt-0.5 group-hover:text-slate-400 transition-colors">
                    {item.sublabel}
                  </p>
                </div>

                {isActive && (
                  <div
                    className={`absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full ${item.dot}`}
                    style={{ boxShadow: "0 0 10px currentColor" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>




        {/* المستخدم الأونلاين */}
        <div className="px-4 pb-5">
          <div className="rounded-2xl border border-border/60 bg-card/70 p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white shadow-lg"
                style={{ background: "linear-gradient(135deg, #f97316, #dc2626)" }}
              >
                {user?.name?.charAt(0) || "م"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-foreground">{user?.name ?? "مدير المطعم"}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[10px] text-muted-foreground">
                    {user?.role === "admin" ? "مدير نظام" : user?.role === "manager" ? "مدير فرع" : "كاشير"}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm font-bold text-red-400 transition-all duration-200 hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
