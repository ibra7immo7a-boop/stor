// =============================================
// البيانات التجريبية — مطعم كايرو برايم 🇪🇬
// =============================================

export type OrderStatus = "new" | "preparing" | "ready" | "delivered" | "cancelled";
export type OrderType = "delivery" | "pickup";
export type PaymentMethod = "cash" | "card" | "online";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  extras?: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  type: OrderType;
  createdAt: Date;
  customer: {
    name: string;
    phone: string;
    address?: string;
  };
  items: OrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "101",
    orderNumber: "ORD-1043",
    status: "new",
    type: "delivery",
    createdAt: new Date(Date.now() - 24 * 60 * 1000), // 24 mins ago (delayed!)
    customer: {
      name: "مصطفى محمود كمال",
      phone: "01099887766",
      address: "الشروق، المنطقة الأولى، عمارة 88",
    },
    items: [
      {
        id: "i100",
        name: "ريش ضاني مشوية",
        quantity: 1,
        price: 850,
        extras: ["ميديوم رير"],
      },
    ],
    total: 850,
    paymentMethod: "cash",
  },
  {
    id: "1",
    orderNumber: "ORD-1042",
    status: "new",
    type: "delivery",
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
    customer: {
      name: "أحمد محمد السيد",
      phone: "01012345678",
      address: "التجمع الخامس، شارع التسعين، برج النيل، شقة 14",
    },
    items: [
      {
        id: "i1",
        name: "برجر كايرو الخاص",
        quantity: 2,
        price: 185,
        extras: ["جبنة موزاريلا زيادة", "صوص تريفل"],
      },
      {
        id: "i2",
        name: "بطاطس مقلية كبير",
        quantity: 2,
        price: 65,
      },
      {
        id: "i3",
        name: "عصير مانجو طازج",
        quantity: 2,
        price: 75,
      },
    ],
    total: 650,
    paymentMethod: "cash",
  },
  {
    id: "2",
    orderNumber: "ORD-1041",
    status: "new",
    type: "pickup",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    customer: {
      name: "سارة خالد إبراهيم",
      phone: "01198765432",
    },
    items: [
      {
        id: "i4",
        name: "دجاج مشوي على الفحم",
        quantity: 1,
        price: 320,
        extras: ["بدون بصل", "صوص ثوم زيادة"],
      },
      {
        id: "i5",
        name: "سلطة فتوش",
        quantity: 1,
        price: 85,
      },
    ],
    total: 405,
    paymentMethod: "card",
  },
  {
    id: "3",
    orderNumber: "ORD-1040",
    status: "preparing",
    type: "delivery",
    createdAt: new Date(Date.now() - 12 * 60 * 1000),
    customer: {
      name: "خالد محمود عبدالله",
      phone: "01234567890",
      address: "مدينة نصر، شارع عباس العقاد، عمارة 7، شقة 3",
    },
    items: [
      {
        id: "i6",
        name: "بيتزا مارغريتا كبيرة",
        quantity: 1,
        price: 320,
        extras: ["جبنة موزاريلا مضاعفة", "ريحان طازج"],
      },
      {
        id: "i7",
        name: "باستا رابيولي",
        quantity: 2,
        price: 195,
      },
      {
        id: "i8",
        name: "كولا 500ml",
        quantity: 3,
        price: 45,
      },
    ],
    total: 845,
    paymentMethod: "online",
  },
  {
    id: "4",
    orderNumber: "ORD-1039",
    status: "preparing",
    type: "pickup",
    createdAt: new Date(Date.now() - 18 * 60 * 1000),
    customer: {
      name: "نورهان أحمد فؤاد",
      phone: "01512348765",
    },
    items: [
      {
        id: "i9",
        name: "شاورما لحمة",
        quantity: 3,
        price: 145,
        extras: ["حار جداً", "طحينة زيادة", "مخلل"],
      },
      {
        id: "i10",
        name: "بطاطس شيبسي محلي",
        quantity: 2,
        price: 55,
      },
    ],
    total: 545,
    paymentMethod: "cash",
  },
  {
    id: "5",
    orderNumber: "ORD-1038",
    status: "ready",
    type: "delivery",
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
    customer: {
      name: "عمر محمد الشريف",
      phone: "01098765432",
      address: "الزمالك، شارع حسن صبري، فيلا الياسمين",
    },
    items: [
      {
        id: "i11",
        name: "ريش ضاني مشوية",
        quantity: 1,
        price: 850,
        extras: ["ميديوم رير", "مع صوص الفطر الكريمي"],
      },
      {
        id: "i12",
        name: "شوربة فراخ بالكريمة",
        quantity: 1,
        price: 120,
      },
      {
        id: "i13",
        name: "خبز بالثوم",
        quantity: 2,
        price: 45,
      },
    ],
    total: 1060,
    paymentMethod: "card",
  },
  {
    id: "6",
    orderNumber: "ORD-1037",
    status: "ready",
    type: "pickup",
    createdAt: new Date(Date.now() - 32 * 60 * 1000),
    customer: {
      name: "ريم طارق مصطفى",
      phone: "01665432198",
    },
    items: [
      {
        id: "i14",
        name: "كريب نوتيلا وموز",
        quantity: 2,
        price: 115,
        extras: ["كريمة مخفوقة زيادة"],
      },
      {
        id: "i15",
        name: "مولتن شوكولاتة",
        quantity: 2,
        price: 145,
      },
    ],
    total: 520,
    paymentMethod: "online",
  },
  {
    id: "7",
    orderNumber: "ORD-1036",
    status: "delivered",
    type: "delivery",
    createdAt: new Date(Date.now() - 65 * 60 * 1000),
    customer: {
      name: "محمود علي حسن",
      phone: "01234098765",
      address: "المعادي، شارع 9، برج الكورنيش",
    },
    items: [
      {
        id: "i16",
        name: "برجر دبل سموكي",
        quantity: 2,
        price: 215,
        extras: ["جبنة شيدر مدخنة"],
      },
      {
        id: "i17",
        name: "أوريو ميلك شيك",
        quantity: 2,
        price: 120,
      },
    ],
    total: 670,
    paymentMethod: "cash",
  },
  {
    id: "8",
    orderNumber: "ORD-1035",
    status: "delivered",
    type: "pickup",
    createdAt: new Date(Date.now() - 95 * 60 * 1000),
    customer: {
      name: "هدى سمير رزق",
      phone: "01095743210",
    },
    items: [
      {
        id: "i18",
        name: "سلطة سيزر بالدجاج",
        quantity: 1,
        price: 165,
      },
      {
        id: "i19",
        name: "عصير برتقال طازج",
        quantity: 1,
        price: 85,
      },
    ],
    total: 250,
    paymentMethod: "online",
  },
  {
    id: "9",
    orderNumber: "ORD-1034",
    status: "cancelled",
    type: "delivery",
    createdAt: new Date(Date.now() - 40 * 60 * 1000),
    customer: {
      name: "تامر حسين الجوهري",
      phone: "01234098123",
      address: "المعادي، شارع 9، برج الكورنيش",
    },
    items: [
      {
        id: "i20",
        name: "بيتزا رانش دجاج",
        quantity: 1,
        price: 365,
        extras: ["جبنة مضاعفة"],
      },
    ],
    total: 365,
    paymentMethod: "cash",
  },
  {
    id: "10",
    orderNumber: "ORD-1033",
    status: "cancelled",
    type: "pickup",
    createdAt: new Date(Date.now() - 75 * 60 * 1000),
    customer: {
      name: "منة الله كريم",
      phone: "01512309876",
    },
    items: [
      {
        id: "i21",
        name: "برجر كايرو الخاص",
        quantity: 2,
        price: 185,
      },
    ],
    total: 370,
    paymentMethod: "card",
  },
];

