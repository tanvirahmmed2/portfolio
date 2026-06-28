"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WorksLife() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorks() {
      try {
        const res = await fetch('/api/work');
        if (res.ok) {
          const data = await res.json();
          // Sort by start date (newest first) or id
          const list = data.works || [];
          setWorks(list.slice(0, 3)); // show top 3 jobs on landing page
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadWorks();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6 sm:px-8 bg-neutral-950">
        <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 w-36 bg-neutral-900 rounded"></div>
          <div className="space-y-4">
            <div className="h-20 bg-neutral-900 rounded-2xl"></div>
            <div className="h-20 bg-neutral-900 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  if (works.length === 0) return null;

  return (
    <section className="py-20 px-6 sm:px-8 bg-neutral-950 border-t border-neutral-900/60">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">Work Experience</span>
            <h2 className="text-3xl font-black text-white">Career Timeline</h2>
          </div>
          <Link
            href="/works"
            className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            Full work history
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Timeline block */}
        <div className="space-y-6 relative before:absolute before:inset-y-2 before:left-[15px] before:w-[1px] before:bg-neutral-850">
          {works.map((work) => (
            <div key={work.id} className="relative pl-10 group">
              
              {/* Dot marker */}
              <div className="absolute left-[9px] top-2 w-[13px] h-[13px] bg-neutral-950 border-2 border-violet-500 rounded-full group-hover:scale-120 transition-transform z-10"></div>
              
              <div className="p-5 bg-neutral-900/10 hover:bg-neutral-900/30 border border-neutral-900 hover:border-neutral-850 rounded-2xl transition-all duration-300 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
                      {work.position}
                    </h3>
                    <span className="text-[11px] font-semibold text-neutral-400">
                      {work.company_name}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-950 px-2.5 py-1 rounded-full border border-neutral-900 self-start sm:self-auto">
                    {work.start_date ? new Date(work.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''} - {work.currently_working ? 'Present' : (work.end_date ? new Date(work.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '')}
                  </span>
                </div>

                <p className="text-[11px] text-neutral-450 leading-relaxed pt-1 whitespace-pre-line">
                  {work.description}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
