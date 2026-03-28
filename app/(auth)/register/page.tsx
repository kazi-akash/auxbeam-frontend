'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      toast.success('Registration successful!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-h4 text-center mb-6">Register</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-body-md-semibold mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-body-md"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-body-md-semibold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-body-md"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="password_confirmation" className="block text-body-md-semibold mb-2">
            Confirm Password
          </label>
          <input
            id="password_confirmation"
            type="password"
            value={formData.password_confirmation}
            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
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
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-body-sm text-text-secondary">Already have an account? </span>
        <Link href="/login" className="text-body-sm-semibold text-primary-600 hover:text-primary-700 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}
