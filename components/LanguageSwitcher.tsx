"use client";

import { useI18n, locales } from '@/lib/i18n/i18n-context';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function LanguageSwitcher() {
    const { locale, setLocale } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLocale = locales.find(l => l.code === locale);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Change language"
            >
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                    {currentLocale?.nativeName}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {locales.map((loc) => (
                        <button
                            key={loc.code}
                            onClick={() => {
                                setLocale(loc.code);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${locale === loc.code ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{loc.nativeName}</span>
                                {locale === loc.code && (
                                    <span className="text-green-600">✓</span>
                                )}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">{loc.name}</div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
