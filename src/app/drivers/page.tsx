"use client";

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Users, 
  Bike, 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Search,
  Pencil,
  Package,
  X
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

// Types
type DriverStatus = 'متاح' | 'في أوردر' | 'غير نشط';

interface Driver {
  id: string;
  name: string;
  phone: string;
  status: DriverStatus;
  todayDeliveries: number;
  rating: number;
  lastActivity: string;
}

interface Order {
  id: string;
  customer: string;
  area: string;
}

// Mock Data
const initialDrivers: Driver[] = [
  { id: '1', name: 'أحمد علي', phone: '01012345678', status: 'متاح', todayDeliveries: 5, rating: 4.9, lastActivity: 'منذ 10 دقائق' },
  { id: '2', name: 'محمد حسن', phone: '01023456789', status: 'في أوردر', todayDeliveries: 7, rating: 4.7, lastActivity: 'الآن' },
  { id: '3', name: 'كريم عبدالله', phone: '01034567890', status: 'في أوردر', todayDeliveries: 3, rating: 4.8, lastActivity: 'الآن' },
  { id: '4', name: 'عمر الشافعي', phone: '01045678901', status: 'متاح', todayDeliveries: 9, rating: 4.6, lastActivity: 'منذ 15 دقيقة' },
  { id: '5', name: 'يوسف إبراهيم', phone: '01056789012', status: 'في أوردر', todayDeliveries: 6, rating: 4.9, lastActivity: 'الآن' },
  { id: '6', name: 'مصطفى محمود', phone: '01067890123', status: 'في أوردر', todayDeliveries: 4, rating: 4.5, lastActivity: 'الآن' },
  { id: '7', name: 'علي عبدالرحمن', phone: '01078901234', status: 'متاح', todayDeliveries: 8, rating: 4.8, lastActivity: 'منذ 5 دقائق' },
  { id: '8', name: 'سامي الدسوقي', phone: '01089012345', status: 'غير نشط', todayDeliveries: 0, rating: 4.3, lastActivity: 'منذ 4 ساعات' },
];

