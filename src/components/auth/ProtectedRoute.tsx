"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  fallbackTitle?: string;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  fallbackTitle = "غير مسموح بالدخول",
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, hasPermission } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        جاري التحقق من الجلسة...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <div className="max-w-md rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-sm font-bold text-red-400">{fallbackTitle}</p>
          <h2 className="mt-3 text-xl font-black text-foreground">لا توجد صلاحية كافية للوصول لهذه الصفحة</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            المستخدم الحالي: <span className="font-semibold text-foreground">{user?.name}</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
