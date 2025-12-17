import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// For server-side: use backend service name in Docker, otherwise localhost
// For client-side: use NEXT_PUBLIC_API_URL or localhost
export const API_URL = 
  typeof window === 'undefined'
    ? (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://backend:4000')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

