"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';
import Link from 'next/link';

export default function ContactPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(null);

  // Form states
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
    <div className="w-full flex min-h-screen items-center justify-center gap-5 py-20 px-4">


      <div className="w-full flex flex-col items-center justify-center gap-6">

        <div className='w-full flex flex-col items-center justify-center gap-3'>
          <span className="text-3xl font-black tracking-widest text-violet-400 uppercase">Say Hello</span>
          <p className=" mt-3 leading-relaxed">
            Have a project idea, job opening, or simply want to chat? Send a message and let's construct something awesome together.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full gap-8 flex-col max-w-6xl">
          <div className="w-full flex flex-col items-center justify-center gap-4">
            <div className="w-full flex flex-row items-center justify-center gap-3">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[10px] font-bold uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-400 rounded-2xl outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[10px] font-bold uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-400 rounded-2xl outline-none"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-slate-400 rounded-2xl outline-none"
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider">Message Content</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-slate-400 rounded-2xl outline-none"
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
