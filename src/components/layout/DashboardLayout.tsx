"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  newOrdersCount?: number;
}

export function DashboardLayout({ children, newOrdersCount = 0 }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          newOrdersCount={newOrdersCount}
          user={user}
        />

        <div className="flex min-h-screen flex-col lg:mr-72">
          <Navbar
            onMenuToggle={() => setSidebarOpen(true)}
            newOrdersCount={newOrdersCount}
            user={user}
          />
          <main className="flex-1 p-4 lg:p-6 page-enter">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
