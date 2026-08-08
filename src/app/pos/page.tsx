"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  ShoppingCart, Plus, Minus, X, Printer, Clock,
  Utensils, Package, Bike, Trash2, Tag,
  CreditCard, Wallet, Banknote, ChefHat
} from "lucide-react";
import { toast, Toaster } from "sonner";

// --- Types ---
type Category = "الكل" | "برجر" | "دجاج" | "مشروبات" | "وجبات" | "إضافات";
type OrderType = "صالة" | "استلام" | "دليفري";
type PaymentMethod = "كاش" | "فيزا" | "محفظة";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Exclude<Category, "الكل">;
  emoji: string;
}

interface CartItem extends MenuItem {
  cartId: string;
  quantity: number;
}

// --- Mock Data ---
const MENU_ITEMS: MenuItem[] = [
  // Burgers
  { id: "b1", name: "برجر كايرو الخاص", price: 85, category: "برجر", emoji: "🍔" },
  { id: "b2", name: "دبل برجر", price: 120, category: "برجر", emoji: "🍔" },
  { id: "b3", name: "برجر الجبن", price: 75, category: "برجر", emoji: "🍔" },
  { id: "b4", name: "برجر المشروم", price: 95, category: "برجر", emoji: "🍄" },
  // Chicken
  { id: "c1", name: "دجاج كريسبي", price: 70, category: "دجاج", emoji: "🍗" },
  { id: "c2", name: "تشيكن برجر", price: 80, category: "دجاج", emoji: "🍔" },
  { id: "c3", name: "أوينجز 6 قطع", price: 65, category: "دجاج", emoji: "🍗" },
  { id: "c4", name: "تشيكن ستريبس", price: 75, category: "دجاج", emoji: "🍗" },
  // Drinks
  { id: "d1", name: "كوكاكولا", price: 25, category: "مشروبات", emoji: "🥤" },
  { id: "d2", name: "بيبسي", price: 25, category: "مشروبات", emoji: "🥤" },
  { id: "d3", name: "عصير مانجو", price: 40, category: "مشروبات", emoji: "🥭" },
  { id: "d4", name: "عصير برتقال", price: 35, category: "مشروبات", emoji: "🍊" },
  { id: "d5", name: "مياه", price: 10, category: "مشروبات", emoji: "💧" },
  { id: "d6", name: "شاي", price: 20, category: "مشروبات", emoji: "☕" },
  // Meals
  { id: "m1", name: "وجبة برجر كاملة", price: 120, category: "وجبات", emoji: "🍱" },
  { id: "m2", name: "وجبة دجاج كاملة", price: 110, category: "وجبات", emoji: "🍱" },
  { id: "m3", name: "وجبة عائلية", price: 380, category: "وجبات", emoji: "👨‍👩‍👧‍👦" },
  // Extras
  { id: "e1", name: "صوص زيادة", price: 5, category: "إضافات", emoji: "🥣" },
  { id: "e2", name: "جبنة إضافية", price: 10, category: "إضافات", emoji: "🧀" },
  { id: "e3", name: "بطاطس وسط", price: 30, category: "إضافات", emoji: "🍟" },
  { id: "e4", name: "سلطة", price: 25, category: "إضافات", emoji: "🥗" },
];

const CATEGORIES: Category[] = ["الكل", "برجر", "دجاج", "مشروبات", "وجبات", "إضافات"];

