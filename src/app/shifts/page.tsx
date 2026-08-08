"use client";

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Wallet, Plus, X, Receipt, Printer, 
  TrendingUp, CreditCard, Banknote, Clock, User, 
  CheckCircle, TrendingDown, DollarSign,
  Activity, ArrowDownToLine, ArrowUpToLine
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

// --- Types ---
interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string | null;
  cashier: string;
  startingCash: number;
  cashSales: number;
  visaSales: number;
  expenses: number;
  actualCash: number | null;
  difference: number | null;
  status: 'open' | 'closed';
}

// --- Mock Data ---
const MOCK_HISTORY: Shift[] = [
  {
    id: 'SH-1024',
    date: '2026-08-01',
    startTime: '08:00',
    endTime: '16:00',
    cashier: 'أحمد محمود',
    startingCash: 500,
    cashSales: 3240,
    visaSales: 1850,
    expenses: 120,
    actualCash: 3650,
    difference: 30, // 500 + 3240 - 120 = 3620 expected, actual 3650 -> +30
    status: 'closed',
  },
  {
    id: 'SH-1023',
    date: '2026-07-31',
    startTime: '16:00',
    endTime: '00:00',
    cashier: 'سارة علي',
    startingCash: 500,
    cashSales: 4100,
    visaSales: 2200,
    expenses: 200,
    actualCash: 4350,
    difference: -50, // 500 + 4100 - 200 = 4400 expected, actual 4350 -> -50
    status: 'closed',
  },
  {
    id: 'SH-1022',
    date: '2026-07-31',
    startTime: '08:00',
    endTime: '16:00',
    cashier: 'محمد حسن',
    startingCash: 500,
    cashSales: 2800,
    visaSales: 1200,
    expenses: 50,
    actualCash: 3250,
    difference: 0, 
    status: 'closed',
  },
  {
    id: 'SH-1021',
    date: '2026-07-30',
    startTime: '16:00',
    endTime: '00:00',
    cashier: 'أحمد محمود',
    startingCash: 500,
    cashSales: 3500,
    visaSales: 1500,
    expenses: 100,
    actualCash: 3910,
    difference: 10,
    status: 'closed',
  },
  {
    id: 'SH-1020',
    date: '2026-07-30',
    startTime: '08:00',
    endTime: '16:00',
    cashier: 'سارة علي',
    startingCash: 500,
    cashSales: 2100,
    visaSales: 900,
    expenses: 0,
    actualCash: 2580,
    difference: -20,
    status: 'closed',
  }
];

const INITIAL_CURRENT_SHIFT: Shift = {
  id: 'SH-1025',
  date: '2026-08-01',
  startTime: '16:00',
  endTime: null,
  cashier: 'محمد حسن',
  startingCash: 500,
  cashSales: 2850,
  visaSales: 1420,
  expenses: 150,
  actualCash: null,
  difference: null,
  status: 'open',
};

