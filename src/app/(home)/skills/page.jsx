"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkills() {
      try {
        const res = await fetch('/api/skill');
        if (res.ok) {
          const data = await res.json();
          setSkills(data.skills || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSkills();
  }, []);

  // Grouping by category removed

  return (
    <div className="min-h-screen py-28 px-6 sm:px-8 relative overflow-hidden bg-white text-slate-600 selection:bg-violet-100 selection:text-violet-900">
      
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        
        {/* Header */}
        <div className="space-y-3 border-b border-slate-100 pb-8 text-center sm:text-left">
          <span className="text-xs font-black tracking-widest text-violet-600 uppercase">My Tools</span>
          <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">Technology Stack</h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Detailed directory of technologies, programming languages, databases, and frameworks I use to engineer robust, high-performance applications.
          </p>
        </div>

        {/* Group lists */}
        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-6 w-36 bg-slate-100 rounded"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="h-16 bg-slate-50 rounded-xl"></div>
              <div className="h-16 bg-slate-50 rounded-xl"></div>
              <div className="h-16 bg-slate-50 rounded-xl"></div>
              <div className="h-16 bg-slate-50 rounded-xl"></div>
            </div>
          </div>
        ) : skills.length === 0 ? (
          <div className="p-12 text-center border border-slate-200 bg-slate-50/50 rounded-2xl">
            <p className="text-sm font-medium text-slate-500">No technical skills recorded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {skills.map((skill) => {
              const slug = skill.name.toLowerCase().replace(/ /g, '-');
              return (
                <Link
                  key={skill.id}
                  href={`/skills/${slug}`}
                  className="p-4 border border-slate-200 bg-slate-50/20 rounded-2xl hover:border-violet-400/40 hover:bg-white hover:shadow-md transition-all duration-300 flex items-center gap-3 group"
                >
                  {skill.image ? (
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="w-7 h-7 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center text-[10px] font-black uppercase shrink-0">
                      {skill.name.slice(0, 2)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-extrabold text-slate-800 block truncate group-hover:text-violet-600 transition-colors">
                      {skill.name}
                    </span>
                    
                    {/* Progress meter */}
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full"
                        style={{ width: `${skill.proficiency || 0}%` }}
                      ></div>
                    </div>
                  </div>

                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
