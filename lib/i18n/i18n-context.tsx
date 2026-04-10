"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from './translations/en.json';
import hi from './translations/hi.json';
import kn from './translations/kn.json';

type Locale = 'en' | 'hi' | 'kn';

type Translations = typeof en;

const translations: Record<Locale, Translations> = {
    en,
    hi,
    kn,
};

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'smart-agro-locale';

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load saved locale from localStorage
        const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale;
        if (savedLocale && ['en', 'hi', 'kn'].includes(savedLocale)) {
            setLocaleState(savedLocale);
        }
        setMounted(true);
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);

        // Update HTML lang attribute for accessibility
        document.documentElement.lang = newLocale;
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[locale];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Fallback to English if key not found
                value = translations.en;
                for (const fallbackKey of keys) {
                    if (value && typeof value === 'object' && fallbackKey in value) {
                        value = value[fallbackKey];
                    } else {
                        console.warn(`Translation key not found: ${key}`);
                        return key;
                    }
                }
                break;
            }
        }

        return typeof value === 'string' ? value : key;
    };

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return null;
    }

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return context;
}

export const locales = [
    { code: 'en' as Locale, name: 'English', nativeName: 'English' },
    { code: 'hi' as Locale, name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'kn' as Locale, name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];