export default function ShiftsPage() {
  const [currentShift, setCurrentShift] = useState<Shift | null>(INITIAL_CURRENT_SHIFT);
  const [history, setHistory] = useState<Shift[]>(MOCK_HISTORY);
  
  // Modals state
  const [isNewShiftModalOpen, setIsNewShiftModalOpen] = useState(false);
  const [isZReportModalOpen, setIsZReportModalOpen] = useState(false);
  
  // New Shift form
  const [newCashierName, setNewCashierName] = useState('كاشير 1');
  const [newStartingCash, setNewStartingCash] = useState('500');

  // Z-Report form
  const [actualCashInput, setActualCashInput] = useState('');

  // Calculations for Z-Report
  const expectedCash = currentShift 
    ? (currentShift.startingCash + currentShift.cashSales - currentShift.expenses) 
    : 0;
  
  const difference = actualCashInput 
    ? (Number(actualCashInput) - expectedCash) 
    : null;

  const handleOpenShift = (e: React.FormEvent) => {
    e.preventDefault();
    const newShift: Shift = {
      id: `SH-${1026 + history.length}`,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      endTime: null,
      cashier: newCashierName,
      startingCash: Number(newStartingCash) || 0,
      cashSales: 0,
      visaSales: 0,
      expenses: 0,
      actualCash: null,
      difference: null,
      status: 'open',
    };
    setCurrentShift(newShift);
    setIsNewShiftModalOpen(false);
    toast.success('تم فتح الوردية بنجاح');
  };

  const handleCloseShift = () => {
    if (!currentShift || !actualCashInput) {
      toast.error('الرجاء إدخال الرصيد الفعلي');
      return;
    }
    
    const closedShift: Shift = {
      ...currentShift,
      endTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      actualCash: Number(actualCashInput),
      difference: difference,
      status: 'closed'
    };

    setHistory([closedShift, ...history]);
    setCurrentShift(null);
    setIsZReportModalOpen(false);
    setActualCashInput('');
    toast.success('تم إغلاق الوردية وحفظ التقرير');
  };

  const handlePrint = () => {
    toast.info('جاري الطباعة...');
  };

  return (
    <DashboardLayout>
      <Toaster position="top-center" theme="dark" richColors />
      
      <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <Wallet className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                إدارة الورديات (الكاشير)
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                متابعة حركة الدرج وتقارير التقفيل
              </p>
            </div>
          </div>
        </div>

        {/* Current Shift Card */}
        <div className={`panel-surface relative overflow-hidden rounded-2xl border transition-all duration-300 ${
          currentShift 
            ? 'border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)]' 
            : 'border-border/70'
        } p-6`}>
          {currentShift && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${
                currentShift ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-gray-500/20 border-gray-500/40 text-gray-400'
              }`}>
                {currentShift ? <Activity className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-foreground">
                    {currentShift ? 'الوردية الحالية: مفتوحة' : 'لا توجد وردية مفتوحة'}
                  </h2>
                  {currentShift && (
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {currentShift 
                    ? `تم الفتح بواسطة ${currentShift.cashier} الساعة ${currentShift.startTime}` 
                    : 'يجب فتح وردية جديدة لبدء استقبال الطلبات'}
                </p>
              </div>
            </div>

            {currentShift ? (
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">عهدة الدرج</p>
                  <p className="text-lg font-bold text-foreground">{currentShift.startingCash} ج.م</p>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">المبيعات الحالية</p>
                  <p className="text-lg font-bold text-orange-400">{currentShift.cashSales + currentShift.visaSales} ج.م</p>
                </div>
                <button
                  onClick={() => setIsZReportModalOpen(true)}
                  className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  <Receipt className="w-5 h-5" />
                  إغلاق الوردية
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsNewShiftModalOpen(true)}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
              >
                <Plus className="w-5 h-5" />
                فتح وردية جديدة
              </button>
            )}
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="surface-card rounded-2xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-1">مبيعات اليوم الكلية</p>
            <h3 className="text-2xl font-bold text-foreground">12,450 ج.م</h3>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <Banknote className="w-5 h-5" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">مبيعات الكاش</p>
            <h3 className="text-2xl font-bold text-white">8,200 ج.م</h3>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">مبيعات الفيزا</p>
            <h3 className="text-2xl font-bold text-white">4,250 ج.م</h3>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">عدد الورديات (اليوم)</p>
            <h3 className="text-2xl font-bold text-white">3</h3>
          </div>
        </div>

        {/* History Table */}
        <div className="data-table-shell">
          <div className="p-5 border-b border-border/70 bg-muted/40">
            <h3 className="text-lg font-bold text-foreground">سجل الورديات السابقة</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border/70">
                <tr>
                  <th className="p-4 font-medium">التاريخ / الوقت</th>
                  <th className="p-4 font-medium">الكاشير</th>
                  <th className="p-4 font-medium">عهدة الدرج</th>
                  <th className="p-4 font-medium">كاش</th>
                  <th className="p-4 font-medium">فيزا</th>
                  <th className="p-4 font-medium">مصروفات</th>
                  <th className="p-4 font-medium">الرصيد الفعلي</th>
                  <th className="p-4 font-medium">الفرق</th>
                  <th className="p-4 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 text-foreground">
                {history.map((shift) => (
                  <tr key={shift.id} className="hover:bg-muted/70 transition-colors">
                    <td className="p-4">
                      <div>{shift.date}</div>
                      <div className="text-muted-foreground text-xs">{shift.startTime} - {shift.endTime}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {shift.cashier}
                      </div>
                    </td>
                    <td className="p-4">{shift.startingCash} ج</td>
                    <td className="p-4">{shift.cashSales} ج</td>
                    <td className="p-4">{shift.visaSales} ج</td>
                    <td className="p-4 text-red-400">{shift.expenses} ج</td>
                    <td className="p-4 font-medium">{shift.actualCash} ج</td>
                    <td className="p-4">
                      {shift.difference !== null && shift.difference > 0 ? (
                        <span className="text-green-400 flex items-center gap-1">
                          <ArrowUpToLine className="w-3 h-3" /> +{shift.difference}
                        </span>
                      ) : shift.difference !== null && shift.difference < 0 ? (
                        <span className="text-red-400 flex items-center gap-1">
                          <ArrowDownToLine className="w-3 h-3" /> {shift.difference}
                        </span>
                      ) : (
                        <span className="text-gray-400">مظبوط</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium status-badge-danger">
                        مغلقة
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --- Modals --- */}
      
      {/* New Shift Modal */}
      {isNewShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-orange-400" />
                فتح وردية جديدة
              </h3>
              <button 
                onClick={() => setIsNewShiftModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleOpenShift} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">اسم الكاشير</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={newCashierName}
                    onChange={(e) => setNewCashierName(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    placeholder="ادخل اسم الكاشير"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">عهدة الدرج (ج.م)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={newStartingCash}
                    onChange={(e) => setNewStartingCash(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all font-mono"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  هذا هو المبلغ الموجود في الدرج قبل بدء أي مبيعات.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsNewShiftModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-orange-500/20"
                >
                  تأكيد الفتح
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Z-Report Modal */}
      {isZReportModalOpen && currentShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl my-8">
            
            <div className="p-6 bg-white/5">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <Receipt className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-widest uppercase">تقرير التقفيل</h3>
                <p className="text-gray-400 text-sm">Z - R E P O R T</p>
              </div>

              <div className="font-mono text-sm space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>الكاشير:</span>
                  <span className="text-white">{currentShift.cashier}</span>
                </div>
                <div className="flex justify-between">
                  <span>وقت الفتح:</span>
                  <span className="text-white">{currentShift.startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>وقت الإغلاق:</span>
                  <span className="text-white">{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                <div className="border-t border-dashed border-white/20 my-4 py-3 space-y-3">
                  <div className="flex justify-between">
                    <span>مبيعات كاش:</span>
                    <span className="text-white">{currentShift.cashSales} ج</span>
                  </div>
                  <div className="flex justify-between">
                    <span>مبيعات فيزا:</span>
                    <span className="text-white">{currentShift.visaSales} ج</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-1">
                    <span className="text-gray-200">إجمالي المبيعات:</span>
                    <span className="text-orange-400">{currentShift.cashSales + currentShift.visaSales} ج</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-white/20 py-3 space-y-3">
                  <div className="flex justify-between">
                    <span>عهدة الدرج:</span>
                    <span className="text-white">+{currentShift.startingCash} ج</span>
                  </div>
                  <div className="flex justify-between text-red-400">
                    <span>مصروفات جانبية:</span>
                    <span>-{currentShift.expenses} ج</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10 mt-2">
                    <span className="text-gray-200">الرصيد المتوقع:</span>
                    <span className="text-blue-400">{expectedCash} ج</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4 bg-black/40 p-4 rounded-xl border border-white/5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">الرصيد الفعلي بالدرج</label>
                  <input 
                    type="number" 
                    value={actualCashInput}
                    onChange={(e) => setActualCashInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-center text-xl font-bold text-white focus:outline-none focus:border-orange-500/50 transition-all font-mono"
                    placeholder="أدخل المبلغ المتاح"
                  />
                </div>

                {actualCashInput && difference !== null && (
                  <div className={`p-3 rounded-lg flex items-center justify-between font-bold ${
                    difference > 0 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    difference < 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }`}>
                    <span>الفرق:</span>
                    <div className="flex items-center gap-2">
                      {difference > 0 ? <TrendingUp className="w-5 h-5" /> : 
                       difference < 0 ? <TrendingDown className="w-5 h-5" /> : 
                       <CheckCircle className="w-5 h-5" />}
                      <span className="text-xl dir-ltr">{difference > 0 ? '+' : ''}{difference} ج</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setIsZReportModalOpen(false)}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  onClick={handlePrint}
                  className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleCloseShift}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-500/20"
                >
                  تقفيل نهائي
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
