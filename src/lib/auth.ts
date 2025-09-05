// Utility functions for managing user sessions

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'FARMER' | 'CONSUMER';
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

// Set current user in localStorage
export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// Remove current user from localStorage
export function clearCurrentUser(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('currentUser');
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Check if user has specific role
export function hasRole(requiredRole: 'ADMIN' | 'FARMER' | 'CONSUMER'): boolean {
  const user = getCurrentUser();
  return user?.role === requiredRole;
}

// Check if user has any of the specified roles
export function hasAnyRole(roles: ('ADMIN' | 'FARMER' | 'CONSUMER')[]): boolean {
  const user = getCurrentUser();
  return user ? roles.includes(user.role) : false;
}

// Redirect to login if not authenticated
export function requireAuth(): void {
  if (!isAuthenticated()) {
    window.location.href = '/login';
  }
}

// Redirect to appropriate dashboard based on user role
export function redirectToDashboard(): void {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/login';
    return;
  }

  switch (user.role) {
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
}

// Require specific role access
export function requireRole(requiredRole: 'ADMIN' | 'FARMER' | 'CONSUMER'): void {
  const user = getCurrentUser();
  
  if (!user) {
    window.location.href = '/login';
    return;
  }
  
  if (user.role !== requiredRole) {
    // Redirect to their appropriate dashboard
    redirectToDashboard();
    return;
  }
}

// Show unauthorized access message and redirect
export function handleUnauthorizedAccess(): void {
  alert('You are not authorized to access this page. Redirecting to your dashboard.');
  redirectToDashboard();
}

// Logout user
export function logout(): void {
  clearCurrentUser();
  window.location.href = '/login';
}
