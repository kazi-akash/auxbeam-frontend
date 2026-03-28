'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-h4 text-center mb-6">Login</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-body-md-semibold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-body-md"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-body-md-semibold mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-body-md"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-500 text-text-primary py-3 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-body-md-semibold"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/forgot-password" className="text-body-sm text-primary-600 hover:text-primary-700 hover:underline">
          Forgot password?
        </Link>
      </div>

      <div className="mt-4 text-center">
        <span className="text-body-sm text-text-secondary">Don't have an account? </span>
        <Link href="/register" className="text-body-sm-semibold text-primary-600 hover:text-primary-700 hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}
