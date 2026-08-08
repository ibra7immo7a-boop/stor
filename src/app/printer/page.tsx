"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Printer,
  Settings,
  Plus,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Wifi,
  Usb,
  ImagePlus,
  X,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { Switch } from "@/components/ui/switch";

interface PrinterItem {
  id: string;
  name: string;
  model: string;
  type: "usb" | "network";
  ip?: string;
  status: "connected" | "disconnected";
  isDefault: boolean;
}

export default function PrinterSettingsPage() {
  const [printers, setPrinters] = useState<PrinterItem[]>([
    {
      id: "1",
      name: "طابعة الكاشير",
      model: "Epson TM-T88VI",
      type: "usb",
      status: "connected",
      isDefault: true,
    },
    {
      id: "2",
      name: "طابعة المطبخ",
      model: "Star TSP100",
      type: "network",
      ip: "192.168.1.101",
      status: "connected",
      isDefault: false,
    },
    {
      id: "3",
      name: "طابعة الخارجية",
      model: "Xprinter XP-58",
      type: "network",
      ip: "192.168.1.102",
      status: "disconnected",
      isDefault: false,
    },
  ]);

  type FontSize = "صغير" | "متوسط" | "كبير";

  const [settings, setSettings] = useState<{
    autoPrint: boolean;
    kitchenPrint: boolean;
    barcode: boolean;
    fontSize: FontSize;
    closingMessage: string;
  }>({
    autoPrint: true,
    kitchenPrint: true,
    barcode: false,
    fontSize: "متوسط",
    closingMessage: "شكراً لزيارتكم — ماي أوردر",
  });

  const [isInvoiceEnabled, setIsInvoiceEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTestPrint = (name: string) => {
    toast.success(`تم إرسال أمر طباعة تجريبي إلى ${name}`);
  };

  const handleReconnect = (name: string) => {
    toast.info(`جاري محاولة إعادة الاتصال بـ ${name}...`);
    setTimeout(() => {
      toast.success(`تم الاتصال بنجاح بـ ${name}`);
    }, 1500);
  };

  const handleSetDefault = (id: string) => {
    setPrinters((prev) =>
      prev.map((p) => ({ ...p, isDefault: p.id === id }))
    );
    toast.success("تم تعيين الطابعة كافتراضية");
  };

  const handleSaveSettings = () => {
    toast.success("تم حفظ إعدادات الطباعة بنجاح");
  };

  const handleToggleInvoice = () => {
    const nextState = !isInvoiceEnabled;
    setIsInvoiceEnabled(nextState);
    toast.success(nextState ? "تم تفعيل إعدادات الفاتورة ✅" : "تم إيقاف إعدادات الفاتورة ⏸️");
  };

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case "صغير":
        return "text-xs";
      case "كبير":
        return "text-base";
      case "متوسط":
      default:
        return "text-sm";
    }
  };

  return (
    <DashboardLayout>
      <Toaster position="top-center" richColors />
      <div className="space-y-6 page-enter">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <Printer className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                إعدادات الطابعات
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                إدارة طابعات الفواتير والمطبخ وإعدادات الطباعة
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة طابعة</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Printers List & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Printers List */}
            <div className="panel-soft p-6 rounded-2xl">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Printer className="w-5 h-5 text-orange-400" />
                الطابعات المتصلة
              </h2>
              <div className="space-y-4">
                {printers.map((printer) => (
                  <div
                    key={printer.id}
                    className="bg-card/70 border border-border/70 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 card-hover transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl mt-1 ${
                          printer.status === "connected"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        <Printer className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground text-lg">
                            {printer.name}
                          </h3>
                          {printer.isDefault && (
                            <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full border border-orange-500/20">
                              الافتراضية
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <span className="text-slate-500">الموديل:</span>
                            {printer.model}
                          </span>
                          <span className="flex items-center gap-1.5">
                            {printer.type === "usb" ? (
                              <Usb className="w-4 h-4 text-blue-400" />
                            ) : (
                              <Wifi className="w-4 h-4 text-blue-400" />
                            )}
                            {printer.type === "usb" ? "USB" : "شبكة"}
                          </span>
                          {printer.ip && (
                            <span className="flex items-center gap-1.5">
                              <span className="text-slate-500">IP:</span>
                              {printer.ip}
                            </span>
                          )}
                          <span
                            className={`flex items-center gap-1.5 ${
                              printer.status === "connected"
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {printer.status === "connected" ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" /> متصل
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" /> غير متصل
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <button
                        onClick={() => handleTestPrint(printer.name)}
                        className="flex-1 sm:flex-none px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors border border-border"
                      >
                        اختبار الطباعة
                      </button>
                      <button
                        onClick={() => handleReconnect(printer.name)}
                        className="flex-1 sm:flex-none px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors border border-border flex items-center justify-center gap-1.5"
                      >
                        <RefreshCcw className="w-3.5 h-3.5" /> إعادة الاتصال
                      </button>
                      {!printer.isDefault && (
                        <button
                          onClick={() => handleSetDefault(printer.id)}
                          className="flex-1 sm:flex-none px-3 py-1.5 text-sm bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg transition-colors border border-orange-500/20"
                        >
                          تعيين كافتراضي
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Receipt Settings */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-400" />
                  إعدادات الفاتورة
                </h2>

                <button
                  type="button"
                  onClick={handleToggleInvoice}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-200 ${
                    isInvoiceEnabled
                      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 shadow-sm dark:border-emerald-400/40 dark:bg-emerald-500/20 dark:text-emerald-300"
                      : "border-border bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isInvoiceEnabled ? "bg-emerald-500" : "bg-muted-foreground"
                    }`}
                  />
                  {isInvoiceEnabled ? "مفعل" : "تفعيل"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-border bg-muted/60 p-3 text-foreground">
                    <span>طباعة تلقائية عند استلام الطلب</span>
                    <Switch
                      checked={settings.autoPrint}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({ ...prev, autoPrint: Boolean(checked) }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-border bg-muted/60 p-3 text-foreground">
                    <span>طباعة نسخة المطبخ</span>
                    <Switch
                      checked={settings.kitchenPrint}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({ ...prev, kitchenPrint: Boolean(checked) }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-border bg-muted/60 p-3 text-foreground">
                    <span>طباعة الباركود على الفاتورة</span>
                    <Switch
                      checked={settings.barcode}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({ ...prev, barcode: Boolean(checked) }))
                      }
                    />
                  </div>
                </div>

                {/* Other Settings */}
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-muted/60 p-3">
                    <label className="mb-2 block text-sm text-muted-foreground">
                      حجم الخط
                    </label>
                    <div className="flex rounded-lg bg-background/80 p-1">
                      {["صغير", "متوسط", "كبير"].map((size) => (
                        <button
                          key={size}
                          onClick={() =>
                            setSettings({
                              ...settings,
                              fontSize: size as FontSize,
                            })
                          }
                          className={`flex-1 rounded-md py-1.5 text-sm transition-colors ${
                            settings.fontSize === size
                              ? "bg-foreground text-background shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/60 p-3">
                    <label className="mb-2 block text-sm text-muted-foreground">
                      الرسالة الختامية
                    </label>
                    <input
                      type="text"
                      value={settings.closingMessage}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          closingMessage: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-orange-500 focus:outline-none"
                      placeholder="رسالة تظهر أسفل الفاتورة..."
                    />
                  </div>

                  <div className="rounded-xl border border-border bg-muted/60 p-3">
                    <label className="mb-2 block text-sm text-muted-foreground">
                      شعار المطعم (يظهر أعلى الفاتورة)
                    </label>
                    <button className="w-full cursor-pointer rounded-lg border border-dashed border-border bg-background py-4 text-muted-foreground transition-all hover:border-orange-500/40 hover:bg-muted hover:text-foreground">
                      <ImagePlus className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                      <span className="text-sm">اضغط لرفع الشعار</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={handleSaveSettings} className="btn-primary px-6 py-2.5 rounded-xl">
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Receipt Preview */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 rounded-2xl sticky top-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Printer className="w-5 h-5 text-orange-400" />
                معاينة الفاتورة
              </h2>
              
              <div className="flex justify-center">
                {/* Paper Receipt Mockup */}
                <div className="bg-white text-black w-full max-w-[320px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform -rotate-1 hover:rotate-0 transition-transform duration-300 font-mono" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                  <div className={`flex flex-col text-center space-y-1 ${getFontSizeClass()}`}>
                    <div className="text-xl font-bold mb-1">🍔 ماي أوردر</div>
                    <div className="font-bold">كايرو برايم</div>
                    <div className="text-gray-500 text-xs mt-1 mb-2">━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                    
                    <div className="flex justify-between w-full">
                      <span>تاريخ:</span>
                      <span>2026/08/01</span>
                    </div>
                    <div className="flex justify-between w-full">
                      <span>وقت:</span>
                      <span>19:10</span>
                    </div>
                    <div className="flex justify-between w-full">
                      <span>رقم الأوردر:</span>
                      <span className="font-bold">ORD-1043</span>
                    </div>
                    <div className="flex justify-between w-full">
                      <span>نوع:</span>
                      <span>دليفري</span>
                    </div>
                    
                    <div className="text-gray-500 text-xs my-2">━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                    
                    {/* Items */}
                    <div className="flex flex-col space-y-1.5 w-full text-right">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2">
                          <span className="w-6 text-left">x2</span>
                          <span className="font-bold">برجر كايرو الخاص</span>
                        </div>
                        <span>170 ج</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2">
                          <span className="w-6 text-left">x1</span>
                          <span className="font-bold">كوكاكولا</span>
                        </div>
                        <span>25 ج</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2">
                          <span className="w-6 text-left">x1</span>
                          <span className="font-bold">صوص زيادة</span>
                        </div>
                        <span>5 ج</span>
                      </div>
                    </div>
                    
                    <div className="text-gray-500 text-xs my-2">━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                    
                    {/* Totals */}
                    <div className="flex justify-between w-full">
                      <span>المجموع:</span>
                      <span>200 ج</span>
                    </div>
                    <div className="flex justify-between w-full">
                      <span>توصيل:</span>
                      <span>15 ج</span>
                    </div>
                    <div className="flex justify-between w-full">
                      <span>خصم:</span>
                      <span>0 ج</span>
                    </div>
                    <div className="flex justify-between w-full font-bold mt-1 pt-1 border-t border-dashed border-gray-400">
                      <span>الإجمالي:</span>
                      <span>215 ج</span>
                    </div>
                    <div className="flex justify-between w-full mt-1">
                      <span>طريقة الدفع:</span>
                      <span>كاش</span>
                    </div>
                    
                    <div className="text-gray-500 text-xs my-2">━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                    
                    {/* Closing Message */}
                    <div className="text-center mt-2 whitespace-pre-wrap font-bold">
                      {settings.closingMessage || " "}
                    </div>

                    {settings.barcode && (
                      <div className="mt-4 flex flex-col items-center justify-center">
                        <div className="w-3/4 h-12 bg-black opacity-80" style={{ background: "repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 5px, transparent 5px, transparent 7px, #000 7px, #000 10px)" }}></div>
                        <span className="text-[10px] mt-1 tracking-widest">ORD-1043</span>
                      </div>
                    )}
                  </div>
                  {/* Jagged bottom edge effect */}
                  <div className="absolute bottom-[-10px] left-0 right-0 h-[10px] bg-white opacity-50" style={{
                      maskImage: "linear-gradient(to right, transparent, transparent), radial-gradient(circle at 50% 10px, transparent 10px, black 11px)",
                      maskSize: "100% 20px, 20px 20px",
                      maskRepeat: "no-repeat, repeat-x",
                      maskPosition: "top left, bottom left"
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Printer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
              <h3 className="text-lg font-bold text-white">إضافة طابعة جديدة</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  اسم الطابعة
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="مثال: طابعة الكاشير 2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  الموديل
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="مثال: Epson TM-T88VI"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  نوع الاتصال
                </label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none">
                  <option value="usb">USB</option>
                  <option value="network">شبكة (Network)</option>
                  <option value="bluetooth">بلوتوث (Bluetooth)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  عنوان IP (لطابعات الشبكة)
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="192.168.1.100"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-6 border-t border-slate-800 bg-slate-900/50">
              <button
                onClick={() => {
                  toast.success("تمت إضافة الطابعة بنجاح (محاكاة)");
                  setIsModalOpen(false);
                }}
                className="flex-1 btn-primary py-2.5 rounded-xl"
              >
                حفظ وإضافة
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
