"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { getEmployeeListApi, loginApi, updateEmployeePermissions } from "@/services/authService";

const STORAGE_KEY = "restaurant_dashboard_auth_user";

type PermissionKey =
  | "directPOS"
  | "registerShifts"
  | "liveOrders"
  | "menuManagement"
  | "advancedReports"
  | "driverDelivery"
  | "printerSettings"
  | "messages"
  | "staffManagement";

export type PermissionMap = Record<PermissionKey, boolean>;

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  branch: string;
  role: "admin" | "manager" | "cashier";
  active: boolean;
  permissions: PermissionMap;
  permissionNames?: string[];
}

interface AuthContextValue {
  user: AuthUser | null;
  users: AuthUser[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; user?: AuthUser; message?: string }>;
  logout: () => void;
  refreshUsers: () => Promise<void>;
  hasPermission: (permission: PermissionKey | string) => boolean;
  updatePermissions: (employeeId: string, newPermissions: PermissionMap) => Promise<{ success: boolean; employee?: AuthUser; message?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const persistUser = useCallback((nextUser: AuthUser | null) => {
    if (!nextUser) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }, []);

  const refreshUsers = useCallback(async () => {
    const { success, users: nextUsers } = await getEmployeeListApi();

    if (success && Array.isArray(nextUsers)) {
      setUsers(nextUsers);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser) as AuthUser;
          if (isMounted) {
            setUser(parsedUser);
          }
        }

        const { success, users: nextUsers } = await getEmployeeListApi();
        if (isMounted && success && Array.isArray(nextUsers)) {
          setUsers(nextUsers);
        }
      } catch (error) {
        console.error("Failed to hydrate auth state", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);

    const response = await loginApi(username, password);

    if (response.success && response.user) {
      setUser(response.user);
      persistUser(response.user);
      setUsers((currentUsers) => {
        const nextUsers = currentUsers.length ? currentUsers : [response.user as AuthUser];
        const index = nextUsers.findIndex((item) => item.id === response.user?.id);

        if (index >= 0) {
          nextUsers[index] = response.user as AuthUser;
          return nextUsers;
        }

        return [...nextUsers, response.user as AuthUser];
      });
      setIsLoading(false);
      return { success: true, user: response.user, message: response.message };
    }

    setIsLoading(false);
    return {
      success: false,
      message: response.message,
    };
  }, [persistUser]);

  const logout = useCallback(() => {
    setUser(null);
    persistUser(null);
    router.push("/login");
  }, [persistUser, router]);

  const hasPermission = useCallback(
    (permission: PermissionKey | string) => {
      if (!user) return false;

      const normalizedPermission = String(permission).trim();
      const permissionList = Array.isArray(user.permissionNames) ? user.permissionNames : [];

      if (user.role === "admin" || user.username === "super_admin" || permissionList.includes("all")) {
        return true;
      }

      if (permissionList.includes(normalizedPermission)) {
        return true;
      }

      if (normalizedPermission === "cashier" && permissionList.includes("cashier")) {
        return true;
      }

      if (normalizedPermission === "orders" && permissionList.includes("orders")) {
        return true;
      }

      return Boolean(user.permissions?.[normalizedPermission as PermissionKey]);
    },
    [user]
  );

  const updatePermissions = useCallback(
    async (employeeId: string, newPermissions: PermissionMap) => {
      const response = await updateEmployeePermissions(employeeId, newPermissions);

      if (response.success && response.employee) {
        setUsers((currentUsers) =>
          currentUsers.map((item) => (item.id === employeeId ? response.employee! : item))
        );

        if (user?.id === employeeId) {
          const nextUser = { ...user, permissions: response.employee.permissions } as AuthUser;
          setUser(nextUser);
          persistUser(nextUser);
        }
      }

      return response;
    },
    [persistUser, user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      users,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refreshUsers,
      hasPermission,
      updatePermissions,
    }),
    [hasPermission, isLoading, login, logout, refreshUsers, updatePermissions, user, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
