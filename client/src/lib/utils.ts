import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyShort(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
// client/src/lib/utils.ts (add to existing file)

export function getStreetViewImage(address: string): string {
  const formattedAddress = encodeURIComponent(address);
  const size = '600x400'; // Width x Height
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.warn('No Google Maps API key found in environment variables');
    return '';
  }

  return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${formattedAddress}&key=${apiKey}`;
}

// No longer need. API provides formatted address.
export function normalizeAddress(address: string): string {
  const parts = address.split(',').map((part) => part.trim());
  const normalized = parts.map((part) =>
    part
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  );
  return normalized.join(', ');
}
