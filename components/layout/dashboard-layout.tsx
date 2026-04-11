'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useAuth } from '@/lib/auth-context';
import { SidebarProvider, useSidebar } from '@/lib/sidebar-context';

function Layout({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const { collapsed } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) router.replace('/login');
  }, [token, isLoading, router]);

  if (isLoading || !token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ marginLeft: undefined }}
        // On desktop: shift by sidebar width. On mobile: no margin (sidebar is overlay).
      >
        {/* Invisible spacer that matches sidebar width on desktop */}
        <div
          className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
          style={{ position: 'fixed', pointerEvents: 'none' }}
        />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="p-4 pt-16 lg:pt-4 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Layout>{children}</Layout>
    </SidebarProvider>
  );
}
