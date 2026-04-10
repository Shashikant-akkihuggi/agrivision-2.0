"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useI18n } from "@/lib/i18n/i18n-context";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
    Home,
    Droplets,
    Cloud,
    TrendingUp,
    ShoppingCart,
    DollarSign,
    Map,
    Bell,
    LogOut,
    Sprout,
    Sparkles,
    Wrench,
} from "lucide-react";

const menuItems = [
    { icon: Home, labelKey: "nav.dashboard", href: "/dashboard" },
    { icon: Wrench, labelKey: "nav.tools", href: "/dashboard/tools" },
    { icon: Sparkles, labelKey: "nav.assistant", href: "/dashboard/assistant" },
    { icon: Droplets, labelKey: "nav.irrigation", href: "/dashboard/irrigation" },
    { icon: Cloud, labelKey: "nav.weather", href: "/dashboard/weather" },
    { icon: TrendingUp, labelKey: "nav.analytics", href: "/dashboard/analytics" },
    { icon: ShoppingCart, labelKey: "nav.marketplace", href: "/dashboard/marketplace" },
    { icon: DollarSign, labelKey: "nav.finance", href: "/dashboard/finance" },
    { icon: Map, labelKey: "nav.farm", href: "/dashboard/farm" },
    { icon: Bell, labelKey: "nav.alerts", href: "/dashboard/alerts" },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const { t } = useI18n();

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col relative">
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none" />

            <div className="relative z-10">
                {/* Logo Section with 3D Effect */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-br from-green-600 to-green-700 p-2.5 rounded-xl shadow-lg transition-smooth group-hover:shadow-xl group-hover:scale-105">
                            <Sprout className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-gray-900">Smart Agro</h1>
                            <p className="text-xs text-gray-500">Farming Platform</p>
                        </div>
                    </div>
                </div>

                {/* Navigation with Enhanced Hover States */}
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth relative overflow-hidden group
                                    ${isActive
                                        ? "bg-gradient-to-r from-green-50 to-green-100/50 text-green-700 font-medium shadow-sm"
                                        : "text-gray-700 hover:bg-gray-50"
                                    }
                                `}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-green-600 to-green-700 rounded-r-full" />
                                )}

                                {/* Icon with subtle animation */}
                                <Icon className={`w-5 h-5 transition-smooth ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="text-sm">{t(item.labelKey)}</span>

                                {/* Hover shimmer effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Language Switcher */}
                <div className="px-4 pb-3">
                    <LanguageSwitcher />
                </div>

                {/* User Section with Glass Effect */}
                <div className="p-4 border-t border-gray-200 bg-gradient-to-t from-gray-50/50 to-transparent">
                    <div className="mb-3 px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.phone}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition-smooth group"
                    >
                        <LogOut className="w-5 h-5 transition-smooth group-hover:scale-110" />
                        <span className="text-sm font-medium">{t('nav.logout')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