export default function POSPage() {
  // State
  const [activeCategory, setActiveCategory] = useState<Category>("الكل");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("صالة");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("كاش");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [flashedItem, setFlashedItem] = useState<string | null>(null);

  // Client-side clock initialization
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered Menu
  const filteredMenu = activeCategory === "الكل"
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  // Cart Functions
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.id === item.id);
      if (existing) {
        return prev.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...prev, { ...item, cartId: Math.random().toString(), quantity: 1 }];
    });
    // Flash animation via React state
    setFlashedItem(item.id);
    setTimeout(() => setFlashedItem(null), 180);
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setDiscountPercent(0);
    setOrderType("صالة");
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = orderType === "دليفري" ? 25 : 0;
  const discountAmount = (subtotal * (discountPercent || 0)) / 100;
  const total = subtotal + deliveryFee - discountAmount;

  // Submit Order
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("السلة فارغة", { style: { background: "#060b18", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" } });
      return;
    }
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    toast.success(`تم إنشاء الفاتورة بنجاح! رقم الطلب: #${orderNumber}`, {
      style: { background: "#060b18", color: "#f97316", border: "1px solid rgba(249,115,22,0.3)" },
      icon: <Printer className="w-5 h-5 text-orange-500" />
    });
    clearCart();
  };

  return (
    <DashboardLayout>
      <Toaster position="top-center" dir="rtl" />
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] gap-6 p-4 md:p-6 overflow-hidden rtl">
        
        {/* Left Panel: Menu Grid (2/3 width) */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                <ChefHat className="w-6 h-6 text-orange-500" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">نقاط البيع <span className="text-orange-500">مباشر</span></h1>
            </div>
            
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted/70 border border-border rounded-lg text-muted-foreground">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="font-mono text-sm font-medium">
                {currentTime ? currentTime.toLocaleTimeString('ar-EG') : '...'}
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex overflow-x-auto pb-4 mb-2 gap-2 hide-scrollbar shrink-0">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all duration-300 border ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                    : "bg-background/70 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="flex-1 overflow-y-auto pr-2 pb-20 lg:pb-0 custom-scrollbar">
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMenu.map(item => (
                <div
                  key={item.id}
                  id={`item-${item.id}`}
                  onClick={() => addToCart(item)}
                  className={`panel-soft p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)] hover:border-orange-500/30 group flex flex-col justify-between h-36 bg-card/70 ${
                    flashedItem === item.id ? 'scale-95 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-3xl filter drop-shadow-md group-hover:scale-110 transition-transform">{item.emoji}</span>
                    <span className="font-bold text-orange-400 text-lg">{item.price} ج</span>
                  </div>
                  <div className="mt-auto flex justify-between items-end">
                    <h3 className="font-bold text-foreground/90 text-sm md:text-base leading-tight max-w-[70%]">{item.name}</h3>
                    <button className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Cart (1/3 width) */}
        <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col h-full bg-card/80 border border-border/70 rounded-2xl overflow-hidden shadow-2xl relative z-10">
          {/* Order Type Header */}
          <div className="p-4 border-b border-border/70 bg-background/40">
            <div className="flex bg-white/5 p-1 rounded-xl">
              {(['صالة', 'استلام', 'دليفري'] as OrderType[]).map((type) => {
                const Icon = type === 'صالة' ? Utensils : type === 'استلام' ? Package : Bike;
                return (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                      orderType === type 
                        ? "bg-orange-500 text-white shadow-lg" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Customer Info (Conditional) */}
          {orderType === "دليفري" && (
            <div className="p-4 border-b border-border/70 space-y-3 bg-orange-500/5">
              <input
                type="text"
                placeholder="اسم العميل"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600"
              />
              <input
                type="tel"
                placeholder="رقم الهاتف"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600"
              />
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 opacity-60">
                <ShoppingCart className="w-16 h-16 text-gray-600" strokeWidth={1} />
                <p>السلة فارغة حالياً</p>
                <p className="text-sm">أضف بعض الأصناف للبدء</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartId} className="flex flex-col bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span>{item.emoji}</span>
                      <span className="font-medium text-gray-200 text-sm">{item.name}</span>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-orange-400 font-bold">{item.price * item.quantity} ج</span>
                    <div className="flex items-center bg-black/30 rounded-lg border border-white/10 p-0.5">
                      <button 
                        onClick={() => updateQuantity(item.cartId, -1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartId, 1)}
                        className="w-7 h-7 flex items-center justify-center text-orange-400 hover:text-white hover:bg-orange-500 rounded-md transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Section */}
          <div className="p-4 border-t border-border/70 bg-background/70 space-y-4 shrink-0">
            
            {/* Quick Actions & Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>المجموع الفرعي</span>
                <span>{subtotal.toFixed(2)} ج</span>
              </div>
              
              <div className="flex justify-between items-center text-gray-400">
                <span className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  خصم
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent || ""}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    placeholder="%"
                    className="w-14 bg-black/20 border border-white/10 rounded text-center text-white py-1 focus:outline-none focus:border-orange-500 text-xs"
                  />
                  <span>{discountAmount > 0 ? `-${discountAmount.toFixed(2)} ج` : '0 ج'}</span>
                </div>
              </div>

              {orderType === "دليفري" && (
                <div className="flex justify-between text-gray-400">
                  <span>خدمة التوصيل</span>
                  <span>{deliveryFee.toFixed(2)} ج</span>
                </div>
              )}
              
              <div className="pt-2 mt-2 border-t border-white/10 flex justify-between items-end">
                <span className="text-gray-300 font-medium text-lg">الإجمالي</span>
                <span className="text-3xl font-bold text-white tracking-tight">
                  {total.toFixed(2)} <span className="text-xl text-orange-500">ج</span>
                </span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex gap-2">
              {(['كاش', 'فيزا', 'محفظة'] as PaymentMethod[]).map((method) => {
                const Icon = method === 'كاش' ? Banknote : method === 'فيزا' ? CreditCard : Wallet;
                return (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl border transition-all ${
                      paymentMethod === method
                        ? "bg-orange-500/10 border-orange-500 text-orange-400"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{method}</span>
                  </button>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button 
                onClick={clearCart}
                disabled={cart.length === 0}
                className="p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="إلغاء الطلب"
              >
                <Trash2 className="w-6 h-6" />
              </button>
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                <Printer className="w-6 h-6" />
                إنشاء وطباعة الفاتورة
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </DashboardLayout>
  );
}