const mockOrders: Order[] = [
  { id: 'ORD-1043', customer: 'عمرو عبدالفتاح', area: 'القاهرة الجديدة' },
  { id: 'ORD-1044', customer: 'منى السعيد', area: 'مدينة نصر' },
  { id: 'ORD-1045', customer: 'طارق يحيى', area: 'المعادي' },
];

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDriverForAssign, setSelectedDriverForAssign] = useState<Driver | null>(null);
  
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Derived state
  const filteredDrivers = drivers.filter(d => 
    d.name.includes(searchTerm) || d.phone.includes(searchTerm)
  );

  const totalDrivers = drivers.length;
  const availableDrivers = drivers.filter(d => d.status === 'متاح').length;
  const onTaskDrivers = drivers.filter(d => d.status === 'في أوردر').length;
  const inactiveDrivers = drivers.filter(d => d.status === 'غير نشط').length;

  const handleStatusChange = (driverId: string, newStatus: DriverStatus) => {
    setDrivers(drivers.map(d => 
      d.id === driverId ? { ...d, status: newStatus } : d
    ));
    toast.success(`تم تغيير حالة السائق بنجاح`);
  };

  const handleAssignOrder = (orderId: string) => {
    if (selectedDriverForAssign) {
      handleStatusChange(selectedDriverForAssign.id, 'في أوردر');
      toast.success(`تم تعيين الأوردر ${orderId} للطيار ${selectedDriverForAssign.name}`);
      setIsAssignModalOpen(false);
      setSelectedDriverForAssign(null);
    }
  };

  const openAssignModal = (driver: Driver) => {
    setSelectedDriverForAssign(driver);
    setIsAssignModalOpen(true);
  };

  const openDriverModal = (driver: Driver | null = null) => {
    setEditingDriver(driver);
    setIsDriverModalOpen(true);
  };

  const handleSaveDriver = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(editingDriver ? 'تم تحديث بيانات السائق' : 'تم إضافة السائق بنجاح');
    setIsDriverModalOpen(false);
  };

  const getStatusBadge = (status: DriverStatus) => {
    switch (status) {
      case 'متاح':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">متاح</span>;
      case 'في أوردر':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">في أوردر</span>;
      case 'غير نشط':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/20 text-slate-400 border border-slate-500/30">غير نشط</span>;
    }
  };

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  return (
    <DashboardLayout>
      <Toaster position="top-center" richColors theme="dark" />
      
      <div className="space-y-6 page-enter">
        
        {/* Header */}
        <div className="panel-surface p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30 text-orange-500">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">إدارة الطيارين</h1>
              <p className="text-sm text-muted-foreground mt-1">تتبع وتعيين الطلبات لأسطول التوصيل الخاص بك</p>
            </div>
          </div>
          <button 
            onClick={() => openDriverModal()}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة سائق جديد</span>
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="panel-soft p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">إجمالي السائقين</p>
              <h3 className="text-3xl font-bold text-foreground">{totalDrivers}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div>
              <p className="text-sm text-emerald-400 mb-1">متاح الآن</p>
              <h3 className="text-3xl font-bold text-white">{availableDrivers}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-amber-500/20 flex items-center justify-between shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <div>
              <p className="text-sm text-amber-400 mb-1">في مهمة</p>
              <h3 className="text-3xl font-bold text-white">{onTaskDrivers}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">غير نشط</p>
              <h3 className="text-3xl font-bold text-white">{inactiveDrivers}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-500/20 text-slate-400 flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="panel-soft p-4 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث بالاسم أو رقم الهاتف..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background/70 border border-border/70 rounded-xl py-2.5 pr-10 pl-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="bg-background/70 border border-border/70 rounded-xl py-2.5 px-4 text-foreground focus:outline-none appearance-none cursor-pointer w-full sm:w-auto">
              <option value="all">كل الحالات</option>
              <option value="available">متاح</option>
              <option value="ontask">في أوردر</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
        </div>

        {/* Drivers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDrivers.map(driver => (
            <div key={driver.id} className="glass-card p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all card-hover group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                    ${driver.status === 'متاح' ? 'bg-emerald-500/20 text-emerald-400' : 
                      driver.status === 'في أوردر' ? 'bg-amber-500/20 text-amber-400' : 
                      'bg-slate-500/20 text-slate-400'}
                  `}>
                    {getAvatarInitials(driver.name)}
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">{driver.name}</h3>
                    <div className="flex items-center gap-1 text-slate-400 text-sm mt-0.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span dir="ltr">{driver.phone}</span>
                    </div>
                  </div>
                </div>
                <div>
                  {getStatusBadge(driver.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5 py-3 border-y border-white/5">
                <div>
                  <p className="text-xs text-slate-400 mb-1">توصيلات اليوم</p>
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <Package className="w-4 h-4 text-orange-400" />
                    <span>{driver.todayDeliveries}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">التقييم</p>
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>{driver.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 text-sm text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{driver.lastActivity}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => openAssignModal(driver)}
                  disabled={driver.status !== 'متاح'}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors
                    ${driver.status === 'متاح' 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20' 
                      : 'bg-white/5 text-slate-500 cursor-not-allowed'
                    }
                  `}
                >
                  تعيين أوردر
                </button>
                <button 
                  onClick={() => openDriverModal(driver)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Assign Order Modal */}
      {isAssignModalOpen && selectedDriverForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                تعيين أوردر للطيار <span className="text-orange-400">{selectedDriverForAssign.name}</span>
              </h3>
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              {mockOrders.length === 0 ? (
                <div className="text-center py-8 text-slate-400">لا توجد طلبات جاهزة للتوصيل</div>
              ) : (
                mockOrders.map(order => (
                  <div 
                    key={order.id} 
                    className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group flex justify-between items-center"
                    onClick={() => handleAssignOrder(order.id)}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">{order.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">جاهز</span>
                      </div>
                      <p className="text-sm text-slate-300">{order.customer}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{order.area}</span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors text-sm font-medium">
                      اختيار
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Driver Modal */}
      {isDriverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                {editingDriver ? 'تعديل بيانات السائق' : 'إضافة سائق جديد'}
              </h3>
              <button 
                onClick={() => setIsDriverModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveDriver} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">اسم السائق</label>
                <input 
                  type="text" 
                  defaultValue={editingDriver?.name || ''}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
                  placeholder="مثال: أحمد علي"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">رقم الهاتف</label>
                <input 
                  type="tel" 
                  defaultValue={editingDriver?.phone || ''}
                  required
                  dir="ltr"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-right focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
                  placeholder="01xxxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">رقم الموتوسيكل / اللوحة</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
                  placeholder="مثال: أ ب ج 123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">تاريخ الانضمام</label>
                <input 
                  type="date" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
                />
              </div>
              
              {editingDriver && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">حالة السائق</label>
                  <select 
                    defaultValue={editingDriver.status}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 appearance-none"
                  >
                    <option value="متاح">متاح</option>
                    <option value="في أوردر">في أوردر</option>
                    <option value="غير نشط">غير نشط</option>
                  </select>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-xl transition-colors shadow-lg shadow-orange-500/20"
                >
                  حفظ البيانات
                </button>
                <button 
                  type="button"
                  onClick={() => setIsDriverModalOpen(false)}
                  className="px-6 bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 rounded-xl transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
