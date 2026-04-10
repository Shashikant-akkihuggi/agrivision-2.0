import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Safe number formatting utilities
export function formatNumber(value: number | null | undefined): string {
    return Number(value || 0).toLocaleString();
}

export function formatCurrency(amount: number | null | undefined): string {
    const safeAmount = Number(amount || 0);
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(safeAmount);
}

export function formatDecimal(value: number | null | undefined, decimals: number = 1): string {
    const safeValue = Number(value || 0);
    return safeValue.toFixed(decimals);
}

export function formatPercentage(value: number | null | undefined): string {
    const safeValue = Number(value || 0);
    return `${safeValue}%`;
}

export function displayValue(value: number | null | undefined, fallback: string = "—"): string {
    return value != null && !isNaN(Number(value)) ? formatNumber(value) : fallback;
}

export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}
