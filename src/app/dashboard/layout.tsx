import { Sidebar, Header } from "@/components/dashboard/Layout";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <CompanyProvider>
                <AuthGuard>
                    <div className="flex min-h-screen w-full bg-[#f4f3fa] dark:bg-[#09090f]">
                        <Sidebar />
                        <div className="flex flex-col w-full flex-1 min-w-0 pr-4 py-4 ml-2.5">
                            <div className="h-full bg-white/80 dark:bg-[#111118]/80 backdrop-blur-xl rounded-3xl flex flex-col flex-1 border border-blue-100/50 dark:border-blue-900/20 shadow-[0_0_0_1px_rgba(124,58,237,0.05),0_4px_24px_rgba(124,58,237,0.06)] overflow-hidden">
                                <Header />
                                <main className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-auto">
                                    {children}
                                </main>
                            </div>
                        </div>
                    </div>
                </AuthGuard>
            </CompanyProvider>
        </AuthProvider>
    );
}
