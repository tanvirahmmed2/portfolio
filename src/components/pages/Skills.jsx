"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

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
      <section className="py-20 px-6 sm:px-8 bg-white text-slate-600">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 w-36 bg-slate-100 rounded"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-16 bg-slate-50 rounded-xl"></div>
            <div className="h-16 bg-slate-50 rounded-xl"></div>
            <div className="h-16 bg-slate-50 rounded-xl"></div>
            <div className="h-16 bg-slate-50 rounded-xl"></div>
          </div>
        </div>
      </section>
    );
  }

  if (skills.length === 0) return null;

  return (
    <section className="py-20 px-6 sm:px-8 border-t border-slate-100 bg-white text-slate-650 selection:bg-violet-100 selection:text-violet-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto space-y-12"
      >
        
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-black tracking-widest text-violet-600 uppercase">Core Competencies</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Technical Skills</h2>
          </div>
          <Link
            href="/skills"
            className="text-xs font-bold text-violet-600 hover:text-violet-500 transition-colors flex items-center gap-1.5 self-start sm:self-auto group"
          >
            All Skills
            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-105px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {skills.map((skill) => {
            const slug = skill.name.toLowerCase().replace(/ /g, '-');
            return (
              <motion.div key={skill.id} variants={itemVariants}>
                <Link
                  href={`/skills/${slug}`}
                  className="p-4 border border-slate-200 bg-slate-50/20 rounded-2xl hover:border-violet-400/40 hover:bg-white hover:shadow-md transition-all duration-300 flex items-center gap-3 group"
                >
                  {skill.image ? (
                    <Image 
                      width={40} 
                      height={40}
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
                    
                    
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-linear-to-r from-violet-600 to-indigo-600 h-full rounded-full"
                        style={{ width: `${skill.proficiency || 0}%` }}
                      ></div>
                    </div>
                  </div>

                </Link>
              </motion.div>
            );
          })}
        </motion.div>

      </motion.div>
    </section>
  );
}