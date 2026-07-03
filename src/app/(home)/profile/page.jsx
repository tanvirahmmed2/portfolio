"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/helper/ContextProvider.jsx';
import { useToast } from '@/components/helper/ToastProvider.jsx';

export default function HomeProfilePage() {
  const { user, loading: authLoading, refetch } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [submitLoading, setSubmitLoading] = useState(false);

  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      showToast('Name and email are required.', 'warning');
      return;
    }

    if (password) {
      if (password.length < 6) {
        showToast('Password must be at least 6 characters long.', 'warning');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
      }
    }

    try {
      setSubmitLoading(true);
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      };

      if (password) {
        payload.password = password;
      }

      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Profile credentials updated successfully!', 'success');
        setPassword('');
        setConfirmPassword('');
        
        await refetch();
      } else {
        showToast(data.error || 'Failed to update credentials', 'error');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      showToast('Network error updating profile credentials', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-4 border-violet-500/15 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-violet-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-sm font-semibold tracking-wide">Loading profile details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-28 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden bg-white text-slate-650 selection:bg-violet-100 selection:text-violet-900">
      
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl w-full relative z-10 flex flex-col items-center">
        
        
        <div className="text-center max-w-md w-full">
          <span className="text-[10px] font-black tracking-widest text-violet-600 uppercase">Manage Account</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-1">Profile Settings</h1>
          <p className="text-xs mt-2 leading-relaxed text-slate-500">
            Update your credentials, name representation, and sign-in passwords.
          </p>
        </div>

        
        <form onSubmit={handleSubmit} className="max-w-md w-full mt-6 p-6 sm:p-8 border border-slate-200 bg-white rounded-3xl space-y-5 shadow-xl">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Username</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-650 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-650 transition-all"
            />
          </div>

          
          <div className="border-t border-slate-100 pt-4 mt-4 space-y-4">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider block text-slate-500">Security Credentials</span>
              <span className="text-[8px] block mt-0.5 text-slate-400">Leave blank to retain your current password.</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters (Optional)"
                className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-650 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password credentials (Optional)"
                className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-650 transition-all"
              />
            </div>
          </div>

          
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 active:scale-98 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 transition-all duration-200 shadow-md shadow-violet-600/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Save Profile Updates'
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
