// resources/js/components/layouts/partials/header.tsx
import { router } from '@inertiajs/react';
import { Menu, ChevronDown, UserRound, Settings, LogOut } from 'lucide-react';
import type { User } from '@/types/models';
import { logout } from '@/routes';

interface HeaderProps {
    title: string;
    user: User;
    onMenuClick: () => void;
}

const FALLBACK_AVATAR = '/images/profile/profile.png';

function fullName(user: User) {
    const p = user.profile;
    if (!p) return user.username;
    return [p.first_name, p.middle_name, p.last_name].filter(Boolean).join(' ');
}

export default function Header({ title, user, onMenuClick }: HeaderProps) {
    const avatar = user.profile?.image_url || FALLBACK_AVATAR;
    const name = fullName(user);
    const role = user.role || 'User';

    const handleLogout = () => {
        router.post(logout.url(), {}, {
            replace: true,
            preserveState: false,
            onSuccess: () => {
                window.history.replaceState(null, '', '/login');
                window.location.assign('/login');
            },
        });
    };

    return (
        <header
            className="shrink-0 z-10 flex items-center justify-between h-16 px-4 md:px-6
                bg-white border-b border-gray-200 shadow-sm"
        >
            {/* LEFT */}
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700
                        transition-colors focus:outline-none"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Desktop breadcrumb */}
                <nav className="hidden lg:flex items-center gap-2 text-sm" aria-label="Breadcrumb">
                    <span className="font-semibold text-gray-800">ICT-AIMS</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-500">{title}</span>
                </nav>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1" />

                {/* User dropdown (daisyUI) */}
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="flex items-center gap-2.5 pl-1 pr-2 py-1.5 rounded-xl
                            hover:bg-gray-100 transition-colors select-none"
                    >
                        <div className="relative shrink-0">
                            <div className="avatar">
                                <div className="w-9 h-9 rounded-full ring-2 ring-green-200">
                                    <img src={avatar} alt={name} />
                                </div>
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
                        </div>

                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-gray-800 leading-tight">{name}</p>
                            <p className="text-xs text-gray-400 leading-tight">@{user.username}</p>
                        </div>

                        <ChevronDown className="hidden md:block w-3.5 h-3.5 text-gray-400 shrink-0" />
                    </div>

                    {/* Dropdown panel */}
                    <div
                        tabIndex={0}
                        className="dropdown-content menu z-50 mt-2 w-72 bg-white rounded-2xl shadow-xl
                            ring-1 ring-gray-200 overflow-hidden p-0"
                    >
                        {/* User card */}
                        <div className="px-5 pt-5 pb-4 bg-gradient-to-br from-[#0B712C] to-[#053d18] text-white">
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="w-14 h-14 rounded-full ring-2 ring-white/30">
                                        <img src={avatar} alt={name} />
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-base leading-tight">{name}</p>
                                    <p className="text-green-200 text-sm mt-0.5">@{user.username}</p>
                                    <span
                                        className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5
                                            rounded-full bg-white/15 text-white/90 text-xs font-medium"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        {role}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-green-200">
                                <div>
                                    <span className="block text-white font-medium text-[0.8rem] truncate">
                                        {user.email}
                                    </span>
                                    <span>Email</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-white font-medium text-[0.8rem]">Just now</span>
                                    <span>Last Login</span>
                                </div>
                            </div>
                        </div>

                        {/* Menu items — placeholders only */}
                        <div className="py-2">
                            <a
                                href="#"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                    hover:bg-gray-50 hover:text-[#0B712C] transition-colors group"
                            >
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-green-50 transition-colors shrink-0">
                                    <UserRound className="w-4 h-4" />
                                </span>
                                My Profile
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                    hover:bg-gray-50 hover:text-[#0B712C] transition-colors group"
                            >
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-green-50 transition-colors shrink-0">
                                    <Settings className="w-4 h-4" />
                                </span>
                                Settings
                            </a>
                        </div>

                        {/* Sign out */}
                        <div className="border-t border-gray-100 py-2">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-600
                                    hover:bg-rose-50 transition-colors group"
                            >
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 group-hover:bg-rose-100 transition-colors shrink-0">
                                    <LogOut className="w-4 h-4" />
                                </span>
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}