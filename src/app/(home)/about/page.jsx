"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AboutPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data.settings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  return (
    <div className="min-h-screen py-28 px-6 sm:px-8 relative overflow-hidden bg-white text-slate-600 selection:bg-violet-100 selection:text-violet-900">
      
 
      <div className="w-full mx-auto relative z-10 space-y-16">
        
        <div className="space-y-4 text-center md:text-left">
          <span className="text-xs font-semibold tracking-widest text-violet-600 uppercase">Who I Am</span>
          
          <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-2xl">
            A comprehensive breakdown of my professional credentials, software engineering philosophy, database architecture patterns, and automation capabilities.
          </p>
        </div>

        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-2/3 space-y-4">
                <div className="h-6 w-1/3 bg-slate-100 rounded"></div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              </div>
              <div className="w-56 h-56 bg-slate-100 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-slate-100 rounded-2xl"></div>
              <div className="h-48 bg-slate-100 rounded-2xl"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Core Profile Card: Intro & Photo */}
            <div className="p-8 md:p-10 border border-slate-200/80 rounded-3xl bg-white/70 backdrop-blur-xl flex flex-col md:flex-row gap-10 items-center justify-between shadow-xl shadow-slate-100">
              
              <div className="space-y-6 flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  Hi, I'm <span className="text-violet-600">{settings?.name || 'Tanvir Ahmmed'}</span>
                </h2>
                
                <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-medium">
                  I am a <strong className="text-slate-900 font-semibold">Full-Stack Web Developer</strong> with <strong>4 years of professional experience</strong> specializing in the design, development, and deployment of high-performance web applications. My core expertise lies across the MERN and PERN stacks.
                </p>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-500">
                  Over the past four years, my journey has evolved from writing clean UI components to architecting complex, production-ready systems. I specialize in building multi-tenant platforms, advanced e-commerce architectures with isolated inventory logic, corporate automation hubs, and community-driven networks.
                </p>

                {/* Micro Stats Grid */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <span className="block text-xl md:text-2xl font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">4+ Yrs</span>
                    <span className="text-[10px] tracking-wider text-slate-400 uppercase font-bold">Experience</span>
                  </div>
                  <div>
                    <span className="block text-xl md:text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">PERN/MERN</span>
                    <span className="text-[10px] tracking-wider text-slate-400 uppercase font-bold">Core Stacks</span>
                  </div>
                  <div>
                    <span className="block text-xl md:text-2xl font-semibold bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">IoT</span>
                    <span className="text-[10px] tracking-wider text-slate-400 uppercase font-bold">Automation</span>
                  </div>
                </div>
              </div>

              {/* Profile Image Container */}
              <div className="relative group shrink-0">
               <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-slate-200 p-1.5 bg-white shadow-lg">
                  <Image 
                    src="/tanvirahmmed.jpeg" 
                    alt={settings?.name || "Tanvir Ahmmed"} 
                    width={250} 
                    height={250} 
                    className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-103"
                  />
                </div>
              </div>

            </div>

            {/* The Database Paradigm: MERN & PERN Stack Mastery */}
            <div className="space-y-6">
              <div className="text-center md:text-left space-y-2">
                <span className="text-[10px] font-semibold tracking-widest text-indigo-600 uppercase">Dual-Lens Database Ecosystem</span>
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">MERN meets PERN</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                  Knowing exactly when to leverage the rigid consistency of a relational schema versus the fluid scalability of NoSQL.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* PERN Card */}
                <div className="p-6 md:p-8 border border-slate-200 bg-slate-50/30 rounded-2xl hover:border-violet-500/40 hover:bg-white hover:shadow-lg transition-all duration-300 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-100/20 rounded-full blur-2xl pointer-events-none group-hover:bg-violet-100/35 transition-colors duration-300"></div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-lg bg-violet-50 text-violet-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">Relational Database Design</h4>
                      <span className="text-[9px] font-semibold text-violet-600 uppercase tracking-widest">PERN Stack & PostgreSQL</span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Expert in designing complex relational schemas in PostgreSQL. Extensive experience handling advanced database requirements such as multi-branch isolation, complex structural joins, data normalization, and writing optimized raw SQL or utilizing modern ORMs.
                  </p>
                </div>

                {/* MERN Card */}
                <div className="p-6 md:p-8 border border-slate-200 bg-slate-50/30 rounded-2xl hover:border-indigo-500/40 hover:bg-white hover:shadow-lg transition-all duration-300 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100/20 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-100/35 transition-colors duration-300"></div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">NoSQL Schema Design</h4>
                      <span className="text-[9px] font-semibold text-indigo-600 uppercase tracking-widest">MERN Stack & MongoDB</span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Proficient in scaling MongoDB databases for highly dynamic, unstructured, or rapidly changing data requirements. Adept at aggregation pipelines, indexing strategies, and document modeling.
                  </p>
                </div>

              </div>
            </div>

            {/* Deep-Dive Technical Expertise Section */}
            <div className="space-y-6">
              <div className="text-center md:text-left space-y-2">
                <span className="text-[10px] font-semibold tracking-widest text-fuchsia-600 uppercase">Core Capability Pillars</span>
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">Technical Deep-Dive</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                  Bridging the gap between heavy-duty backend engineering, modern client applications, and physical system automations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Backend Card */}
                <div className="p-6 border border-slate-200/80 bg-white rounded-2xl space-y-4 hover:shadow-md hover:border-slate-300 transition-all duration-300">
                  <div className="p-3 w-fit rounded-xl bg-violet-50 text-violet-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">1. Backend & Server Logic</h4>
                  <ul className="text-xs text-slate-500 space-y-2.5">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 mt-0.5">•</span>
                      <span>Robust RESTful APIs built on <strong className="text-slate-700">Node.js & Express.js</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 mt-0.5">•</span>
                      <span>Clean MVC (Model-View-Controller) structure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 mt-0.5">•</span>
                      <span>Secure JWT authentications & Role-Based Access Control (RBAC)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 mt-0.5">•</span>
                      <span>Comprehensive error-handling middleware pipelines</span>
                    </li>
                  </ul>
                </div>

                {/* Frontend Card */}
                <div className="p-6 border border-slate-200/80 bg-white rounded-2xl space-y-4 hover:shadow-md hover:border-slate-300 transition-all duration-300">
                  <div className="p-3 w-fit rounded-xl bg-indigo-50 text-indigo-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">2. Modern Frontend Architecture</h4>
                  <ul className="text-xs text-slate-500 space-y-2.5">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-0.5">•</span>
                      <span>Next.js & React (App Router paradigm, SSR, SSG)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-0.5">•</span>
                      <span>Utility-first styling using <strong className="text-slate-700">Tailwind CSS</strong> custom systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-0.5">•</span>
                      <span>Clean, reusable, and accessible semantic HTML markup</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-0.5">•</span>
                      <span>Global state handling (Redux Toolkit, Context API)</span>
                    </li>
                  </ul>
                </div>

                {/* IoT Automation Card */}
                <div className="p-6 border border-slate-200/80 bg-white rounded-2xl space-y-4 hover:shadow-md hover:border-slate-300 transition-all duration-300">
                  <div className="p-3 w-fit rounded-xl bg-fuchsia-50 text-fuchsia-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">3. Hardware & IoT Integration</h4>
                  <ul className="text-xs text-slate-500 space-y-2.5">
                    <li className="flex items-start gap-2">
                      <span className="text-fuchsia-600 mt-0.5">•</span>
                      <span>Integrating web dashboards with <strong className="text-slate-700">IoT devices & robotics</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-fuchsia-600 mt-0.5">•</span>
                      <span>Corporate portals for device automation & status logs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-fuchsia-600 mt-0.5">•</span>
                      <span>Real-time monitoring systems and remote control logic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-fuchsia-600 mt-0.5">•</span>
                      <span>Data-stream ingestion over serial, WebSockets, or MQTT</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Core Engineering Philosophy */}
            <div className="space-y-6">
              <div className="text-center md:text-left space-y-2">
                <span className="text-[10px] font-semibold tracking-widest text-violet-600 uppercase">Core Philosophy</span>
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">How I Code</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                  Standards and methodologies applied to every engineering decision I make.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Philosophy 1 */}
                <div className="p-6 border-l-4 border-violet-500 bg-slate-50 rounded-r-2xl space-y-2.5">
                  
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Write for Humans, Optimize for Machines</h4>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Code should be clean, modular, and self-documenting. Following SOLID principles guarantees that the code created today can be scaled seamlessly by other developers tomorrow.
                  </p>
                </div>

                {/* Philosophy 2 */}
                <div className="p-6 border-l-4 border-indigo-500 bg-slate-50 rounded-r-2xl space-y-2.5">
                  
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Data-Driven Performance</h4>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Whether it is optimizing a PostgreSQL index strategy to slash database fetch latency or lazy-loading React nodes to enhance Cumulative Layout Shift (CLS), metrics direct the optimization process.
                  </p>
                </div>

                {/* Philosophy 3 */}
                <div className="p-6 border-l-4 border-fuchsia-500 bg-slate-50 rounded-r-2xl space-y-2.5">
                  
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">User-Centric Engineering</h4>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    I build solutions, not just features. Stepping into the end-user's shoes ensures the application is intuitive, accessible, and friction-free across all screen dimensions.
                  </p>
                </div>

              </div>
            </div>

            {/* Resume Download Call to Action */}
            {settings?.resumeUrl && (
              <div className="p-6 sm:p-8 border border-slate-200 rounded-3xl bg-slate-50/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest block">Curriculum Vitae</span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Looking for my full professional credits?</h3>
                  <p className="text-[11px] text-slate-500">Get a copy of my resume to review full career credentials, projects, and certifications.</p>
                </div>
                
                <a
                  href={settings.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-98 transition-all shadow-md hover:-translate-y-0.5 cursor-pointer select-none shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Resume
                </a>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
