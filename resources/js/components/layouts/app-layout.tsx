// resources/js/components/layouts/app-layout.tsx
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Sidebar from './partials/sidebar';
import Header from './partials/header';
import type { PageProps } from '@/types/profile';

interface AppLayoutProps {
    title?: string;
    children: ReactNode;
}

export default function AppLayout({ title = 'Dashboard', children }: AppLayoutProps) {
    const { auth } = usePage<PageProps>().props;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const hasRedirectedRef = useRef(false);

    useEffect(() => {
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const isAuthRoute =
            currentPath === '/login' ||
            currentPath.startsWith('/auth/google') ||
            currentPath.startsWith('/oauth/authorize');

        if (!auth?.user && !hasRedirectedRef.current && !isAuthRoute) {
            hasRedirectedRef.current = true;
            const redirectTarget = `${window.location.origin}${currentPath}${currentSearch}`;
            const loginUrl = `/login?redirect=${encodeURIComponent(redirectTarget)}`;

            window.history.replaceState(null, '', loginUrl);
            window.location.assign(loginUrl);
            return;
        }

        if (auth?.user) {
            hasRedirectedRef.current = false;
        }
    }, [auth?.user]);

    return (
        <>
            <Head title={title} />
            <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-800 antialiased">
                {/* Mobile overlay */}
                {mobileOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}

                <Sidebar
                    collapsed={collapsed}
                    mobileOpen={mobileOpen}
                    onCollapseToggle={() => setCollapsed((prev) => !prev)}
                />

                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                    <Header title={title} user={auth.user} onMenuClick={() => setMobileOpen(true)} />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
                </div>
            </div>
        </>
    );
}