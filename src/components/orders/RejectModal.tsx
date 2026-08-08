"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { REJECT_REASONS } from "@/lib/mock-data";

interface RejectModalProps {
  isOpen: boolean;
  orderNumber: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

export function RejectModal({
  isOpen,
  orderNumber,
  onConfirm,
  onClose,
}: RejectModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState("");

  const handleConfirm = () => {
    const reason =
      selectedReason === "سبب آخر" ? customReason : selectedReason;
    if (!reason.trim()) return;
    onConfirm(reason);
    setSelectedReason("");
    setCustomReason("");
    onClose();
  };

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md w-full rounded-2xl shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <X className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-white text-lg font-bold">
                رفض الطلب
              </DialogTitle>
              <p className="text-slate-400 text-sm">{orderNumber}</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            يرجى اختيار سبب رفض الطلب لإعلام العميل:
          </p>
        </DialogHeader>

        <div className="space-y-2 my-2">
          {REJECT_REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`w-full text-right px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                selectedReason === reason
                  ? "border-red-500/60 bg-red-500/15 text-red-300"
                  : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                    selectedReason === reason
                      ? "border-red-500 bg-red-500"
                      : "border-slate-500"
                  }`}
                >
                  {selectedReason === reason && (
                    <div className="w-full h-full rounded-full bg-white scale-50 transform" />
                  )}
                </div>
                {reason}
              </div>
            </button>
          ))}
        </div>

        {/* حقل السبب المخصص */}
        {selectedReason === "سبب آخر" && (
          <div className="mt-2">
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="اكتب السبب هنا..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 text-sm resize-none focus:outline-none focus:border-red-500/50 transition-colors"
            />
          </div>
        )}

        <DialogFooter className="flex gap-2 flex-row-reverse mt-2">
          <Button
            onClick={handleConfirm}
            disabled={
              !selectedReason ||
              (selectedReason === "سبب آخر" && !customReason.trim())
            }
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl h-10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            تأكيد الرفض
          </Button>
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl h-10 transition-colors"
          >
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
