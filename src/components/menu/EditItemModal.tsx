"use client";

import { useEffect, useState } from "react";
import type { MenuItem } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EditItemModalProps {
  isOpen: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onSave: (updated: MenuItem) => void;
}

export default function EditItemModal({ isOpen, item, onClose, onSave }: EditItemModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (item) {
      setTitle(item.name);
      setCategory(item.category);
      setPrice(item.price);
      setDescription(item.description);
      setAvailable(item.available);
    }
  }, [item]);

  const handleSave = () => {
    if (!item) return;
    const updated: MenuItem = {
      ...item,
      name: title,
      category,
      price: Number(price),
      description,
      available,
    };

    onSave(updated);
    toast.success("تم تحديث المنتج بنجاح");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg rounded-3xl border border-border/70 bg-card/95 text-foreground shadow-2xl backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">تعديل المنتج</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="text-muted-foreground text-xs">اسم المنتج</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="text-muted-foreground text-xs">القسم</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 w-full min-w-0 rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-sm text-foreground outline-none focus:border-orange-500/50"
            >
              <option>الكل</option>
              <option>برجر</option>
              <option>دجاج</option>
              <option>بيتزا</option>
              <option>مشويات</option>
              <option>سلطات</option>
              <option>مشروبات</option>
              <option>حلويات</option>
            </select>
          </div>

          <div>
            <label className="text-muted-foreground text-xs">السعر</label>
            <Input value={String(price)} onChange={(e) => setPrice(Number(e.target.value))} type="number" />
          </div>

          <div>
            <label className="text-muted-foreground text-xs">الوصف</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-muted-foreground text-xs">الحالة</label>
            <div className="flex items-center gap-3">
              <label className="text-foreground/90 text-sm">متوفر</label>
              <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="rounded-xl">إلغاء</Button>
          <Button onClick={handleSave} className="rounded-xl bg-orange-500 hover:bg-orange-400 text-white">حفظ التعديلات</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
