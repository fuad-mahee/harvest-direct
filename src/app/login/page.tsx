"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      // Store user data in localStorage for session management
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      // Redirect based on user role
      if (data.user?.role === 'ADMIN') {
        router.push('/admin');
      } else if (data.user?.role === 'FARMER') {
        router.push('/farmer');
      } else if (data.user?.role === 'CONSUMER') {
        router.push('/consumer');
      } else {
        router.push('/admin'); // fallback
      }
    } else {
      setError(data.error || 'Invalid credentials');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <button 
            type="button"
            onClick={() => router.push('/signup')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign up here
          </button>
        </div>
      </form>
    </div>
  );
}
