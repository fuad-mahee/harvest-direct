"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = () => {
    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/signup'];
    
    if (publicRoutes.includes(pathname)) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    const user = getCurrentUser();
    
    // If no user is logged in, redirect to login
    if (!user) {
      router.push('/login');
      setIsChecking(false);
      return;
    }

    // Check role-based access for protected routes
    const routeRoleMap = {
      '/admin': 'ADMIN',
      '/farmer': 'FARMER',
      '/consumer': 'CONSUMER'
    };

    const requiredRole = routeRoleMap[pathname as keyof typeof routeRoleMap];
    
    if (requiredRole && user.role !== requiredRole) {
      // Show access denied message
      alert(`Access denied. You need ${requiredRole} privileges to access this page.`);
      
      // Redirect to user's appropriate dashboard
      switch (user.role) {
        case 'ADMIN':
          router.push('/admin');
          break;
        case 'FARMER':
          router.push('/farmer');
          break;
        case 'CONSUMER':
          router.push('/consumer');
          break;
        default:
          router.push('/login');
      }
      setIsChecking(false);
      return;
    }

    setIsAuthorized(true);
    setIsChecking(false);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Redirect is happening
  }

  return <>{children}</>;
}
