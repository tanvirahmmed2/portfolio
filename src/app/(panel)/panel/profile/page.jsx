"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';

export default function PanelProfilePage() {
  const { showToast } = useToast();

  // Profile states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Password change states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await fetch('/api/user');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setName(data.user.name || '');
            setEmail(data.user.email || '');
          }
        } else {
          showToast('Failed to fetch profile details', 'error');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        showToast('Network error fetching profile details', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      showToast('Name and email are required.', 'warning');
      return;
    }

    // Password validation if entered
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
        showToast('Profile updated successfully!', 'success');
        setPassword('');
        setConfirmPassword('');
        // Update credentials if email changed
        if (data.user) {
          setName(data.user.name || '');
          setEmail(data.user.email || '');
        }
      } else {
        showToast(data.error || 'Failed to update profile details', 'error');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      showToast('Network error updating profile credentials', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Account Profile Settings</h1>
        <p className="text-neutral-400 text-sm mt-1">Configure your personal admin details, email addresses, and security passwords.</p>
      </div>

      {loading ? (
        /* Skeleton loading */
        <div className="max-w-xl bg-neutral-900/10 border border-neutral-900 rounded-3xl p-6 sm:p-8 space-y-5 animate-pulse">
          <div className="h-10 bg-neutral-850 rounded-xl"></div>
          <div className="h-10 bg-neutral-850 rounded-xl"></div>
          <div className="h-10 bg-neutral-850 rounded-xl"></div>
          <div className="h-10 bg-neutral-850 rounded-xl"></div>
        </div>
      ) : (
        /* Profile Edit Form */
        <form onSubmit={handleSubmit} className="max-w-xl bg-neutral-900/10 border border-neutral-900 rounded-3xl p-6 sm:p-8 space-y-5">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Account Username</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Administrator"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@portfolio.com"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 transition-all"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-900 my-4 pt-4">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">Change Password</span>
            <span className="text-[9px] text-neutral-600 block mb-4">Leave fields blank if you do not want to alter your password credentials.</span>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters (Optional)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password changes (Optional)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitLoading}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 active:scale-98 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 transition-all duration-200 shadow-md shadow-violet-600/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Save Profile Details'
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
