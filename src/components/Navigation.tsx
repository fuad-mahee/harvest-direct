"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser, logout } from '@/lib/auth';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Check for user authentication
    const currentUser = getCurrentUser();
    setUser(currentUser);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-green rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l8 5v6c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V8l8-5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11l4 4 4-4" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-green rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              </div>
              <div>
                <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  Harvest<span className="text-gradient">Direct</span>
                </h1>
                <p className={`text-xs transition-colors duration-300 ${
                  isScrolled ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  Farm to Table
                </p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className={`font-medium transition-colors duration-300 hover:text-green-600 ${
                  isScrolled ? 'text-gray-700' : 'text-gray-100'
                }`}
              >
                Home
              </Link>
              
              {/* Show different links based on user role */}
              {!user ? (
                <>
                  <Link 
                    href="/consumer" 
                    className={`font-medium transition-colors duration-300 hover:text-green-600 ${
                      isScrolled ? 'text-gray-700' : 'text-gray-100'
                    }`}
                  >
                    Browse Products
                  </Link>
                  <Link 
                    href="/farmer" 
                    className={`font-medium transition-colors duration-300 hover:text-green-600 ${
                      isScrolled ? 'text-gray-700' : 'text-gray-100'
                    }`}
                  >
                    For Farmers
                  </Link>
                </>
              ) : (
                <>
                  {user.role === 'CONSUMER' && (
                    <Link 
                      href="/consumer" 
                      className={`font-medium transition-colors duration-300 hover:text-green-600 ${
                        isScrolled ? 'text-gray-700' : 'text-gray-100'
                      }`}
                    >
                      My Dashboard
                    </Link>
                  )}
                  {user.role === 'FARMER' && (
                    <Link 
                      href="/farmer" 
                      className={`font-medium transition-colors duration-300 hover:text-green-600 ${
                        isScrolled ? 'text-gray-700' : 'text-gray-100'
                      }`}
                    >
                      Farmer Dashboard
                    </Link>
                  )}
                  {user.role === 'ADMIN' && (
                    <Link 
                      href="/admin" 
                      className={`font-medium transition-colors duration-300 hover:text-green-600 ${
                        isScrolled ? 'text-gray-700' : 'text-gray-100'
                      }`}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {!user ? (
                <>
                  <Link
                    href="/login"
                    className={`font-medium transition-colors duration-300 hover:text-green-600 ${
                      isScrolled ? 'text-gray-700' : 'text-gray-100'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary animate-pulse-glow"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <span className={`text-sm ${isScrolled ? 'text-gray-600' : 'text-gray-300'}`}>
                    Welcome, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-100 hover:bg-white/10'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200/20">
            <div className="px-4 py-4 space-y-4">
              <Link 
                href="/" 
                className="block font-medium text-gray-700 hover:text-green-600 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {/* Role-based mobile links */}
              {!user ? (
                <>
                  <Link 
                    href="/consumer" 
                    className="block font-medium text-gray-700 hover:text-green-600 transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Browse Products
                  </Link>
                  <Link 
                    href="/farmer" 
                    className="block font-medium text-gray-700 hover:text-green-600 transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    For Farmers
                  </Link>
                  <hr className="border-gray-200" />
                  <Link 
                    href="/login" 
                    className="block font-medium text-gray-700 hover:text-green-600 transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="block btn-primary text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  {user.role === 'CONSUMER' && (
                    <Link 
                      href="/consumer" 
                      className="block font-medium text-gray-700 hover:text-green-600 transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Dashboard
                    </Link>
                  )}
                  {user.role === 'FARMER' && (
                    <Link 
                      href="/farmer" 
                      className="block font-medium text-gray-700 hover:text-green-600 transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Farmer Dashboard
                    </Link>
                  )}
                  {user.role === 'ADMIN' && (
                    <Link 
                      href="/admin" 
                      className="block font-medium text-gray-700 hover:text-green-600 transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <hr className="border-gray-200" />
                  <div className="text-sm text-gray-600 px-2">
                    Welcome, {user.name} ({user.role})
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full btn-secondary text-center"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div className="h-20"></div>
    </>
  );
}
