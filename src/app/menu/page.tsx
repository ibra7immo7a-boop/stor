"use client";

export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MenuTable } from "@/components/menu/MenuTable";
import { AddItemModal } from "@/components/menu/AddItemModal";
import EditItemModal from "@/components/menu/EditItemModal";
import { MOCK_MENU_ITEMS } from "@/lib/mock-data";
import type { MenuItem } from "@/lib/mock-data";
import { UtensilsCrossed, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<MenuItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }

    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const availableCount = items.filter((i) => i.available).length;
  const unavailableCount = items.filter((i) => !i.available).length;

  const handleToggleAvailability = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleAddItem = (newItem: Omit<MenuItem, "id">) => {
    const item: MenuItem = {
      ...newItem,
      id: `m${Date.now()}`,
    };
    setItems((prev) => [item, ...prev]);
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedProductForEdit(item);
    setIsEditOpen(true);
  };

  const handleSaveEditedItem = (updated: MenuItem) => {
    setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
    setSelectedProductForEdit(null);
    setIsEditOpen(false);
  };

  return (
    <DashboardLayout>
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-foreground font-bold text-xl">إدارة المنيو</h1>
            <p className="text-muted-foreground text-sm">
              {items.length} صنف •{" "}
              <span className="text-emerald-400">{availableCount} متوفر</span>
              {unavailableCount > 0 && (
                <span className="text-red-400"> • {unavailableCount} نفذت</span>
              )}
            </p>
          </div>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl h-10 px-4 shadow-lg shadow-orange-500/20 transition-colors gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة صنف جديد
        </Button>
      </div>

      {/* بحث سريع وواجهة نظيفة */}
      <div className="bg-card/80 border border-border/60 rounded-2xl p-4 mb-5 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
              البحث السريع
            </p>
            <h2 className="text-sm font-semibold text-foreground mt-1">ابحث في قائمة المنيو</h2>
          </div>
          <span className="rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-xs text-muted-foreground">
            {filteredItems.length} عنصر
          </span>
        </div>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن صنف بالاسم أو الوصف..."
            className="w-full h-11 pr-10 pl-4 rounded-xl bg-background/80 border border-border/70 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all"
          />
        </div>
      </div>

      {/* الجدول */}
      <MenuTable
        items={filteredItems}
        onToggleAvailability={handleToggleAvailability}
        onDeleteItem={handleDeleteItem}
        onEditItem={handleEditItem}
      />

      {/* نافذة الإضافة */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />

      <EditItemModal
        isOpen={isEditOpen}
        item={selectedProductForEdit}
        onClose={() => { setIsEditOpen(false); setSelectedProductForEdit(null); }}
        onSave={handleSaveEditedItem}
      />
    </DashboardLayout>
  );
}
