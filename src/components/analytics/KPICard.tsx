"use client";

import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: number; // نسبة التغيير، موجب = ارتفاع، سالب = انخفاض
  trendLabel?: string;
  gradient?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  trendLabel,
  gradient,
}: KPICardProps) {
  const isPositiveTrend = trend !== undefined && trend >= 0;

  return (
    <div
      className={`surface-card relative overflow-hidden rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)] group ${
        gradient ? gradient : ""
      }`}
    >
      {/* خلفية ديكورية */}
      <div
        className={`absolute -top-4 -left-4 w-24 h-24 rounded-full opacity-5 ${iconBg} blur-2xl group-hover:opacity-10 transition-opacity`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-muted-foreground text-sm font-medium mb-3">{title}</p>
          <p className="text-foreground text-3xl font-bold leading-none mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-muted-foreground text-xs mt-1">{subtitle}</p>
          )}

          {/* مؤشر الاتجاه */}
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 mt-3 text-xs font-semibold ${
                isPositiveTrend ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {isPositiveTrend ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>
                {isPositiveTrend ? "+" : ""}
                {trend}%
              </span>
              {trendLabel && (
                <span className="text-muted-foreground font-normal">{trendLabel}</span>
              )}
            </div>
          )}
        </div>

        {/* أيقونة */}
        <div
          className={`w-12 h-12 rounded-xl border border-border/70 flex items-center justify-center flex-shrink-0 ${iconBg} shadow-sm transition-transform group-hover:scale-110 duration-300`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
