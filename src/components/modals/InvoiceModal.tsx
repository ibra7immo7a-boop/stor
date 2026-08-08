"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Printer, MapPin, Phone, Flame } from "lucide-react";
import type { Order } from "@/lib/mock-data";
import { toast } from "sonner";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export function InvoiceModal({ isOpen, onClose, order }: InvoiceModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    try {
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.width = "0px";
      iframe.style.height = "0px";
      iframe.style.border = "none";
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) throw new Error("Could not access iframe document");

      doc.write(`
        <html dir="rtl" lang="ar">
          <head>
            <title>فاتورة الطلب #${order.orderNumber}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
              body { font-family: 'Cairo', sans-serif; margin: 0; padding: 20px; color: #000; background: #fff; width: 80mm; }
              .header { text-align: center; margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
              .header h1 { font-size: 20px; margin: 0 0 5px; font-weight: 900; }
              .header p { font-size: 12px; margin: 2px 0; }
              .info { font-size: 13px; margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
              .info p { margin: 4px 0; }
              .items { width: 100%; margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
              .item { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
              .item-name { flex: 1; font-weight: 600; }
              .item-qty { margin: 0 10px; }
              .item-price { font-weight: 700; }
              .item-extras { font-size: 11px; color: #555; margin-top: 2px; }
              .totals { font-size: 14px; font-weight: 700; display: flex; justify-content: space-between; margin-top: 10px; border-bottom: 2px solid #000; padding-bottom: 10px; }
              .footer { text-align: center; margin-top: 15px; font-size: 12px; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>كايرو برايم</h1>
              <p>النكهة المصرية الأصيلة</p>
              <p>التاريخ: ${new Date(order.createdAt).toLocaleString('ar-EG')}</p>
              <p>رقم الفاتورة: <strong>${order.orderNumber}</strong></p>
            </div>
            <div class="info">
              <p><strong>العميل:</strong> ${order.customer.name}</p>
              <p><strong>الهاتف:</strong> ${order.customer.phone}</p>
              ${order.customer.address ? `<p><strong>العنوان:</strong> ${order.customer.address}</p>` : ''}
              <p><strong>نوع الطلب:</strong> ${order.type === 'delivery' ? 'توصيل' : 'استلام'}</p>
            </div>
            <div class="items">
              ${order.items.map(item => `
                <div>
                  <div class="item">
                    <span class="item-name">${item.name}</span>
                    <span class="item-qty">x${item.quantity}</span>
                    <span class="item-price">${(item.price * item.quantity).toLocaleString('ar-EG')} ج</span>
                  </div>
                  ${item.extras && item.extras.length > 0 ? `<div class="item-extras">+ ${item.extras.join('، ')}</div>` : ''}
                </div>
              `).join('')}
            </div>
            <div class="totals">
              <span>الإجمالي:</span>
              <span>${order.total.toLocaleString('ar-EG')} ج.م</span>
            </div>
          </body>
        </html>
      `);
      doc.close();

      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
      
      toast.success("تم إرسال الفاتورة للطابعة بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء الطباعة");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-slate-950 border-slate-800 text-slate-200 shadow-2xl p-0 overflow-hidden rounded-3xl" dir="rtl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/5 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-black text-white">معاينة الفاتورة</DialogTitle>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            طباعة الإيصال
          </button>
        </DialogHeader>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div 
            className="bg-white text-black p-6 rounded-lg mx-auto shadow-inner relative"
            style={{ width: "300px", fontFamily: "'Cairo', sans-serif" }}
          >
            <div className="absolute -bottom-2 left-0 right-0 h-4 bg-slate-950" style={{ maskImage: "radial-gradient(circle at 5px 0, transparent 4px, black 5px)", maskSize: "10px 10px", maskRepeat: "repeat-x" }} />

            <div className="text-center border-b border-dashed border-slate-300 pb-4 mb-4">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
              </div>
              <h2 className="font-black text-lg mb-1">كايرو برايم</h2>
              <p className="text-xs text-slate-500">التاريخ: {new Date(order.createdAt).toLocaleDateString('ar-EG')}</p>
              <p className="font-bold mt-2">رقم الطلب: {order.orderNumber}</p>
            </div>

            <div className="border-b border-dashed border-slate-300 pb-4 mb-4 text-xs space-y-1.5">
              <p><strong>العميل:</strong> {order.customer.name}</p>
              <p className="flex items-center gap-1 font-mono"><Phone className="w-3 h-3" /> {order.customer.phone}</p>
              {order.customer.address && <p className="flex items-start gap-1"><MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /> {order.customer.address}</p>}
            </div>

            <div className="border-b border-dashed border-slate-300 pb-4 mb-4 space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="text-sm">
                  <div className="flex justify-between font-bold">
                    <span>{item.name}</span>
                    <span className="whitespace-nowrap ml-2">{(item.price * item.quantity).toLocaleString('ar-EG')} ج</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-0.5">
                    <span>الكمية: {item.quantity}</span>
                  </div>
                  {item.extras && item.extras.length > 0 && (
                    <div className="text-xs text-slate-500 mt-1 pl-2 border-l-2 border-slate-200">
                      + {item.extras.join('، ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center font-black text-lg pb-4">
              <span>الإجمالي:</span>
              <span>{order.total.toLocaleString('ar-EG')} ج</span>
            </div>
            
            <div className="text-center text-xs text-slate-500 mt-4">
              <p>شكراً لاختياركم كايرو برايم</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
