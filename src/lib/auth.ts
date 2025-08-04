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

// Redirect to login if not authenticated
export function requireAuth(): void {
  if (!isAuthenticated()) {
    window.location.href = '/login';
  }
}

// Logout user
export function logout(): void {
  clearCurrentUser();
  window.location.href = '/login';
}
