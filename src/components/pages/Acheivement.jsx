"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export default function Acheivement() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const res = await fetch('/api/achievements');
        if (res.ok) {
          const data = await res.json();
          // Filter to featured achievements
          const list = (data.achievements || []).filter(a => a.is_featured);
          setAchievements(list.slice(0, 3)); // show top 3 on home page
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAchievements();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6 sm:px-8 bg-slate-50/30">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-6 w-36 bg-slate-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-72 bg-slate-100 rounded-3xl animate-pulse"></div>
            <div className="h-72 bg-slate-100 rounded-3xl animate-pulse"></div>
            <div className="h-72 bg-slate-100 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  if (achievements.length === 0) return null;

  return (
    <section className="py-20 px-6 sm:px-8 border-t bg-slate-50/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto space-y-12"
      >
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-widest text-cyan-600 uppercase">Honors & Certifications</span>
            <h2 className="text-3xl font-black text-slate-900">Featured Achievements</h2>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {achievements.map((ach) => (
            <motion.div
              key={ach.id}
              variants={itemVariants}
              className="relative group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col h-full overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 will-change-transform hover:-translate-y-1"
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                {ach.image ? (
                  <img
                    alt={ach.title}
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    className="w-full h-full object-cover opacity-90 dark:opacity-60 transition-transform duration-500 group-hover:scale-[1.03]"
                    src={ach.image}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-cyan-500/10 to-violet-500/10 flex items-center justify-center text-slate-350">
                    <svg className="w-16 h-16 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent"></div>
                
                {/* Float Badge */}
                <div className="absolute top-6 left-6">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/95 dark:bg-zinc-900/95 border border-zinc-100 dark:border-white/5 rounded-full shadow-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-650 dark:text-zinc-400">
                      {ach.awarder}
                    </span>
                  </div>
                </div>
              </div>

              {/* Text Content overlaying slightly */}
              <div className="relative z-10 p-8 flex flex-col flex-grow -mt-10 bg-white/95 dark:bg-zinc-950/95 rounded-t-[2.5rem]">
                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-500 transition-colors leading-tight mb-4">
                  {ach.title}
                </h3>
                
                <div className="flex-grow space-y-3 overflow-hidden">
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed transition-all duration-300 line-clamp-2">
                    {ach.description || 'Verified achievement, honors award or certification credentials.'}
                  </p>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block pt-1">
                    Earned: {ach.date_earned ? new Date(ach.date_earned).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}
                  </span>
                </div>

                {/* External URL Action Button */}
                {ach.url && (
                  <div className="pt-6 flex items-center gap-3">
                    <a
                      href={ach.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-transform duration-200 hover:scale-[1.02] shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link" aria-hidden="true">
                        <path d="M15 3h6v6"></path>
                        <path d="M10 14 21 3"></path>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      </svg>
                      Verify Credential
                    </a>
                  </div>
                )}
              </div>

            </motion.div>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
}
