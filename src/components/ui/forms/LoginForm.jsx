"use client";
import React, { useState } from 'react';
import { useAuth } from '@/components/helper/ContextProvider.jsx';
import { useToast } from '@/components/helper/ToastProvider.jsx';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Email and password are required", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.user) {
        showToast("Logged in successfully!", "success");
        if (data.user.role === 'admin') {
          router.push('/panel');
        } else {
          router.push('/');
        }
      } else {
        showToast("Invalid credentials", "error");
      }
    } catch (err) {
      showToast(err.message || "Invalid email or password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)] shadow-black/80">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Sign In
        </h2>
        <p className="text-neutral-400 text-sm">Access the administrative dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">Password</label>
            <Link href="/recover-account" className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-violet-950/40 hover:shadow-violet-950/60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center text-sm text-neutral-400">
        Don't have an admin account?{' '}
        <Link href="/signup" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
