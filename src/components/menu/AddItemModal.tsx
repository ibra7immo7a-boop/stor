"use client";

import { useState } from "react";
import { Plus, X, Upload, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MENU_CATEGORIES } from "@/lib/mock-data";
import type { MenuItem } from "@/lib/mock-data";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<MenuItem, "id">) => void;
}

export function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.price || !form.category) return;

    onAdd({
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      image: imagePreview || "/menu/default.jpg",
      available: true,
    });

    // إعادة تعيين
    setForm({ name: "", description: "", price: "", category: "" });
    setImagePreview(null);
    onClose();
  };

  const isValid = form.name && form.price && form.category;

  const categories = MENU_CATEGORIES.filter((c) => c !== "الكل");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full rounded-3xl border border-border/70 bg-card/95 text-foreground shadow-2xl backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
              <Plus className="w-5 h-5 text-orange-500" />
            </div>
            <DialogTitle className="text-foreground text-lg font-bold">
              إضافة صنف جديد
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* رفع الصورة */}
          <div>
            <Label className="text-foreground/90 text-sm font-medium mb-2 block">
              صورة الصنف
            </Label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer group ${
                isDragging
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-border/70 hover:border-orange-500/40 hover:bg-muted/60"
              }`}
            >
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
                {imagePreview ? (
                  <div className="relative h-40 rounded-xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-foreground text-sm font-medium">
                        تغيير الصورة
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setImagePreview(null);
                      }}
                      className="absolute top-2 left-2 w-7 h-7 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground text-sm font-medium">
                        اسحب صورة أو اضغط للاختيار
                      </p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        PNG, JPG, WEBP حتى 5MB
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/70 border border-border/70 mt-1">
                      <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground text-xs">رفع صورة</span>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* الاسم والوصف */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="text-foreground/90 text-sm font-medium mb-1.5 block">
                اسم الصنف <span className="text-red-400">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثال: برجر كلاسيك"
                className="bg-background/80 border-border/70 text-foreground placeholder:text-muted-foreground rounded-xl h-10 focus:border-orange-500/50"
              />
            </div>

            <div>
              <Label className="text-foreground/90 text-sm font-medium mb-1.5 block">
                الوصف
              </Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="وصف مختصر للصنف..."
                className="bg-background/80 border-border/70 text-foreground placeholder:text-muted-foreground rounded-xl h-10 focus:border-orange-500/50"
              />
            </div>
          </div>

          {/* السعر والقسم */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-foreground/90 text-sm font-medium mb-1.5 block">
                السعر (ر.س) <span className="text-red-400">*</span>
              </Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
                min="0"
                className="bg-background/80 border-border/70 text-foreground placeholder:text-muted-foreground rounded-xl h-10 focus:border-orange-500/50"
              />
            </div>

            <div>
              <Label className="text-slate-300 text-sm font-medium mb-1.5 block">
                القسم <span className="text-red-400">*</span>
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v || "" })}
              >
                <SelectTrigger className="bg-background/80 border-border/70 text-foreground rounded-xl h-10 focus:border-orange-500/50">
                  <SelectValue placeholder="اختر قسم" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground rounded-xl">
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className="text-foreground focus:bg-accent focus:text-foreground rounded-lg"
                    >
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl h-10 disabled:opacity-40 transition-colors shadow-lg shadow-orange-500/20"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة الصنف
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl h-10 transition-colors"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
