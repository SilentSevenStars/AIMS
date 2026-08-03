// resources/js/components/layouts/partials/sidebar.tsx
import { useState } from 'react';
import {
    Home,
    Users,
    Box,
    Building2,
    Truck,
    UserRound,
    Settings,
    FileText,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react';

interface SidebarProps {
    collapsed: boolean;
    mobileOpen: boolean;
    onCollapseToggle: () => void;
}

type DropdownKey = 'users' | 'equipment' | 'management' | 'settings';

/** Single, non-dropdown nav link. Placeholder href only — wire up real routes later. */
function NavLink({
    icon: Icon,
    label,
    collapsed,
    active = false,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    collapsed: boolean;
    active?: boolean;
}) {
    return (
        <a
            href="#"
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium group
                ${active ? 'bg-white/15 text-white shadow-sm' : 'text-green-200 hover:bg-white/10 hover:text-white'}`}
        >
            {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-white/80" />
            )}
            <Icon
                className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-green-300 group-hover:text-white'}`}
            />
            {!collapsed && <span className="truncate">{label}</span>}
        </a>
    );
}

/** Collapsible group of sub-links. Placeholder hrefs only. */
function NavDropdown({
    icon: Icon,
    label,
    collapsed,
    open,
    onToggle,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    collapsed: boolean;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="relative">
            <button
                type="button"
                onClick={onToggle}
                className="relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all group text-green-200 hover:bg-white/10 hover:text-white"
            >
                <Icon className="w-5 h-5 shrink-0 text-green-300 group-hover:text-white" />
                {!collapsed && (
                    <>
                        <span className="flex-1 text-left truncate">{label}</span>
                        <ChevronRight
                            className={`w-3.5 h-3.5 shrink-0 text-green-300 transition-transform duration-200 ${
                                open ? 'rotate-90' : ''
                            }`}
                        />
                    </>
                )}
            </button>
            {!collapsed && open && (
                <div className="mt-0.5 ml-8 pl-3 border-l border-green-800/60 space-y-0.5 py-1">
                    {children}
                </div>
            )}
        </div>
    );
}

/** Sub-link used inside a NavDropdown. Placeholder href only. */
function SubLink({ label, active = false }: { label: string; active?: boolean }) {
    return (
        <a
            href="#"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors
                ${active ? 'text-white bg-white/10' : 'text-green-300 hover:text-white hover:bg-white/5'}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? 'bg-white' : 'bg-[#0B712C]'}`} />
            {label}
        </a>
    );
}

export default function Sidebar({ collapsed, mobileOpen, onCollapseToggle }: SidebarProps) {
    const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);

    const toggleDropdown = (key: DropdownKey) => {
        setOpenDropdown((current) => (current === key ? null : key));
    };

    return (
        <aside
            className={`fixed lg:relative z-30 flex flex-col h-full
                bg-gradient-to-b from-[#053d18] to-[#0B712C] text-white
                overflow-y-auto overflow-x-hidden shrink-0
                transition-all duration-300 ease-in-out
                ${collapsed ? 'lg:w-20' : 'lg:w-64'}
                w-64 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        >
            {/* Brand */}
            <a href="#" className="flex items-center gap-3 px-4 py-4 border-b border-white/10 shrink-0 min-h-[72px]">
                <img
                    src="/images/logo/clsu.png"
                    alt="CLSU Logo"
                    className="w-12 h-12 object-contain shrink-0"
                />
                {!collapsed && (
                    <div className="overflow-hidden whitespace-nowrap">
                        <span className="block text-base font-bold tracking-tight leading-none">
                            Asset Inventory
                        </span>
                        <span className="block text-[10px] text-green-300 mt-0.5 uppercase tracking-widest">
                            Management
                        </span>
                    </div>
                )}
            </a>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {!collapsed && (
                    <p className="px-2 pb-1 pt-2 text-[10px] uppercase tracking-widest text-green-400 font-semibold">
                        Main
                    </p>
                )}

                <NavLink icon={Home} label="Dashboard" collapsed={collapsed} active />

                {!collapsed && (
                    <p className="px-2 pb-1 pt-4 text-[10px] uppercase tracking-widest text-green-400 font-semibold">
                        Manage
                    </p>
                )}

                <NavLink icon={Home} label="Inventory" collapsed={collapsed} />

                <NavDropdown
                    icon={Users}
                    label="Users"
                    collapsed={collapsed}
                    open={openDropdown === 'users'}
                    onToggle={() => toggleDropdown('users')}
                >
                    <SubLink label="All Users" />
                    <SubLink label="Roles" />
                    <SubLink label="Permissions" />
                </NavDropdown>

                <NavDropdown
                    icon={Box}
                    label="Equipments"
                    collapsed={collapsed}
                    open={openDropdown === 'equipment'}
                    onToggle={() => toggleDropdown('equipment')}
                >
                    <SubLink label="Equipment" />
                    <SubLink label="Category" />
                    <SubLink label="Unit" />
                </NavDropdown>

                <NavDropdown
                    icon={Building2}
                    label="Managements"
                    collapsed={collapsed}
                    open={openDropdown === 'management'}
                    onToggle={() => toggleDropdown('management')}
                >
                    <SubLink label="Program" />
                    <SubLink label="Archive Program" />
                    <SubLink label="Office" />
                    <SubLink label="Archive Office" />
                    <SubLink label="Department" />
                    <SubLink label="Archive Department" />
                    <SubLink label="Inspector" />
                </NavDropdown>

                <NavLink icon={Truck} label="Suppliers" collapsed={collapsed} />
                <NavLink icon={UserRound} label="End User" collapsed={collapsed} />

                {!collapsed && (
                    <p className="px-2 pb-1 pt-4 text-[10px] uppercase tracking-widest text-green-400 font-semibold">
                        System
                    </p>
                )}

                <NavDropdown
                    icon={Settings}
                    label="Settings"
                    collapsed={collapsed}
                    open={openDropdown === 'settings'}
                    onToggle={() => toggleDropdown('settings')}
                >
                    <SubLink label="Activity Log" />
                    <SubLink label="Security" />
                    <SubLink label="Email" />
                </NavDropdown>

                <NavLink icon={FileText} label="Activity Logs" collapsed={collapsed} />
            </nav>

            {/* Collapse button (desktop only) */}
            <div className="hidden lg:flex items-center justify-end px-3 py-3 border-t border-white/10 shrink-0">
                <button
                    type="button"
                    onClick={onCollapseToggle}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-green-300 hover:bg-white/10
                        hover:text-white text-xs font-medium transition-colors w-full"
                >
                    <ChevronLeft
                        className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                            collapsed ? 'rotate-180' : ''
                        }`}
                    />
                    {!collapsed && <span className="whitespace-nowrap">Collapse</span>}
                </button>
            </div>
        </aside>
    );
}