import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// For server-side: use backend service name in Docker, otherwise localhost
// For client-side: use relative path /api which will be proxied by Next.js rewrites
export const API_URL = 
  typeof window === 'undefined'
    ? (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://backend:4000')
    : (process.env.NEXT_PUBLIC_API_URL || '/api');

// Get the base URL for Socket.IO (cannot use rewrites, needs full URL)
// Always use full URL, not relative path
// For client-side, use NEXT_PUBLIC_API_URL or construct from current origin
export const SOCKET_URL = 
  typeof window === 'undefined'
    ? (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://backend:4000')
    : (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.startsWith('/')
        ? process.env.NEXT_PUBLIC_API_URL
        : (typeof window !== 'undefined' 
            ? `${window.location.protocol}//${window.location.hostname}:4000`
            : 'http://localhost:4000'));

