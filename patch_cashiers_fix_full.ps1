$filePath = 'src/app/cashiers/page.tsx'
$content = @'
"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  ShieldCheck,
  UserPlus,
  Key,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  Building2,
  Users,
  UserCheck,
  ShieldAlert,
  Search,
  Check,
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { cn } from "@/lib/utils";

interface Permissions {
  directPOS: boolean;
  registerShifts: boolean;
  liveOrders: boolean;
  menuManagement: boolean;
  advancedReports: boolean;
  driverDelivery: boolean;
  printerSettings: boolean;
  messages: boolean;
  staffManagement: boolean;
}

interface StaffMember {
  id: string;
  name: string;
  username: string;
  branch: string;
  role: "admin" | "manager" | "cashier";
  active: boolean;
  permissions: Permissions;
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "1",
    name: "رائد محمد العتيبي",
    username: "raed_admin",
    branch: "الفرع الرئيسي",
    role: "admin",
    active: true,
    permissions: {
      directPOS: true,
      registerShifts: true,
      liveOrders: true,
      menuManagement: true,
      advancedReports: true,
      driverDelivery: true,
      printerSettings: true,
      messages: true,
      staffManagement: true,
    }
  },
  {
    id: "2",
    name: "خالد عبد الله الحربي",
    username: "khalid_mgr",
    branch: "فرع العليا",
    role: "manager",
    active: true,
    permissions: {
      directPOS: true,
      registerShifts: true,
      liveOrders: true,
      menuManagement: true,
      advancedReports: true,
      driverDelivery: true,
      printerSettings: true,
      messages: true,
      staffManagement: false,
    }
  },
  {
    id: "3",
    name: "عبد الرحمن أحمد علي",
    username: "abdo_cashier1",
    branch: "فرع التحلية",
    role: "cashier",
    active: true,
    permissions: {
      directPOS: true,
      registerShifts: true,
      liveOrders: true,
      menuManagement: false,
      advancedReports: false,
      driverDelivery: false,
      printerSettings: false,
      messages: true,
      staffManagement: false,
    }
  },
  {
    id: "4",
    name: "منى سعد الدوسري",
    username: "mona_cashier2",
    branch: "فرع الرياض",
    role: "cashier",
    active: false,
    permissions: {
      directPOS: true,
      registerShifts: false,
      liveOrders: true,
      menuManagement: false,
      advancedReports: false,
      driverDelivery: false,
      printerSettings: false,
      messages: false,
      staffManagement: false,
    }
  }
];

