"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';
import Link from 'next/link';

export default function ContactPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(null);

  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data.settings);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    }
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      showToast('Please fill out all fields.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Message sent successfully! We will get back to you shortly.', 'success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        showToast(data.error || 'Failed to send message. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Submit contact error:', err);
      showToast('Network error sending message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-28 px-6 sm:px-8 relative overflow-hidden bg-white text-slate-650 selection:bg-violet-100 selection:text-violet-900 flex items-center justify-center">
      
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl w-full relative z-10 flex flex-col items-center justify-center gap-6">

        <div className="w-full flex flex-col items-center justify-center gap-2 text-center max-w-2xl">
          <span className="text-[10px] font-black tracking-widest text-violet-600 uppercase">Say Hello</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-1">Get in Touch</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Have a project idea, job opening, or simply want to chat? Send a message and let's construct something awesome together.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-3xl mt-6 p-6 sm:p-8 border border-slate-200 bg-slate-50/20 rounded-3xl space-y-5 shadow-xl">
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col sm:flex-row items-center gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-650 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-650 transition-all"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can I help you?"
                className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-650 transition-all"
              />
            </div>

            <div className="w-full flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Message Content</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me more about your requirements or questions..."
                className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-650 transition-all resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 active:scale-98 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 transition-all duration-200 shadow-md shadow-violet-600/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
