"use client";

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';

interface RoleGuardProps {
  allowedRoles: ('ADMIN' | 'FARMER' | 'CONSUMER')[];
  children: React.ReactNode;
  fallbackMessage?: string;
}

export default function RoleGuard({ 
  allowedRoles, 
  children, 
  fallbackMessage = "You don't have permission to access this content." 
}: RoleGuardProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    
    if (!user) {
      setHasAccess(false);
      setIsLoading(false);
      return;
    }

    const userHasAccess = allowedRoles.includes(user.role);
    setHasAccess(userHasAccess);
    setIsLoading(false);
  }, [allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700 font-medium">{fallbackMessage}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
