"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  MapPin,
  Plus,
  TrendingUp,
  Map,
  DollarSign,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// Interfaces
interface Zone {
  id: string;
  name: string;
  fee: number;
  minOrder: number;
  distance: string;
  isActive: boolean;
}

// Mock Data
const INITIAL_ZONES: Zone[] = [
  { id: "1", name: "وسط المدينة", fee: 10, minOrder: 80, distance: "0-3 كم", isActive: true },
  { id: "2", name: "مدينة نصر", fee: 15, minOrder: 100, distance: "3-8 كم", isActive: true },
  { id: "3", name: "المعادي", fee: 20, minOrder: 120, distance: "5-10 كم", isActive: true },
  { id: "4", name: "التجمع الخامس", fee: 30, minOrder: 150, distance: "15-25 كم", isActive: true },
  { id: "5", name: "الهرم", fee: 25, minOrder: 120, distance: "10-15 كم", isActive: true },
  { id: "6", name: "الإسكندرية", fee: 50, minOrder: 200, distance: "+150 كم", isActive: false },
  { id: "7", name: "القرى المجاورة", fee: 25, minOrder: 100, distance: "10-20 كم", isActive: true },
];

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  // Stats calculation
  const activeZonesCount = zones.filter((z) => z.isActive).length;
  const avgDeliveryFee = Math.round(
    zones.reduce((sum, z) => sum + z.fee, 0) / (zones.length || 1)
  );
  const maxMinOrder = Math.max(...zones.map((z) => z.minOrder));

  // Toggle status
  const toggleZoneStatus = (id: string, name: string, currentStatus: boolean) => {
    setZones((prev) =>
      prev.map((zone) =>
        zone.id === id ? { ...zone, isActive: !zone.isActive } : zone
      )
    );
    toast.success(
      `تم ${!currentStatus ? "تفعيل" : "إيقاف"} منطقة ${name} بنجاح`
    );
  };

  // Delete
  const deleteZone = (id: string, name: string) => {
    setZones((prev) => prev.filter((zone) => zone.id !== id));
    toast.error(`تم حذف منطقة ${name}`);
  };

  // Modal Handlers
  const handleOpenModal = (zone?: Zone) => {
    if (zone) {
      setEditingZone(zone);
    } else {
      setEditingZone({
        id: "",
        name: "",
        fee: 0,
        minOrder: 0,
        distance: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveZone = () => {
    if (!editingZone || !editingZone.name) {
      toast.error("يرجى إدخال اسم المنطقة");
      return;
    }

    if (editingZone.id) {
      // Edit
      setZones((prev) =>
        prev.map((zone) => (zone.id === editingZone.id ? editingZone : zone))
      );
      toast.success("تم تحديث بيانات المنطقة بنجاح");
    } else {
      // Add
      const newZone = {
        ...editingZone,
        id: Math.random().toString(36).substr(2, 9),
      };
      setZones((prev) => [newZone, ...prev]);
      toast.success("تم إضافة المنطقة بنجاح");
    }
    setIsModalOpen(false);
    setEditingZone(null);
  };

  return (
    <DashboardLayout>
      <Toaster position="top-center" theme="dark" />
      <div className="space-y-6 page-enter" dir="rtl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <MapPin className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                مناطق وسياسات <span className="gradient-text">التوصيل</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                إدارة مناطق التوصيل، الرسوم، والحد الأدنى للطلبات
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl glow-orange"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة منطقة جديدة</span>
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 flex items-center gap-4 card-hover">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">عدد المناطق النشطة</p>
              <h3 className="text-2xl font-bold text-foreground">
                {activeZonesCount}
              </h3>
            </div>
          </div>
          <div className="surface-card p-6 flex items-center gap-4 card-hover">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">متوسط سعر التوصيل</p>
              <h3 className="text-2xl font-bold text-foreground">
                {avgDeliveryFee} ج
              </h3>
            </div>
          </div>
          <div className="surface-card p-6 flex items-center gap-4 card-hover">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">أعلى حد أدنى</p>
              <h3 className="text-2xl font-bold text-foreground">
                {maxMinOrder} ج
              </h3>
            </div>
          </div>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`panel-soft p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 ${
                zone.isActive
                  ? "border border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                  : "opacity-75 border-border/70 hover:border-border grayscale-[0.2]"
              }`}
            >
              {!zone.isActive && (
                <div className="absolute top-4 left-4 metric-pill px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur-sm z-10">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-foreground">موقوف</span>
                </div>
              )}

              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  {zone.name}
                </h3>
                {zone.isActive && (
                  <div className="status-badge-success px-3 py-1 rounded-full flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">نشط</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="metric-pill p-3 rounded-xl">
                  <p className="text-muted-foreground text-xs mb-1">رسوم التوصيل</p>
                  <p className="text-orange-600 dark:text-orange-400 font-bold text-lg">
                    {zone.fee} ج
                  </p>
                </div>
                <div className="metric-pill p-3 rounded-xl">
                  <p className="text-muted-foreground text-xs mb-1">الحد الأدنى للطلب</p>
                  <p className="text-foreground font-bold text-lg">
                    {zone.minOrder} ج
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-foreground/80 bg-muted/60 p-2 rounded-lg border border-border/60">
                <Map className="w-4 h-4 text-gray-400" />
                <span className="text-sm">المسافة التقديرية: {zone.distance}</span>
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/70">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">حالة المنطقة:</span>
                  <button
                    onClick={() =>
                      toggleZoneStatus(zone.id, zone.name, zone.isActive)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${zone.isActive ? "bg-green-500" : "bg-gray-600"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        zone.isActive ? "translate-x-1" : "translate-x-6"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(zone)}
                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteZone(zone.id, zone.name)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editingZone && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          dir="rtl"
        >
          <div className="bg-[#0b1221] border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">
                {editingZone.id ? "تعديل المنطقة" : "إضافة منطقة جديدة"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  اسم المنطقة
                </label>
                <input
                  type="text"
                  value={editingZone.name}
                  onChange={(e) =>
                    setEditingZone({ ...editingZone, name: e.target.value })
                  }
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="مثال: وسط المدينة"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    رسوم التوصيل (ج)
                  </label>
                  <input
                    type="number"
                    value={editingZone.fee || ""}
                    onChange={(e) =>
                      setEditingZone({
                        ...editingZone,
                        fee: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    الحد الأدنى للطلب (ج)
                  </label>
                  <input
                    type="number"
                    value={editingZone.minOrder || ""}
                    onChange={(e) =>
                      setEditingZone({
                        ...editingZone,
                        minOrder: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  المسافة التقديرية
                </label>
                <input
                  type="text"
                  value={editingZone.distance}
                  onChange={(e) =>
                    setEditingZone({
                      ...editingZone,
                      distance: e.target.value,
                    })
                  }
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="مثال: 5-10 كم"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-gray-300 font-medium">حالة المنطقة</span>
                <button
                  onClick={() =>
                    setEditingZone({
                      ...editingZone,
                      isActive: !editingZone.isActive,
                    })
                  }
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                    editingZone.isActive ? "bg-green-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      editingZone.isActive ? "translate-x-1" : "translate-x-6"
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 bg-[#060b18]/50 flex gap-4">
              <button
                onClick={handleSaveZone}
                className="btn-primary flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 glow-orange"
              >
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات</span>
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-semibold hover:bg-gray-700 transition-colors"
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
