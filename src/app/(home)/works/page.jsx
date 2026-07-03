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
    <div className="min-h-screen py-28 px-6 sm:px-8 relative overflow-hidden bg-white text-slate-650 selection:bg-violet-100 selection:text-violet-900">
      
      {/* Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Header */}
        <div className="space-y-3 border-b border-slate-200/60 pb-8">
          <span className="text-[10px] font-black tracking-widest text-violet-500 uppercase">My Journey</span>
          <h1 className="text-4xl font-black text-slate-900 leading-tight">Career Experience</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Detailed timeline of my full-time employment roles, contract positions, and consulting duties.
          </p>
        </div>

        {/* Works timeline list */}
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-20 rounded-3xl bg-slate-50"></div>
            <div className="h-20 rounded-3xl bg-slate-50"></div>
          </div>
        ) : works.length === 0 ? (
          <div className="p-12 text-center border border-slate-200 bg-slate-50/50 rounded-2xl text-slate-500 shadow-xs">
            <p className="text-xs font-semibold">No career timeline details recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-y-2 before:left-[15px] before:w-[1.5px] before:bg-slate-200/80">
            {works.map((work) => (
              <div key={work.id} className="relative pl-10 group">
                
                {/* Dot */}
                <div className="absolute left-[9px] top-3.5 w-3.5 h-3.5 border-2 border-violet-500 bg-white rounded-full group-hover:bg-violet-500 group-hover:scale-125 transition-all duration-300 z-10"></div>
                
                <div className="p-6 border border-slate-200/80 bg-white hover:bg-slate-50/10 hover:border-violet-400/30 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h2 className="text-sm font-black text-slate-900 group-hover:text-violet-650 transition-colors">
                        {work.position}
                      </h2>
                      <span className="text-[11px] font-bold text-slate-500">
                        {work.company_name}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-500 self-start sm:self-auto">
                      {work.start_date ? new Date(work.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''} - {work.currently_working ? 'Present' : (work.end_date ? new Date(work.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '')}
                    </span>
                  </div>

                  <p className="text-[11.5px] leading-relaxed text-slate-600 whitespace-pre-line">
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
