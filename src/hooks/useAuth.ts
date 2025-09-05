"use client";

import { useEffect, useState } from 'react';
import { getCurrentUser, requireRole, type User } from '@/lib/auth';

export function useAuth(requiredRole?: 'ADMIN' | 'FARMER' | 'CONSUMER') {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (!currentUser) {
      setLoading(false);
      setAuthorized(false);
      window.location.href = '/login';
      return;
    }

    // If a specific role is required, check authorization
    if (requiredRole) {
      if (currentUser.role !== requiredRole) {
        setAuthorized(false);
        setLoading(false);
        // Show alert and redirect to appropriate dashboard
        alert(`Access denied. You need ${requiredRole} privileges to access this page.`);
        
        // Redirect to user's appropriate dashboard
        switch (currentUser.role) {
          case 'ADMIN':
            window.location.href = '/admin';
            break;
          case 'FARMER':
            window.location.href = '/farmer';
            break;
          case 'CONSUMER':
            window.location.href = '/consumer';
            break;
          default:
            window.location.href = '/login';
        }
        return;
      }
    }

    setAuthorized(true);
    setLoading(false);
  }, [requiredRole]);

  return { user, loading, authorized };
}

export function useRequireAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    if (!currentUser) {
      window.location.href = '/login';
    }
  }, []);

  return { user, loading };
}
