"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      expand
      visibleToasts={4}
      offset="18px"
      gap={12}
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "rgba(2, 6, 23, 0.96)",
          "--normal-text": "#f8fafc",
          "--normal-border": "rgba(51, 65, 85, 0.8)",
          "--border-radius": "18px",
        } as React.CSSProperties
      }
      toastOptions={{
        duration: 5000,
        classNames: {
          toast:
            "group toast bg-slate-950/95 border border-slate-700/80 text-white shadow-[0_18px_45px_rgba(2,6,23,0.55)] rounded-2xl px-4 py-3 min-h-[72px] w-[min(420px,calc(100vw-24px))] backdrop-blur-md",
          title: "text-sm font-black text-white leading-5",
          description: "text-[11px] text-slate-300 mt-1 leading-5",
          closeButton: "border-slate-700 bg-slate-900 text-slate-300 hover:text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
