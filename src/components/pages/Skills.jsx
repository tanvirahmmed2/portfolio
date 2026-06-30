"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Skills() {
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

  if (loading) {
    return (
      <section className="py-20 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 w-36 rounded"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-16 rounded-xl"></div>
            <div className="h-16 rounded-xl"></div>
            <div className="h-16 rounded-xl"></div>
            <div className="h-16 rounded-xl"></div>
          </div>
        </div>
      </section>
    );
  }

  if (skills.length === 0) return null;

  // Group skills by category
  const categories = {};
  skills.forEach(skill => {
    if (!categories[skill.category]) {
      categories[skill.category] = [];
    }
    categories[skill.category].push(skill);
  });

  return (
    <section className="py-20 px-6 sm:px-8 border-t">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">Core Competencies</span>
            <h2 className="text-3xl font-black ">Technical Skills</h2>
          </div>
          <Link
            href="/skills"
            className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            Detailed categorization
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Group lists */}
        <div className="space-y-8">
          {Object.keys(categories).map((catName) => (
            <div key={catName} className="space-y-4">
              <h3 className="text-xs font-black tracking-widest uppercase border-l-2 border-violet-500/40 pl-3">
                {catName}
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categories[catName].map((skill) => {
                  const slug = skill.name.toLowerCase().replace(/ /g, '-');
                  return (
                    <Link
                      key={skill.id}
                      href={`/skills/${slug}`}
                      className="p-4 border rounded-2xl transition-all duration-300 flex items-center gap-3 group"
                    >
                      {skill.image ? (
                        <Image width={100} height={100}
                          src={skill.image}
                          alt={skill.name}
                          className="w-7 h-7 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded flex items-center justify-center text-[9px] font-bold">
                          {skill.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold  block truncate text-violet-400 transition-colors">
                          {skill.name}
                        </span>
                        
                        {/* Progress meter */}
                        <div className="w-full h-1 rounded-full overflow-hidden mt-1.5">
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

      </div>
    </section>
  );
}