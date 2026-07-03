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
          
          const list = data.works || [];
          setWorks(list.slice(0, 3)); 
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
      <section className="py-20 px-6 sm:px-8 bg-white text-slate-600">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 w-36 rounded bg-slate-100"></div>
          <div className="space-y-4">
            <div className="h-20 bg-slate-50 rounded-2xl"></div>
            <div className="h-20 bg-slate-50 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  if (works.length === 0) return null;

  return (
    <section className="py-20 px-6 sm:px-8 border-t border-slate-100 bg-white text-slate-650 selection:bg-violet-100 selection:text-violet-900">
      <div className="max-w-7xl mx-auto space-y-12">
        
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-widest text-violet-600 uppercase">Work Experience</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Career Timeline</h2>
          </div>
          <Link
            href="/works"
            className="text-xs font-bold text-violet-600 hover:text-violet-500 transition-colors flex items-center gap-1.5 self-start sm:self-auto group"
          >
            Full work history
            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        
        <div className="space-y-6 relative before:absolute before:inset-y-2 before:left-[15px] before:w-[1px] before:bg-slate-200">
          {works.map((work) => (
            <div key={work.id} className="relative pl-10 group">
              
              
              <div className="absolute left-[9px] top-2 w-[13px] h-[13px] border-2 border-violet-500 bg-white rounded-full group-hover:scale-120 transition-transform z-10"></div>
              
              <div className="p-5 border border-slate-200 bg-white rounded-2xl transition-all duration-300 space-y-2 hover:shadow-md hover:border-violet-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                      {work.position}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-650">
                      {work.company_name}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-slate-200 text-slate-500 bg-slate-50 self-start sm:self-auto">
                    {work.start_date ? new Date(work.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''} - {work.currently_working ? 'Present' : (work.end_date ? new Date(work.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '')}
                  </span>
                </div>

                <p className="text-[11px] leading-relaxed text-slate-500 pt-1 whitespace-pre-line">
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