export const MENU_CATEGORIES = [
  "الكل",
  "برجر",
  "دجاج",
  "بيتزا",
  "مشويات",
  "سلطات",
  "مشروبات",
  "حلويات",
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: "m1",
    name: "برجر كايرو الخاص",
    description: "لحم بقري بلدي 220 جرام مع جبنة شيدر وصوص كايرو السري",
    price: 185,
    category: "برجر",
    image: "/menu/burger.jpg",
    available: true,
  },
  {
    id: "m2",
    name: "برجر دبل سموكي",
    description: "باتيين لحم مدخنة مع جبنة شيدر مدخنة وبيكون وصوص BBQ",
    price: 215,
    category: "برجر",
    image: "/menu/smoky-burger.jpg",
    available: true,
  },
  {
    id: "m3",
    name: "برجر مشروم تريفل",
    description: "برجر فاخر مع فطر محشي وصوص تريفل إيطالي",
    price: 245,
    category: "برجر",
    image: "/menu/truffle-burger.jpg",
    available: true,
  },
  {
    id: "m4",
    name: "دجاج مشوي على الفحم",
    description: "نص فرخة مشوية على الفحم مع أرز صيادية وسلطة",
    price: 320,
    category: "دجاج",
    image: "/menu/grilled-chicken.jpg",
    available: true,
  },
  {
    id: "m5",
    name: "شاورما لحمة",
    description: "شاورما لحم بلدي مع طحينة وخضار وصوص الثوم",
    price: 145,
    category: "دجاج",
    image: "/menu/shawarma.jpg",
    available: true,
  },
  {
    id: "m6",
    name: "فراخ كريسبي",
    description: "قطع فراخ مقرمشة بالبانكو مع صوص هني موستارد",
    price: 175,
    category: "دجاج",
    image: "/menu/crispy.jpg",
    available: false,
  },
  {
    id: "m7",
    name: "بيتزا مارغريتا",
    description: "عجينة إيطالية أصيلة مع صلصة طماطم وموزاريلا DOP",
    price: 320,
    category: "بيتزا",
    image: "/menu/margherita.jpg",
    available: true,
  },
  {
    id: "m8",
    name: "بيتزا رانش دجاج",
    description: "دجاج مشوي مع فلفل ملون وصوص رانش أمريكي",
    price: 365,
    category: "بيتزا",
    image: "/menu/ranch-pizza.jpg",
    available: true,
  },
  {
    id: "m9",
    name: "ريش ضاني مشوية",
    description: "ريش ضاني كيلو مشوي على الفحم مع طعمية الفلفل والأعشاب",
    price: 850,
    category: "مشويات",
    image: "/menu/ribs.jpg",
    available: true,
  },
  {
    id: "m10",
    name: "فيليه ستيك",
    description: "فيليه بقري 250 جرام مع بطاطس مهروسة وصوص الفطر",
    price: 625,
    category: "مشويات",
    image: "/menu/steak.jpg",
    available: true,
  },
  {
    id: "m11",
    name: "باستا رابيولي",
    description: "رابيولي محشي بالريكوتا والسبانخ مع صوص القشدة والبارميزان",
    price: 195,
    category: "مشويات",
    image: "/menu/ravioli.jpg",
    available: false,
  },
  {
    id: "m12",
    name: "سلطة سيزر بالدجاج",
    description: "خس روماني مع كروتونز وصوص سيزر وبارميزان وفيليه دجاج مشوي",
    price: 165,
    category: "سلطات",
    image: "/menu/caesar.jpg",
    available: true,
  },
  {
    id: "m13",
    name: "سلطة فتوش",
    description: "خضار طازجة مع خبز مقرمش وصوص الرمان والليمون",
    price: 85,
    category: "سلطات",
    image: "/menu/fattoush.jpg",
    available: true,
  },
  {
    id: "m14",
    name: "عصير مانجو طازج",
    description: "مانجو مصري طبيعي 100% بدون أي إضافات",
    price: 75,
    category: "مشروبات",
    image: "/menu/mango.jpg",
    available: true,
  },
  {
    id: "m15",
    name: "أوريو ميلك شيك",
    description: "ميلك شيك كثيف بالأوريو وآيسكريم الفانيليا",
    price: 120,
    category: "مشروبات",
    image: "/menu/milkshake.jpg",
    available: true,
  },
  {
    id: "m16",
    name: "مولتن شوكولاتة",
    description: "كيكة شوكولاتة دافية مع قلب سائل وآيسكريم فانيليا",
    price: 145,
    category: "حلويات",
    image: "/menu/molten.jpg",
    available: true,
  },
  {
    id: "m17",
    name: "كريب نوتيلا وموز",
    description: "كريب فرنسي رفيع مع نوتيلا وموز وكريمة مخفوقة",
    price: 115,
    category: "حلويات",
    image: "/menu/crepe.jpg",
    available: true,
  },
  {
    id: "m18",
    name: "تشيز كيك لوتس",
    description: "تشيز كيك نيويورك مع بسكويت اللوتس وكريمة الكراميل",
    price: 135,
    category: "حلويات",
    image: "/menu/cheesecake.jpg",
    available: false,
  },
];

