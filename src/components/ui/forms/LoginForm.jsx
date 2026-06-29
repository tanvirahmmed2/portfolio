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
    <div className="w-auto shadow-2xl p-4 md:p-8 rounded-2xl min-w-80 flex-col flex items-center justify-center gap-8">
      
        <p className="text-sm">Access the administrative dashboard</p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div className='w-full flex flex-col gap-2'>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=""
            disabled={loading}
            className="w-full border border-slate-400 rounded-2xl px-4 py-2 outline-none"
          />
        </div>

        <div className='w-full flex flex-col gap-2'>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider">Password</label>
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
            className="w-full border border-slate-400 rounded-2xl px-4 py-2 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl text-white cursor-pointer bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-violet-950/40 hover:shadow-violet-950/60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t text-center text-sm">
        Don't have an admin account?{' '}
        <Link href="/signup" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
