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

  // Group skills by category
  const categories = {};
  skills.forEach(skill => {
    if (!categories[skill.category]) {
      categories[skill.category] = [];
    }
    categories[skill.category].push(skill);
  });

  return (
    <div className="min-h-screen bg-neutral-950 py-24 px-6 sm:px-8 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        
        {/* Header */}
        <div className="space-y-3 border-b border-neutral-900 pb-8">
          <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">My Tools</span>
          <h1 className="text-4xl font-black text-white leading-tight">Technology Stack</h1>
          <p className="text-neutral-450 text-xs sm:text-sm">
            Detailed directory of tools, frameworks, and programming utilities I use for development.
          </p>
        </div>

        {/* Group lists */}
        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-6 w-36 bg-neutral-900 rounded"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="h-16 bg-neutral-900 rounded-xl"></div>
              <div className="h-16 bg-neutral-900 rounded-xl"></div>
            </div>
          </div>
        ) : skills.length === 0 ? (
          <div className="p-8 text-center border border-neutral-900 bg-neutral-900/10 rounded-2xl">
            <p className="text-neutral-500 text-xs">No technical skills recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.keys(categories).map((catName) => (
              <div key={catName} className="space-y-4">
                <h2 className="text-xs font-black tracking-widest text-neutral-450 uppercase border-l-2 border-violet-500/40 pl-3">
                  {catName}
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {categories[catName].map((skill) => {
                    const slug = skill.name.toLowerCase().replace(/ /g, '-');
                    return (
                      <Link
                        key={skill.id}
                        href={`/skills/${slug}`}
                        className="p-4 bg-neutral-900/10 hover:bg-neutral-900/30 border border-neutral-900 hover:border-neutral-850 rounded-2xl transition-all duration-300 flex items-center gap-3 group"
                      >
                        {skill.image ? (
                          <img
                            src={skill.image}
                            alt={skill.name}
                            className="w-7 h-7 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded bg-neutral-850 flex items-center justify-center text-[9px] font-bold text-neutral-600">
                            {skill.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-bold text-white block truncate group-hover:text-violet-400 transition-colors">
                            {skill.name}
                          </span>
                          
                          {/* Progress meter */}
                          <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden mt-1.5">
                            <div
                              className="bg-violet-500 h-full rounded-full"
                              style={{ width: `${skill.proficiency || 0}%` }}
                            ></div>
                          </div>
                        </div>

                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
