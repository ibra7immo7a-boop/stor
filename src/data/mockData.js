export const permissionCatalog = {
  directPOS: "الكاشير المباشر",
  registerShifts: "إدارة الورديات",
  liveOrders: "الطلبات الحية",
  menuManagement: "إدارة المنيو",
  advancedReports: "التقارير المتقدمة",
  driverDelivery: "توصيل السائقين",
  printerSettings: "إعدادات الطباعة",
  messages: "الرسائل",
  staffManagement: "إدارة الموظفين",
};

export const permissionKeys = Object.keys(permissionCatalog);

export function buildPermissionMap(source = []) {
  const safeSource = Array.isArray(source) ? source : [];
  const map = {};

  permissionKeys.forEach((key) => {
    map[key] = safeSource.includes(key) || safeSource.includes("all") || safeSource.includes("super_admin");
  });

  return map;
}

export const mockUsers = [
  {
    id: "super-admin-1",
    name: "Super Admin",
    username: "super_admin",
    password: "superadmin123",
    branch: "الفرع الرئيسي",
    role: "admin",
    active: true,
    permissions: buildPermissionMap(permissionKeys),
    permissionNames: [...permissionKeys, "all", "super_admin"],
  },
  {
    id: "admin-1",
    name: "مدير المطعم",
    username: "admin",
    password: "admin123",
    branch: "الفرع الرئيسي",
    role: "admin",
    active: true,
    permissions: buildPermissionMap(permissionKeys),
    permissionNames: [...permissionKeys, "all", "admin"],
  },
  {
    id: "manager-1",
    name: "خالد الحربي",
    username: "manager",
    password: "manager123",
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
    },
    permissionNames: ["cashier", "orders", "menu", "reports", "messages"],
  },
  {
    id: "cashier-1",
    name: "عبد الرحمن أحمد",
    username: "cashier",
    password: "cashier123",
    branch: "فرع التحلية",
    role: "cashier",
    active: true,
    permissions: {
      directPOS: true,
      registerShifts: false,
      liveOrders: true,
      menuManagement: false,
      advancedReports: false,
      driverDelivery: false,
      printerSettings: false,
      messages: true,
      staffManagement: false,
    },
    permissionNames: ["cashier", "orders"],
  },
  {
    id: "cashier-2",
    name: "منى الدوسري",
    username: "disabled_cashier",
    password: "disabled123",
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
    },
    permissionNames: ["cashier", "orders"],
  },
];

export const defaultPermissions = {
  directPOS: true,
  registerShifts: true,
  liveOrders: true,
  menuManagement: false,
  advancedReports: false,
  driverDelivery: false,
  printerSettings: false,
  messages: true,
  staffManagement: false,
};
