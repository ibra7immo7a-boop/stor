"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const demoAccounts = [
  { username: "super_admin", password: "superadmin123", label: "Super Admin" },
  { username: "admin", password: "admin123", label: "مدير النظام" },
  { username: "manager", password: "manager123", label: "مدير فرع" },
  { username: "cashier", password: "cashier123", label: "كاشير" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const response = await login(username, password);

    if (!response.success) {
      setError(response.message || "فشل تسجيل الدخول");
      return;
    }

    router.push("/orders");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#dfe7ee] px-4 py-10">
      <div className="w-full max-w-[520px] rounded-[30px] bg-[#d7e0e8] p-7 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-3xl font-black text-white shadow-[0_10px_22px_rgba(249,115,22,0.35)]">
            M
          </div>

          <h1 className="text-[28px] font-black text-slate-800">تسجيل الدخول</h1>
          <p className="mt-2 text-sm text-slate-600">لوحة التحكم - نظام المطاعم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">اسم المستخدم</Label>
            <Input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="h-12 rounded-2xl border border-slate-300 bg-white text-base font-semibold text-slate-900 placeholder:text-slate-500 shadow-[0_2px_10px_rgba(15,23,42,0.06)] focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-200"
              dir="ltr"
              placeholder="اسم المستخدم"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">كلمة المرور</Label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-2xl border border-slate-300 bg-white text-base font-semibold text-slate-900 placeholder:text-slate-500 shadow-[0_2px_10px_rgba(15,23,42,0.06)] focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-200"
              dir="ltr"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-300 bg-red-100 px-3 py-2 text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="h-12 w-full rounded-2xl border-0 bg-gradient-to-r from-orange-500 to-red-600 text-base font-black text-white shadow-[0_10px_18px_rgba(249,115,22,0.25)] hover:opacity-95"
            disabled={isLoading}
          >
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        <div className="mt-6 rounded-[24px] bg-[#0f1d2d] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <p className="mb-3 text-sm font-bold text-slate-200">حسابات تجريبية</p>

          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.username}
                type="button"
                onClick={() => {
                  setUsername(account.username);
                  setPassword(account.password);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#152534] px-3 py-2.5 text-right text-sm text-slate-200 transition-colors hover:border-orange-500/60 hover:bg-[#1c2f40]"
              >
                <span className="font-medium text-slate-200">{account.label}</span>
                <span className="font-mono text-xs text-slate-400">{account.username}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
