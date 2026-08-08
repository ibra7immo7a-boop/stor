"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserCog, Building2, Clock, Save, Camera, Store, Power } from "lucide-react";
import { toast } from "sonner";

type ManagerTab = "account" | "branches" | "hours";

interface ManagerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: ManagerTab;
}

export function ManagerSettingsModal({
  isOpen,
  onClose,
  defaultTab = "account",
}: ManagerSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<ManagerTab>(defaultTab);
  const [branches, setBranches] = useState([
    { id: 1, name: "فرع التجمع الخامس (الرئيسي)", active: true },
    { id: 2, name: "فرع مدينة نصر", active: true },
    { id: 3, name: "فرع المعادي", active: false },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("تم حفظ التعديلات بنجاح 💾", {
        style: { background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#34d399" }
      });
      onClose();
    }, 1000);
  };

  const toggleBranch = (id: number) => {
    setBranches(branches.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          return;
        }

        setActiveTab(defaultTab);
      }}
    >
      <DialogContent 
        className="max-w-2xl border border-border bg-card/95 text-foreground shadow-2xl p-0 overflow-hidden rounded-3xl"
        dir="rtl"
      >
        {/* Header Decorator */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #f97316, #dc2626, #3b82f6)" }} />
        
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/70">
          <DialogTitle className="text-xl font-black text-foreground flex items-center gap-2">
            <UserCog className="w-5 h-5 text-orange-400" />
            إعدادات لوحة التحكم
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            إدارة الحساب الشخصي، الفروع، وساعات عمل المطعم.
          </DialogDescription>
        </DialogHeader>

        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as ManagerTab)} 
          className="w-full"
        >
          <div className="px-6 pt-4">
            <TabsList className="w-full rounded-xl border border-border bg-muted/80 p-1 grid grid-cols-3">
              <TabsTrigger 
                value="account" 
                className="rounded-lg text-xs font-bold gap-2 transition-all text-muted-foreground hover:text-orange-500 data-active:bg-background data-active:text-orange-500"
              >
                <UserCog className="w-3.5 h-3.5" /> حسابي
              </TabsTrigger>
              <TabsTrigger 
                value="branches" 
                className="rounded-lg text-xs font-bold gap-2 transition-all text-muted-foreground hover:text-blue-500 data-active:bg-background data-active:text-blue-500"
              >
                <Building2 className="w-3.5 h-3.5" /> الفروع
              </TabsTrigger>
              <TabsTrigger 
                value="hours" 
                className="rounded-lg text-xs font-bold gap-2 transition-all text-muted-foreground hover:text-emerald-500 data-active:bg-background data-active:text-emerald-500"
              >
                <Clock className="w-3.5 h-3.5" /> ساعات العمل
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 min-h-[300px]">
            {/* Account Settings */}
            <TabsContent value="account" className="mt-0 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-5">
                <div className="relative group cursor-pointer">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg transition-transform group-hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #f97316, #dc2626)" }}>
                    م
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-foreground font-bold">المدير العام</h3>
                  <p className="text-xs text-muted-foreground">admin@myorder.com</p>
                  <button className="mt-2 rounded-lg bg-muted px-3 py-1.5 text-[10px] font-semibold text-foreground transition-colors hover:bg-muted/80">
                    تغيير الصورة
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="px-1 text-[11px] font-bold text-muted-foreground">الاسم بالكامل</label>
                  <input type="text" defaultValue="المدير العام" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-orange-500/50 focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="px-1 text-[11px] font-bold text-muted-foreground">البريد الإلكتروني</label>
                  <input type="email" defaultValue="admin@myorder.com" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-orange-500/50 focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="px-1 text-[11px] font-bold text-muted-foreground">رقم الهاتف</label>
                  <input type="tel" defaultValue="01012345678" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-orange-500/50 focus:outline-none" dir="ltr" />
                </div>
                <div className="space-y-1.5">
                  <label className="px-1 text-[11px] font-bold text-muted-foreground">كلمة المرور الجديدة</label>
                  <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-orange-500/50 focus:outline-none" />
                </div>
              </div>
            </TabsContent>

            {/* Branches Settings */}
            <TabsContent value="branches" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
                <Store className="w-5 h-5 text-blue-500" />
                <p className="text-xs font-medium leading-relaxed text-blue-600 dark:text-blue-300">
                  يمكنك إدارة حالة الفروع (مفتوح/مغلق) للتحكم في استقبال الطلبات أونلاين.
                </p>
              </div>

              <div className="space-y-2.5">
                {branches.map(branch => (
                  <div key={branch.id} className="flex items-center justify-between rounded-xl border border-border bg-muted/60 p-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${branch.active ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-red-500'}`} />
                      <span className="text-sm font-bold text-foreground">{branch.name}</span>
                    </div>
                    
                    <button 
                      onClick={() => toggleBranch(branch.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                        branch.active 
                          ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 dark:text-red-400' 
                          : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {branch.active ? 'إغلاق الفرع' : 'فتح الفرع'}
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Working Hours Settings */}
            <TabsContent value="hours" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <Clock className="w-5 h-5 text-emerald-500" />
                <p className="text-xs font-medium leading-relaxed text-emerald-600 dark:text-emerald-300">
                  ساعات العمل الافتراضية تطبق على جميع الفروع النشطة.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {['السبت - الأربعاء', 'الخميس - الجمعة'].map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl border border-border bg-muted/60 p-3.5">
                    <span className="text-sm font-bold text-foreground">{day}</span>
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground" dir="ltr">
                        11:00 AM
                      </div>
                      <span className="text-xs text-muted-foreground">إلى</span>
                      <div className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground" dir="ltr">
                        02:00 AM
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 border-t border-border/70 bg-muted/50 px-6 py-4">
          <button 
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            إلغاء
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl px-6 py-2 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", boxShadow: "0 4px 15px rgba(249,115,22,0.3)" }}
          >
            {isSaving ? <span className="animate-spin text-lg leading-none">⟳</span> : <Save className="w-4 h-4" />}
            حفظ التغييرات
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
