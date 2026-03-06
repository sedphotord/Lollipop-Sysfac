"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
    AppUser, CompanyRole, getSession, setSession, clearSession,
    getUserById, getEffectiveRole,
} from "@/lib/auth-store";
import { getActiveCompanyId } from "@/lib/company-store";

type AuthContextType = {
    currentUser: AppUser | null;
    activeRole: CompanyRole;
    isLoading: boolean;
    login: (userId: string) => void;
    logout: () => void;
    refreshAuth: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
    const [activeRole, setActiveRole] = useState<CompanyRole>('solo_lectura');
    const [isLoading, setIsLoading] = useState(true);

    const refreshAuth = useCallback(() => {
        const session = getSession();
        if (!session) {
            setCurrentUser(null);
            setActiveRole('solo_lectura');
            setIsLoading(false);
            return;
        }
        const user = getUserById(session.userId);
        if (!user) {
            clearSession();
            setCurrentUser(null);
            setActiveRole('solo_lectura');
            setIsLoading(false);
            return;
        }
        const companyId = getActiveCompanyId();
        const role = getEffectiveRole(user.id, companyId);
        setCurrentUser(user);
        setActiveRole(role);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        refreshAuth();
    }, [refreshAuth]);

    // Re-derive role when active company changes (after company switch + reload)
    useEffect(() => {
        if (!currentUser) return;
        const companyId = getActiveCompanyId();
        setActiveRole(getEffectiveRole(currentUser.id, companyId));
    }, [currentUser]);

    const login = useCallback((userId: string) => {
        setSession(userId);
        const user = getUserById(userId);
        if (user) {
            const companyId = getActiveCompanyId();
            setCurrentUser(user);
            setActiveRole(getEffectiveRole(userId, companyId));
        }
    }, []);

    const logout = useCallback(() => {
        clearSession();
        setCurrentUser(null);
        setActiveRole('solo_lectura');
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, activeRole, isLoading, login, logout, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
