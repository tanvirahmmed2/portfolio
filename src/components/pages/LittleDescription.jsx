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
    <section className="py-20 px-6 sm:px-8 bg-neutral-950 border-t border-neutral-900/60">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-between">
        
        {/* Left tagline */}
        <div className="md:w-1/3 space-y-2">
          <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">My Mission</span>
          <h2 className="text-2xl font-black text-white leading-tight">Simplicity in Engineering.</h2>
        </div>

        {/* Right bio text */}
        <div className="md:w-2/3 border-l-2 border-violet-500/20 pl-6 py-2">
          <p className="text-xs text-neutral-400 leading-relaxed italic">
            &ldquo;{settings?.bio || 'Building web applications with optimized pipelines, structured databases, and responsive client layouts. My goal is to engineer software that scales effectively and provides seamless, robust user experiences.'}&rdquo;
          </p>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mt-4">
            &mdash; {settings?.name || 'Tanvir Ahmmed'}, {settings?.title || 'Lead Architect'}
          </span>
        </div>

      </div>
    </section>
  );
}