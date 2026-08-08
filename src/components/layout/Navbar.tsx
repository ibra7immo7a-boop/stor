"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  ChevronDown,
  UserCog,
  Building2,
  Clock,
  LogOut,
  Settings2,
} from "lucide-react";

import { ManagerSettingsModal } from "@/components/modals/ManagerSettingsModal";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth, type AuthUser } from "@/contexts/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onMenuToggle: () => void;
  newOrdersCount?: number;
  user?: AuthUser | null;
}

export function Navbar({ onMenuToggle, user }: NavbarProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"account" | "branches" | "hours">("account");

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 px-4 pb-3 pt-3 backdrop-blur-xl lg:px-6">
      <div className="flex w-full items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-muted/70 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex-1">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن طلب أو صنف..."
              className="h-9 w-full rounded-xl border border-border/70 bg-card/70 pr-9 pl-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none"
              style={{ fontFamily: "inherit" }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-2 py-1.5 shadow-sm shadow-slate-950/20">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors outline-none hover:bg-slate-900/60">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black text-white"
                style={{ background: "linear-gradient(135deg, #f97316, #dc2626)" }}
              >
                م
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-sm font-semibold text-foreground">{user?.name ?? "المدير"}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-2 w-56 rounded-xl border-border bg-popover p-1.5 text-popover-foreground shadow-2xl">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-muted-foreground">حسابي</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />

              <DropdownMenuItem
                onClick={() => {
                  setSettingsTab("account");
                  setIsSettingsOpen(true);
                }}
                className="cursor-pointer gap-2 rounded-lg p-2 transition-colors focus:bg-slate-900 focus:text-white"
              >
                <UserCog className="h-4 w-4 text-slate-400" />
                <span>إعدادات الحساب</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setSettingsTab("branches");
                  setIsSettingsOpen(true);
                }}
                className="cursor-pointer gap-2 rounded-lg p-2 transition-colors focus:bg-slate-900 focus:text-white"
              >
                <Building2 className="h-4 w-4 text-slate-400" />
                <span>إدارة الفروع</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setSettingsTab("hours");
                  setIsSettingsOpen(true);
                }}
                className="cursor-pointer gap-2 rounded-lg p-2 transition-colors focus:bg-slate-900 focus:text-white"
              >
                <Clock className="h-4 w-4 text-slate-400" />
                <span>ساعات العمل</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-border" />

              <DropdownMenuItem
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="cursor-pointer gap-2 rounded-lg p-2 text-red-500 transition-colors focus:bg-red-500/10 focus:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span>تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden items-center gap-2 border-r border-border/70 pr-2 text-right xl:flex">
            <div className="flex flex-col">
              <span suppressHydrationWarning className="text-[11px] font-black text-foreground tabular-nums">
                {currentTime ? currentTime.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }) : "--:--:--"}
              </span>
              <span suppressHydrationWarning className="text-[9px] text-muted-foreground">
                {currentTime ? currentTime.toLocaleDateString("ar-EG", { weekday: "short", day: "numeric", month: "short" }) : "--"}
              </span>
            </div>
          </div>

          <ThemeToggle />

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-muted/70 text-muted-foreground transition-colors hover:text-foreground"
            title="إعدادات سريعة"
            aria-label="إعدادات سريعة"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ManagerSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} defaultTab={settingsTab} />
    </header>
  );
}
