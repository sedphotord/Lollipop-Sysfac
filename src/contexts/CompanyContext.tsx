"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Company, getCompanies, saveCompanies, getActiveCompanyId, setActiveCompanyId } from "@/lib/company-store";
import { seedAllCompaniesData, SEED_COMPANIES } from "@/lib/seed-data";

type CompanyContextType = {
    companies: Company[];
    activeCompany: Company | null;
    /** Switch company: updates active ID then reloads page */
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
        setCompanies(list.length ? list : SEED_COMPANIES);
        setActiveId(getActiveCompanyId());
    }, []);

    useEffect(() => {
        seedAllCompaniesData();
        refreshCompanies();
    }, [refreshCompanies]);

    /** Switch company = set ID in localStorage + full page reload.
     *  companyStorage helper auto-reads the new company's data after reload. */
    const switchCompany = useCallback((toId: string) => {
        setActiveCompanyId(toId);
        window.location.reload();
    }, []);

    const createCompany = useCallback((data: Omit<Company, 'id' | 'createdAt'>): Company => {
        const id = `comp-${Date.now()}`;
        const company: Company = {
            ...data,
            id,
            createdAt: new Date().toLocaleDateString('es-DO'),
        };
        const updated = [...getCompanies(), company];
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
