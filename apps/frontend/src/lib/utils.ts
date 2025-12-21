import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// For server-side: use backend service name in Docker, otherwise localhost
// For client-side: use NEXT_PUBLIC_API_URL if set, otherwise construct from window.location
export function getAPIUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://backend:4000';
  }
  
  // If NEXT_PUBLIC_API_URL is set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Otherwise, construct from current location
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
  
  // For production, construct api subdomain
  const protocol = window.location.protocol;
  const domain = hostname.replace(/^www\./, '');
  return `${protocol}//api.${domain}`;
}

// For backward compatibility - but prefer using getAPIUrl() function
// This will work in template strings: `${API_URL}`
export const API_URL = getAPIUrl();

// Get the base URL for Socket.IO (cannot use rewrites, needs full URL)
// Always use full URL, not relative path
export function getSocketUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://backend:4000';
  }
  
  // If NEXT_PUBLIC_API_URL is set, use it (remove /api if present)
  if (process.env.NEXT_PUBLIC_API_URL) {
    const url = process.env.NEXT_PUBLIC_API_URL;
    return url.replace('/api', '').replace(/\/$/, '');
  }
  
  // Otherwise, construct from current location
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
  
  // For production, construct api subdomain
  const protocol = window.location.protocol;
  const domain = hostname.replace(/^www\./, '');
  return `${protocol}//api.${domain}`;
}

// For backward compatibility - but prefer using getSocketUrl() function
export const SOCKET_URL = getSocketUrl();

