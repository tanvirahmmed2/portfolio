"use client";
import React from 'react';
import Link from 'next/link';

export default function GetContact() {
  return (
    <section className="py-24 px-6 sm:px-8 bg-neutral-950 border-t border-neutral-900/60 relative overflow-hidden text-center">
      
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-600/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-2xl mx-auto relative z-10 space-y-6">
        <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">Collaboration</span>
        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">Have a project idea in mind?</h2>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Let's discuss details and construct something exceptional together. Send an email or fill in the quick contact form.
        </p>
        
        <div className="pt-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 active:scale-98 transition-all shadow-md shadow-violet-600/10 hover:-translate-y-0.5 cursor-pointer"
          >
            Start Conversation
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}