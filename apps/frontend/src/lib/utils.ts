import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// For server-side: use backend service name in Docker, otherwise use NEXT_PUBLIC_API_URL or default
// For client-side: ALWAYS use full URL to https://api.ftsmotors.ir (no proxy)
export function getAPIUrl(): string {
  // Server-side: use backend service name in Docker or environment variable
  if (typeof window === 'undefined') {
    // In Docker, use service name for internal communication
    // Priority: API_URL > NEXT_PUBLIC_API_URL > default
    const serverUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    if (serverUrl) {
      // Log in development to help debug
      if (process.env.NODE_ENV !== 'production') {
        console.log('[getAPIUrl] Server-side API URL:', serverUrl);
      }
      return serverUrl;
    }
    // Default to backend service name in Docker, or localhost for development
    const defaultUrl = process.env.NODE_ENV === 'production' ? 'http://backend:4000' : 'http://localhost:4000';
    if (process.env.NODE_ENV !== 'production') {
      console.log('[getAPIUrl] Using default server-side API URL:', defaultUrl);
    }
    return defaultUrl;
  }
  
  // Client-side: ALWAYS use full URL, never relative path
  // This ensures requests go directly to https://api.ftsmotors.ir, not through Next.js proxy
  const hostname = window.location.hostname;
  
  // Development: use localhost or NEXT_PUBLIC_API_URL
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  }
  
  // Production: always use https://api.ftsmotors.ir
  // Don't use NEXT_PUBLIC_API_URL in client-side to avoid proxy issues
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'https:';
  const domain = hostname.replace(/^www\./, '');
  
  // For ftsmotors.ir domain, always use api.ftsmotors.ir
  if (domain === 'ftsmotors.ir' || domain.endsWith('.ftsmotors.ir')) {
    return 'https://api.ftsmotors.ir';
  }
  
  // For other domains, construct api subdomain
  return `${protocol}//api.${domain}`;
}

// For backward compatibility - but prefer using getAPIUrl() function
// This will work in template strings: `${API_URL}`
// IMPORTANT: In client-side code, always use getAPIUrl() function instead of API_URL constant
// API_URL is evaluated at import time, which may not work correctly in client-side
export const API_URL = getAPIUrl();

// Get the base URL for Socket.IO (cannot use rewrites, needs full URL)
// Always use full URL, not relative path
export function getSocketUrl(): string {
  // Server-side: use backend service name in Docker
  if (typeof window === 'undefined') {
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://backend:4000';
  }
  
  // Client-side: ALWAYS use full URL to https://api.ftsmotors.ir
  const hostname = window.location.hostname;
  
  // Development: use localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
  
  // Production: always use https://api.ftsmotors.ir
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'https:';
  const domain = hostname.replace(/^www\./, '');
  
  // For ftsmotors.ir domain, always use api.ftsmotors.ir
  if (domain === 'ftsmotors.ir' || domain.endsWith('.ftsmotors.ir')) {
    return 'https://api.ftsmotors.ir';
  }
  
  // For other domains, construct api subdomain
  return `${protocol}//api.${domain}`;
}

// For backward compatibility - but prefer using getSocketUrl() function
// IMPORTANT: In client-side code, always use getSocketUrl() function instead of SOCKET_URL constant
export const SOCKET_URL = getSocketUrl();

