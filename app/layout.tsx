import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari, Noto_Sans_Kannada } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/i18n-context";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
    subsets: ["devanagari"],
    variable: "--font-devanagari",
});

const notoSansKannada = Noto_Sans_Kannada({
    subsets: ["kannada"],
    variable: "--font-kannada",
});

export const metadata: Metadata = {
    title: "Smart Agro Platform",
    description: "AI-powered farming platform for smart irrigation, marketplace, and finance",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${notoSansDevanagari.variable} ${notoSansKannada.variable} font-sans`}>
                <I18nProvider>
                    {children}
                </I18nProvider>
            </body>
        </html>
    );
}
