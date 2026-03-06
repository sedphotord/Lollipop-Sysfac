"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Company, getCompanies, saveCompanies, getActiveCompanyId, switchCompanyData } from "@/lib/company-store";
import { seedAllCompaniesData, SEED_COMPANIES } from "@/lib/seed-data";

type CompanyContextType = {
    companies: Company[];
    activeCompany: Company | null;
    switchCompany: (id: string) => void;
    createCompany: (data: Omit<Company, 'id' | 'createdAt'>) => Company;
    refreshCompanies: () => void;
};

const CompanyContext = createContext<CompanyContextType | null>(null);

export function CompanyProvider({ children }: { children: ReactNode }) {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    const refreshCompanies = useCallback(() => {
        const list = getCompanies();
        setCompanies(list);
        setActiveId(getActiveCompanyId());
    }, []);

    useEffect(() => {
        // Seed on first mount (client-side only)
        seedAllCompaniesData();
        refreshCompanies();

        const handler = () => refreshCompanies();
        window.addEventListener('company-changed', handler);
        return () => window.removeEventListener('company-changed', handler);
    }, [refreshCompanies]);

    const switchCompany = useCallback((toId: string) => {
        if (toId === activeId) return;
        switchCompanyData(activeId, toId);
        setActiveId(toId);
    }, [activeId]);

    const createCompany = useCallback((data: Omit<Company, 'id' | 'createdAt'>): Company => {
        const id = `comp-${Date.now()}`;
        const company: Company = {
            ...data,
            id,
            createdAt: new Date().toLocaleDateString('es-DO'),
        };
        const list = getCompanies();
        const updated = [...list, company];
        saveCompanies(updated);
        setCompanies(updated);
        return company;
    }, []);

    const activeCompany = companies.find(c => c.id === activeId) ?? null;

    return (
        <CompanyContext.Provider value={{ companies, activeCompany, switchCompany, createCompany, refreshCompanies }}>
            {children}
        </CompanyContext.Provider>
    );
}

export function useCompany(): CompanyContextType {
    const ctx = useContext(CompanyContext);
    if (!ctx) throw new Error('useCompany must be used inside CompanyProvider');
    return ctx;
}