export const REJECT_REASONS = [
  "المطبخ واقف دلوقتي",
  "الصنف دا خلص",
  "المنطقة بعيدة عن نطاق التوصيل",
  "ضغط شغل عالي قوي",
  "فيه غلط في الطلب",
  "سبب تاني",
];

export const ANALYTICS_ORDERS = [
  { id: "ORD-1042", customer: "أحمد محمد السيد", items: 3, total: 650, payment: "كاش", time: "17:22", status: "مكتمل" },
  { id: "ORD-1041", customer: "سارة خالد إبراهيم", items: 2, total: 405, payment: "فيزا", time: "16:45", status: "مكتمل" },
  { id: "ORD-1040", customer: "خالد محمود عبدالله", items: 3, total: 845, payment: "أونلاين", time: "16:10", status: "مكتمل" },
  { id: "ORD-1039", customer: "نورهان أحمد فؤاد", items: 2, total: 545, payment: "كاش", time: "15:55", status: "مكتمل" },
  { id: "ORD-1038", customer: "عمر محمد الشريف", items: 3, total: 1060, payment: "فيزا", time: "15:30", status: "مكتمل" },
  { id: "ORD-1037", customer: "ريم طارق مصطفى", items: 2, total: 520, payment: "أونلاين", time: "14:50", status: "مكتمل" },
  { id: "ORD-1036", customer: "محمود علي حسن", items: 2, total: 670, payment: "كاش", time: "14:15", status: "مكتمل" },
  { id: "ORD-1035", customer: "هدى سمير رزق", items: 2, total: 250, payment: "أونلاين", time: "13:40", status: "ملغي" },
  { id: "ORD-1034", customer: "تامر حسين الجوهري", items: 4, total: 920, payment: "فيزا", time: "13:10", status: "مكتمل" },
  { id: "ORD-1033", customer: "منة الله كريم", items: 1, total: 185, payment: "كاش", time: "12:30", status: "مكتمل" },
];
