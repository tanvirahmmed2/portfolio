"use client";
import React, { useState, useEffect } from 'react';

export default function AboutPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data.settings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 py-24 px-6 sm:px-8 relative overflow-hidden">
      
      {/* Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">Who I Am</span>
          <h1 className="text-4xl font-black text-white leading-tight">About Me</h1>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-xl">
            A comprehensive breakdown of my engineering philosophy, background history, and current credentials.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-6 w-1/2 bg-neutral-900 rounded"></div>
            <div className="h-40 bg-neutral-900 rounded-3xl"></div>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Core Card */}
            <div className="p-6 sm:p-8 bg-neutral-900/10 border border-neutral-900 rounded-3xl space-y-6">
              <h2 className="text-lg font-bold text-white">
                Hi, I'm {settings?.name || 'Tanvir Ahmmed'}, a passionate {settings?.title || 'Full-Stack Developer'}.
              </h2>
              
              <p className="text-xs text-neutral-400 leading-relaxed whitespace-pre-line">
                {settings?.bio || 'Building web applications with optimized pipelines, structured databases, and responsive client layouts. My goal is to engineer software that scales effectively and provides seamless, robust user experiences.'}
              </p>

              {/* Resume download button if present */}
              {settings?.resumeUrl && (
                <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-white uppercase block">Curriculum Vitae</span>
                    <span className="text-[8px] text-neutral-500 block">Download my resume PDF to view full professional credits.</span>
                  </div>
                  
                  <a
                    href={settings.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold text-white bg-violet-600 hover:bg-violet-500 transition-all shadow-md shadow-violet-600/10 hover:-translate-y-0.5 self-start sm:self-auto cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Resume
                  </a>
                </div>
              )}
            </div>

            {/* Engineering Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 bg-neutral-900/10 border border-neutral-900 rounded-2xl space-y-2">
                <span className="text-lg">💻</span>
                <h3 className="text-xs font-bold text-white">Full-Stack Capability</h3>
                <p className="text-[10px] text-neutral-500 leading-relaxed">
                  Proficient in React, Next.js, Node.js, and structured relational database design.
                </p>
              </div>

              <div className="p-5 bg-neutral-900/10 border border-neutral-900 rounded-2xl space-y-2">
                <span className="text-lg">⚙️</span>
                <h3 className="text-xs font-bold text-white">Optimized Architecture</h3>
                <p className="text-[10px] text-neutral-500 leading-relaxed">
                  Writing clean, semantic, and reusable code modules that compile efficiently.
                </p>
              </div>

              <div className="p-5 bg-neutral-900/10 border border-neutral-900 rounded-2xl space-y-2">
                <span className="text-lg">🎯</span>
                <h3 className="text-xs font-bold text-white">User Centered UI</h3>
                <p className="text-[10px] text-neutral-500 leading-relaxed">
                  Creating responsive interfaces, smooth transitions, and premium dark glassmorphism effects.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