export default function CashiersManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);

  const [formName, setFormName] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formRole, setFormRole] = useState<"admin" | "manager" | "cashier">("cashier");
  const [formBranch, setFormBranch] = useState("الفرع الرئيسي");
  const [formPermissions, setFormPermissions] = useState<Permissions>({
    directPOS: true,
    registerShifts: true,
    liveOrders: true,
    menuManagement: false,
    advancedReports: false,
    driverDelivery: false,
    printerSettings: false,
    messages: false,
    staffManagement: false,
  });

  const totalStaff = staff.length;
  const activeStaff = staff.filter(s => s.active).length;
  const adminManagerStaff = staff.filter(s => s.role === "admin" || s.role === "manager").length;

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setFormName("");
    setFormUsername("");
    setFormPassword("");
    setFormRole("cashier");
    setFormBranch("الفرع الرئيسي");
    setFormPermissions({
      directPOS: true,
      registerShifts: true,
      liveOrders: true,
      menuManagement: false,
      advancedReports: false,
      driverDelivery: false,
      printerSettings: false,
      messages: false,
      staffManagement: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: StaffMember) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormUsername(member.username);
    setFormPassword("");
    setFormRole(member.role);
    setFormBranch(member.branch);
    setFormPermissions({ ...member.permissions });
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: string) => {
    setStaff(prev => prev.map(member => {
      if (member.id === id) {
        const nextState = !member.active;
        toast.info(
          nextState ? `تم تفعيل حساب ${member.name} 🟢` : `تم تعطيل حساب ${member.name} 🔴`,
          { style: { background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#60a5fa" } }
        );
        return { ...member, active: nextState };
      }
      return member;
    }));
  };

  const handleDeleteMember = (id: string) => {
    const member = staff.find(s => s.id === id);
    if (!member) return;

    setStaff(prev => prev.filter(s => s.id !== id));
    toast.error(`تم حذف الحساب ${member.name} بنجاح 🗑️`, {
      style: { background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#f87171" }
    });
  };

  const handleSaveMember = () => {
    if (!formName.trim() || !formUsername.trim()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة ⚠️");
      return;
    }

    if (editingMember) {
      setStaff(prev => prev.map(member => {
        if (member.id === editingMember.id) {
          return {
            ...member,
            name: formName.trim(),
            username: formUsername.trim(),
            branch: formBranch,
            role: formRole,
            permissions: formPermissions
          };
        }
        return member;
      }));
      toast.success("تم تحديث بيانات الموظف بنجاح 🎉", {
        style: { background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#34d399" }
      });
    } else {
      const newMember: StaffMember = {
        id: Math.random().toString(),
        name: formName.trim(),
        username: formUsername.trim(),
        branch: formBranch,
        role: formRole,
        active: true,
        permissions: formPermissions
      };
      setStaff(prev => [...prev, newMember]);
      toast.success("تم إضافة الموظف الجديد بنجاح 👥", {
        style: { background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#34d399" }
      });
    }

    setIsModalOpen(false);
  };

  const handleRoleChange = (role: "admin" | "manager" | "cashier") => {
    setFormRole(role);
    if (role === "admin") {
      setFormPermissions({
        directPOS: true,
        registerShifts: true,
        liveOrders: true,
        menuManagement: true,
        advancedReports: true,
        driverDelivery: true,
        printerSettings: true,
        messages: true,
        staffManagement: true,
      });
    } else if (role === "manager") {
      setFormPermissions({
        directPOS: true,
        registerShifts: true,
        liveOrders: true,
        menuManagement: true,
        advancedReports: true,
        driverDelivery: true,
        printerSettings: true,
        messages: true,
        staffManagement: false,
      });
    } else {
      setFormPermissions({
        directPOS: true,
        registerShifts: true,
        liveOrders: true,
        menuManagement: false,
        advancedReports: false,
        driverDelivery: false,
        printerSettings: false,
        messages: true,
        staffManagement: false,
      });
    }
  };

  const filteredStaff = staff.filter(member =>
    member.name.includes(searchQuery) ||
    member.username.includes(searchQuery)
  );

  return (
    <DashboardLayout>
      <Toaster position="top-center" />
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="panel-surface p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-orange-500" />
              إدارة الموظفين وصلاحيات الكاشير
            </h1>
            <p className="text-muted-foreground text-sm mt-1">تعديل الصلاحيات، إضافة كاشير جديد، ومراقبة حالة الموظفين النشطين.</p>
          </div>
          <Button
            onClick={handleOpenAddModal}
            className="rounded-2xl gap-2 font-bold py-5 px-6 transition-all hover:scale-105 active:scale-95 text-white"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              boxShadow: "0 8px 25px rgba(249, 115, 22, 0.3)"
            }}
          >
            <UserPlus className="w-4.5 h-4.5" />
            إضافة موظف جديد
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "إجمالي الموظفين", value: totalStaff, sub: "حسابات مسجلة بالكامل", icon: Users, color: "text-blue-400", bg: "from-blue-500/10 to-transparent" },
            { title: "الموظفين النشطين", value: activeStaff, sub: `${activeStaff} حساب يستقبل العمل حالياً`, icon: UserCheck, color: "text-emerald-400", bg: "from-emerald-500/10 to-transparent" },
            { title: "حسابات الإدارة / الملاك", value: adminManagerStaff, sub: "درجة مسؤولين ومدراء نظام", icon: ShieldAlert, color: "text-amber-400", bg: "from-amber-500/10 to-transparent" },
          ].map((kpi, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/70 bg-card/80 p-4 relative overflow-hidden shadow-sm"
            >
              <div className={cn("absolute -top-12 -right-12 w-24 h-24 rounded-full opacity-[0.03] blur-xl bg-gradient-to-tr", kpi.color.replace("text-", "bg-"))} />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs font-bold">{kpi.title}</p>
                  <p className="text-2xl font-black text-foreground mt-1.5">{kpi.value}</p>
                  <p className="text-muted-foreground text-[10px] mt-1">{kpi.sub}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center", kpi.color)}>
                  <kpi.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="panel-surface overflow-hidden">
          <div className="p-5 border-b border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/40">
            <h3 className="text-foreground font-bold text-sm">قائمة حسابات الموظفين</h3>
            <div className="relative max-w-xs w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <Input
                type="text"
                placeholder="ابحث باسم الموظف أو المستخدم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background/80 border-border rounded-xl pr-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-orange-500/50 focus:ring-0 focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-950/40">
                <TableRow className="border-b border-white/5 hover:bg-transparent">
                  <TableHead className="text-slate-400 font-bold text-xs text-right">الموظف</TableHead>
                  <TableHead className="text-slate-400 font-bold text-xs text-right">اسم المستخدم</TableHead>
                  <TableHead className="text-slate-400 font-bold text-xs text-right">الرتبة</TableHead>
                  <TableHead className="text-slate-400 font-bold text-xs text-right">الصفحات المصرحة</TableHead>
                  <TableHead className="text-slate-400 font-bold text-xs text-center">حالة الحساب</TableHead>
                  <TableHead className="text-slate-400 font-bold text-xs text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-500 text-xs">
                      لا يوجد موظفين مسجلين حالياً يطابقون استعلامك.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((member) => (
                    <TableRow 
                      key={member.id} 
                      className="border-b border-white/5 hover:bg-white/[0.01] transition-colors"
                    >
                      <TableCell className="font-bold text-slate-200 text-xs py-4">
                        {member.name}
                      </TableCell>
                      <TableCell className="text-slate-400 font-mono text-xs">
                        {member.username}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={cn(
                            "rounded-lg font-bold text-[10px] px-2 py-0.5",
                            member.role === "admin" && "bg-red-500/10 text-red-400 border border-red-500/20",
                            member.role === "manager" && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                            member.role === "cashier" && "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                          )}
                        >
                          {member.role === "admin" ? "مسؤول نظام" : member.role === "manager" ? "مدير فرع" : "كاشير"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {member.permissions.directPOS && (
                            <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/15 text-[9px] rounded-md font-semibold">
                              الكاشير
                            </Badge>
                          )}
                          {member.permissions.registerShifts && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 text-[9px] rounded-md font-semibold">
                              ورديات
                            </Badge>
                          )}
                          {member.permissions.liveOrders && (
                            <Badge className="bg-sky-500/10 text-sky-400 border border-sky-500/15 text-[9px] rounded-md font-semibold">
                              الطلبات
                            </Badge>
                          )}
                          {member.permissions.menuManagement && (
                            <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/15 text-[9px] rounded-md font-semibold">
                              المنيو
                            </Badge>
                          )}
                          {member.permissions.advancedReports && (
                            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/15 text-[9px] rounded-md font-semibold">
                              التقارير
                            </Badge>
                          )}
                          {member.permissions.driverDelivery && (
                            <Badge className="bg-violet-500/10 text-violet-400 border border-violet-500/15 text-[9px] rounded-md font-semibold">
                              التوصيل
                            </Badge>
                          )}
                          {member.permissions.printerSettings && (
                            <Badge className="bg-slate-500/10 text-slate-300 border border-slate-500/15 text-[9px] rounded-md font-semibold">
                              الطباعة
                            </Badge>
                          )}
                          {member.permissions.messages && (
                            <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/15 text-[9px] rounded-md font-semibold">
                              الرسائل
                            </Badge>
                          )}
                          {member.permissions.staffManagement && (
                            <Badge className="bg-red-500/10 text-red-400 border border-red-500/15 text-[9px] rounded-md font-semibold">
                              الموظفين
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={member.active}
                            onCheckedChange={() => handleToggleActive(member.id)}
                          />
                          <span className={cn(
                            "text-[10px] font-bold min-w-8",
                            member.active ? "text-emerald-400" : "text-red-400"
                          )}>
                            {member.active ? "نشط" : "معطل"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(member)}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all hover:bg-white/10 flex items-center justify-center"
                            title="تعديل الموظف"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            disabled={member.role === "admin" && staff.filter(s => s.role === "admin").length <= 1}
                            className="w-8 h-8 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 hover:text-red-300 transition-all hover:bg-red-500/15 flex items-center justify-center disabled:opacity-40"
                            title="حذف الحساب"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent 
          className="max-w-md bg-slate-950 border-slate-800 text-slate-200 shadow-2xl p-0 overflow-hidden rounded-3xl"
          dir="rtl"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/5">
            <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
              {editingMember ? <Edit className="w-5 h-5 text-orange-500" /> : <UserPlus className="w-5 h-5 text-orange-500" />}
              {editingMember ? "تعديل حساب موظف" : "إضافة موظف جديد لنظام الكاشير"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs mt-1">
              أدخل البيانات الأساسية للموظف وحدد مستويات صلاحيات الوصول المطلوبة.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto scrollbar-thin">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-400 font-bold">اسم الموظف الثلاثي <span className="text-red-400">*</span></Label>
              <Input
                type="text"
                placeholder="مثال: صالح أحمد الزهراني"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="bg-slate-900 border-slate-800 rounded-xl text-white text-xs placeholder-slate-600 focus:border-orange-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400 font-bold">اسم المستخدم Username <span className="text-red-400">*</span></Label>
                <Input
                  type="text"
                  placeholder="saleh_123"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="bg-slate-900 border-slate-800 rounded-xl text-white text-xs placeholder-slate-600 focus:border-orange-500/50 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400 font-bold">الفرع التابع له الموظف</Label>
                <select
                  value={formBranch}
                  onChange={(e) => setFormBranch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl text-white text-xs px-3 py-2 focus:border-orange-500/50"
                >
                  <option value="الفرع الرئيسي">الفرع الرئيسي</option>
                  <option value="فرع العليا">فرع العليا</option>
                  <option value="فرع التحلية">فرع التحلية</option>
                  <option value="فرع الرياض">فرع الرياض</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400 font-bold">
                  {editingMember ? "كلمة مرور جديدة (اتركه فارغاً للإبقاء على الحالية)" : "كلمة المرور"}
                  {!editingMember && <span className="text-red-400">*</span>}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="bg-slate-900 border-slate-800 rounded-xl text-white text-xs placeholder-slate-600 focus:border-orange-500/50 pr-4 pl-10"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-400 font-bold">الرتبة الوظيفية (تطبيق الصلاحيات السريعة)</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "cashier", label: "كاشير" },
                  { value: "manager", label: "مدير فرع" },
                  { value: "admin", label: "مسؤول نظام" },
                ].map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => handleRoleChange(r.value as any)}
                    className={cn(
                      "py-2 px-3 text-xs font-bold border rounded-xl transition-all",
                      formRole === r.value
                        ? "bg-orange-500/10 border-orange-500/50 text-orange-400"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/5 my-2" />

            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300">أذونات الوصول للصفحات:</h4>

              {[
                { key: "directPOS", label: "واجهة الكاشير", desc: "الوصول المباشر إلى شاشة نقطة البيع" },
                { key: "registerShifts", label: "إدارة الورديات", desc: "فتح وإغلاق ورديات العمل وتسجيل ساعات الموظفين" },
                { key: "liveOrders", label: "الطلبات الحية", desc: "استعراض ومتابعة الطلبات المفتوحة فوراً" },
                { key: "menuManagement", label: "إدارة المنيو", desc: "تعديل وإضافة الوجبات والأسعار والأقسام" },
                { key: "advancedReports", label: "التقارير المتقدمة", desc: "مشاهدة وتحليل المبيعات والإيرادات اليومية" },
                { key: "driverDelivery", label: "إدارة التوصيل", desc: "متابعة طلبات التوصيل وسجلات السائقين" },
                { key: "printerSettings", label: "إعدادات الطباعة", desc: "إدارة الطابعات والفواتير والتقارير المطبوعه" },
                { key: "messages", label: "سجل الرسائل", desc: "محادثة العملاء وتصفح سجل الدعم الفني" },
                { key: "staffManagement", label: "إدارة الموظفين والصلاحيات", desc: "إضافة وتعديل صلاحيات زملائه الموظفين" },
              ].map(perm => (
                <div key={perm.key} className="flex items-start justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                  <div className="space-y-0.5 max-w-[80%]">
                    <p className="text-xs font-bold text-white">{perm.label}</p>
                    <p className="text-[10px] text-slate-500 leading-normal">{perm.desc}</p>
                  </div>
                  <Switch
                    checked={(formPermissions as any)[perm.key]}
                    disabled={formRole === "admin"}
                    onCheckedChange={(checked) => setFormPermissions(prev => ({ ...prev, [perm.key]: checked }))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-900/40 border-t border-white/5 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-bold py-4 px-5"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSaveMember}
              className="rounded-xl text-white text-xs font-bold py-4 px-6 hover:scale-105 active:scale-95 transition-all"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                boxShadow: "0 4px 15px rgba(249, 115, 22, 0.3)"
              }}
            >
              حفظ التغييرات
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
'@
Set-Content -Path $filePath -Value $content -Encoding utf8
Write-Host 'rewrote file'
