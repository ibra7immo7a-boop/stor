"use client";

import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface OrderTimerProps {
  createdAt: Date;
  warningMinutes?: number; // افتراضي 10 دقائق
  dangerMinutes?: number;  // افتراضي 20 دقيقة
}

export function OrderTimer({
  createdAt,
  warningMinutes = 10,
  dangerMinutes = 20,
}: OrderTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const calculateElapsed = () => {
      const diff = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
      setElapsedSeconds(diff);
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  const warningSeconds = warningMinutes * 60;
  const dangerSeconds = dangerMinutes * 60;

  // تحديد النمط بناءً على الوقت المنقضي
  let statusStyles = {
    bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10",
    icon: <Clock className="w-3.5 h-3.5 text-emerald-400" />,
    pulse: false,
    label: "طبيعي",
  };

  if (elapsedSeconds >= dangerSeconds) {
    statusStyles = {
      bg: "bg-red-500/20 border-red-500/50 text-red-400 shadow-red-500/30 animate-pulse glow-red",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce" />,
      pulse: true,
      label: "متأخر جداً",
    };
  } else if (elapsedSeconds >= warningSeconds) {
    statusStyles = {
      bg: "bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-amber-500/15",
      icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
      pulse: false,
      label: "تحذير",
    };
  }

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-mono font-bold transition-all duration-300 shadow-sm ${statusStyles.bg}`}
      title={`الوقت المنقضي: ${minutes} دقيقة و ${seconds} ثانية (${statusStyles.label})`}
    >
      {statusStyles.icon}
      <span className="tabular-nums">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
