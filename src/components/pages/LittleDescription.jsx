"use client";
import React, { useState, useEffect } from 'react';

export default function LittleDescription() {
  const [settings, setSettings] = useState(null);

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
      }
    }
    loadSettings();
  }, []);

  return (
    <section className="py-20 px-6 sm:px-8 border-t border-slate-100 bg-white text-slate-650 selection:bg-violet-100 selection:text-violet-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-between">
        
        
        <div className="w-full space-y-2">
          <span className="text-[10px] font-black tracking-widest text-violet-600 uppercase">My Mission</span>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">Simplicity in Engineering.</h2>
        </div>

        
        <div className="w-full border-l-2 border-violet-500/20 pl-6 py-2">
          <p className="text-xs leading-relaxed text-slate-500 italic">
            &ldquo;{settings?.bio || 'Building web applications with optimized pipelines, structured databases, and responsive client layouts. My goal is to engineer software that scales effectively and provides seamless, robust user experiences.'}&rdquo;
          </p>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-750 block mt-4">
            &mdash; {settings?.name || 'Tanvir Ahmmed'}, {settings?.title || 'Lead Architect'}
          </span>
        </div>

      </div>
    </section>
  );
}