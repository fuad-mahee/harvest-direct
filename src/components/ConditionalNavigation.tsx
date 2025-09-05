"use client";

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Dashboard pages that shouldn't show the main navigation
  const dashboardPages = ['/admin', '/farmer', '/consumer'];
  
  // Don't show navigation on dashboard pages
  if (dashboardPages.includes(pathname)) {
    return null;
  }
  
  // Show navigation on all other pages (home, login, signup, etc.)
  return <Navigation />;
}
