"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';

export default function PanelSettingsPage() {
  const { showToast } = useToast();
  
  // Settings form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  
  // Social links states
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  
  // Theme state
  const [theme, setTheme] = useState('dark');

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          const s = data.settings;
          setName(s.name || '');
          setEmail(s.email || '');
          setTitle(s.title || '');
          setBio(s.bio || '');
          setResumeUrl(s.resumeUrl || '');
          setTheme(s.theme || 'dark');

          if (s.socials) {
            setGithub(s.socials.github || '');
            setLinkedin(s.socials.linkedin || '');
            setTwitter(s.socials.twitter || '');
            setFacebook(s.socials.facebook || '');
            setInstagram(s.socials.instagram || '');
          }
        }
      } else {
        showToast('Failed to fetch settings metadata', 'error');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      showToast('Network error fetching configurations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      showToast('Name and email are required.', 'warning');
      return;
    }

    try {
      setSubmitLoading(true);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          title: title.trim() || null,
          bio: bio.trim() || null,
          resumeUrl: resumeUrl.trim() || null,
          theme,
          socials: {
            github: github.trim(),
            linkedin: linkedin.trim(),
            twitter: twitter.trim(),
            facebook: facebook.trim(),
            instagram: instagram.trim()
          }
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Settings configuration updated successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to save settings modifications', 'error');
      }
    } catch (err) {
      console.error('Update settings error:', err);
      showToast('Network error saving settings details', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">System Settings</h1>
        <p className="text-neutral-400 text-sm mt-1">Configure profile summaries, theme views, resume links, and social metadata.</p>
      </div>

      {loading ? (
        /* Skeleton loaders */
        <div className="max-w-4xl bg-neutral-900/10 border border-neutral-900 rounded-3xl p-6 sm:p-8 space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-10 bg-neutral-850 rounded-xl"></div>
            <div className="h-10 bg-neutral-850 rounded-xl"></div>
            <div className="h-10 bg-neutral-850 rounded-xl"></div>
            <div className="h-10 bg-neutral-850 rounded-xl"></div>
          </div>
          <div className="h-24 bg-neutral-850 rounded-xl"></div>
        </div>
      ) : (
        /* Settings Update Form */
        <form onSubmit={handleSubmit} className="max-w-4xl bg-neutral-900/10 border border-neutral-900 rounded-3xl p-6 sm:p-8 space-y-8">
          
          {/* Section 1: Developer Information */}
          <div className="space-y-5">
            <h2 className="text-xs font-bold text-violet-400 uppercase tracking-widest border-b border-neutral-900 pb-2">Developer Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Public Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmmed"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Contact Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. hello@portfolio.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Professional Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Default Site Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
                >
                  <option value="dark">Dark Theme</option>
                  <option value="light">Light Theme</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Bio Description Summary</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A brief bio displayed at the bottom, about, or contact pages..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Section 2: Online URLs & Assets */}
          <div className="space-y-5">
            <h2 className="text-xs font-bold text-violet-400 uppercase tracking-widest border-b border-neutral-900 pb-2">Social & Asset URLs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Resume PDF Link</label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/resume.pdf"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">GitHub Link</label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">LinkedIn Link</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Twitter Link</label>
                <input
                  type="url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://twitter.com/username"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Facebook Link</label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/username"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Instagram Link</label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end pt-4 border-t border-neutral-900">
            <button
              type="submit"
              disabled={submitLoading}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 active:scale-98 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 transition-all duration-200 shadow-md shadow-violet-600/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Save Settings Modifications'
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
