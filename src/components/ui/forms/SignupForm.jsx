"use client";
import React, { useState } from 'react';
import { useAuth } from '@/components/helper/ContextProvider.jsx';
import { useToast } from '@/components/helper/ToastProvider.jsx';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupForm() {
  const { signup, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await signup(email, password, name);
      if (data.user) {
        showToast("Account created successfully!", "success");
        if (data.user.role === 'admin') {
          router.push('/panel');
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      showToast(err.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl border backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)] shadow-black/80">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-sm">Join to manage your professional portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-violet-950/40 hover:shadow-violet-950/60"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t text-center text-sm">
        Already have an account?{' '}
        <Link href="/signin" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
}
