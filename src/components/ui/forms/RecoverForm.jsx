"use client";
import React, { useState } from 'react';
import { useAuth } from '@/components/helper/ContextProvider.jsx';
import { useToast } from '@/components/helper/ToastProvider.jsx';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RecoverForm() {
  const { forgotPassword, resetPassword } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('request'); 
  
  
  const [email, setEmail] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [devToken, setDevToken] = useState('');

  
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast("Email address is required", "error");
      return;
    }

    setRequestLoading(true);
    setDevToken('');
    try {
      const data = await forgotPassword(email);
      showToast(data.message || "Reset token generated successfully.", "success");
      if (data.token) {
        setDevToken(data.token);
        setToken(data.token); 
      }
      
      setTimeout(() => {
        setActiveTab('reset');
      }, 1000);
    } catch (err) {
      showToast(err.message || "Failed to request reset token", "error");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!token || !newPassword || !confirmPassword) {
      showToast("All fields are required", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setResetLoading(true);
    try {
      await resetPassword(token, newPassword);
      showToast("Password updated successfully! Please sign in with your new password.", "success");
      router.push('/signin');
    } catch (err) {
      showToast(err.message || "Failed to reset password", "error");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl border backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)] shadow-black/80">
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('request')}
          className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === 'request'
              ? 'border-violet-500 text-white font-bold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Request Reset
        </button>
        <button
          onClick={() => setActiveTab('reset')}
          className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === 'reset'
              ? 'border-violet-500 text-white font-bold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Reset Password
        </button>
      </div>

      {activeTab === 'request' ? (
        <form onSubmit={handleRequestSubmit} className="space-y-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-white mb-1">Recover Account</h3>
            <p className="text-xs">Enter your email to receive recovery instructions</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={requestLoading}
              className="w-full px-4 py-3 rounded-xl border text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={requestLoading}
            className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 active:scale-[0.98] transition-all duration-200"
          >
            {requestLoading ? 'Sending...' : 'Send Recovery Token'}
          </button>

          {devToken && (
            <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-800/40 text-violet-200 text-xs break-all mt-4 leading-relaxed">
              <span className="font-bold block text-violet-400 mb-1">🔧 Development Token Found:</span>
              {devToken}
            </div>
          )}
        </form>
      ) : (
        <form onSubmit={handleResetSubmit} className="space-y-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-white mb-1">Reset Password</h3>
            <p className="text-xs">Enter your reset token and new password</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Reset Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your token here"
              disabled={resetLoading}
              className="w-full px-4 py-3 rounded-xl border text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              disabled={resetLoading}
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
              disabled={resetLoading}
              className="w-full px-4 py-3 rounded-xl border text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={resetLoading}
            className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 active:scale-[0.98] transition-all duration-200"
          >
            {resetLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div className="mt-8 pt-6 border-t text-center text-sm">
        Back to{' '}
        <Link href="/signin" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
}
