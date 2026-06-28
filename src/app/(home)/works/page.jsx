"use client";
import React, { useState, useEffect } from 'react';

export default function WorksPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorks() {
      try {
        const res = await fetch('/api/work');
        if (res.ok) {
          const data = await res.json();
          setWorks(data.works || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadWorks();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 py-24 px-6 sm:px-8 relative overflow-hidden">
      
      {/* Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10 space-y-12">
        
        {/* Header */}
        <div className="space-y-3 border-b border-neutral-900 pb-8">
          <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">My Journey</span>
          <h1 className="text-4xl font-black text-white leading-tight">Career Experience</h1>
          <p className="text-neutral-450 text-xs sm:text-sm">
            Detailed timeline of my full-time employment roles, contract positions, and consulting duties.
          </p>
        </div>

        {/* Works timeline list */}
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-20 bg-neutral-900 rounded-3xl"></div>
            <div className="h-20 bg-neutral-900 rounded-3xl"></div>
          </div>
        ) : works.length === 0 ? (
          <div className="p-8 text-center border border-neutral-900 bg-neutral-900/10 rounded-2xl">
            <p className="text-neutral-500 text-xs">No career timeline details recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-y-2 before:left-[15px] before:w-[1px] before:bg-neutral-850">
            {works.map((work) => (
              <div key={work.id} className="relative pl-10 group">
                
                {/* Dot */}
                <div className="absolute left-[9px] top-2.5 w-[13px] h-[13px] bg-neutral-950 border-2 border-violet-500 rounded-full group-hover:scale-125 transition-transform z-10"></div>
                
                <div className="p-6 bg-neutral-900/10 hover:bg-neutral-900/30 border border-neutral-900 hover:border-neutral-850 rounded-3xl transition-all duration-300 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h2 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
                        {work.position}
                      </h2>
                      <span className="text-[11px] font-semibold text-neutral-400">
                        {work.company_name}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-950 px-2.5 py-1 rounded-full border border-neutral-900 self-start sm:self-auto">
                      {work.start_date ? new Date(work.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''} - {work.currently_working ? 'Present' : (work.end_date ? new Date(work.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '')}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-450 leading-relaxed whitespace-pre-line">
                    {work.description}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
