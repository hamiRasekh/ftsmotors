'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { PageLoader } from './PageLoader';

export function NavigationLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const prevPathnameRef = useRef(pathname);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any existing timeout
  const clearLoadingTimeout = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  };

  // Handle initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    loadingTimeoutRef.current = timer;
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Handle route changes
  useEffect(() => {
    // Only show loader if pathname actually changed
    if (prevPathnameRef.current !== pathname) {
      // Clear any existing timeout
      clearLoadingTimeout();
      
      // Show loader immediately
      setIsLoading(true);
      
      // Update previous pathname
      prevPathnameRef.current = pathname;
      
      // Hide loader after a short delay (enough for page transition)
      const timer = setTimeout(() => {
        setIsLoading(false);
        loadingTimeoutRef.current = null;
      }, 400);
      
      loadingTimeoutRef.current = timer;
    }

    return () => {
      clearLoadingTimeout();
    };
  }, [pathname]);

  // Listen for link clicks to show loader immediately
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]');
      
      if (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/') && !href.startsWith('#') && !link.hasAttribute('target')) {
          // Clear existing timeout
          clearLoadingTimeout();
          
          // Show loader immediately
          setIsLoading(true);
        }
      }
    };

    document.addEventListener('click', handleLinkClick, true);
    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearLoadingTimeout();
    };
  }, []);

  return <PageLoader isLoading={isLoading} />;
}

