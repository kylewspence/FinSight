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

// client/src/lib/utils.ts (add to existing file)

export function getStreetViewImage(address: string): string {
  const formattedAddress = encodeURIComponent(address);
  const size = '600x400'; // Width x Height
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.warn('No Google Maps API key found in environment variables');
    return 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop';
  }

  return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${formattedAddress}&key=${apiKey}`;
}
