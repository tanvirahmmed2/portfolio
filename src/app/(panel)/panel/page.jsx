"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PanelDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/overview');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        } else {
          const errData = await res.json();
          setError(errData.error || 'Failed to load dashboard overview data.');
        }
      } catch (err) {
        console.error('Error fetching dashboard overview stats:', err);
        setError('Network error loading dashboard overview data.');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const cards = [
    {
      name: 'Total Skills',
      value: stats?.skills ?? 0,
      path: '/panel/skills',
      icon: (
        <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      bgGlow: 'bg-violet-600/5',
      hoverBorder: 'hover:border-violet-500/30'
    },
    {
      name: 'Projects Portfolio',
      value: stats?.projects ?? 0,
      path: '/panel/projects',
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bgGlow: 'bg-indigo-600/5',
      hoverBorder: 'hover:border-indigo-500/30'
    },
    {
      name: 'Experience History',
      value: stats?.works ?? 0,
      path: '/panel/works',
      icon: (
        <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      bgGlow: 'bg-sky-600/5',
      hoverBorder: 'hover:border-sky-500/30'
    },
    {
      name: 'Blog Articles',
      value: stats?.blogs ?? 0,
      path: '/panel/blogs',
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bgGlow: 'bg-emerald-600/5',
      hoverBorder: 'hover:border-emerald-500/30'
    },
    {
      name: 'Reviews & Testimonials',
      value: stats?.reviews ?? 0,
      path: '/panel/reviews',
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" />
        </svg>
      ),
      bgGlow: 'bg-amber-600/5',
      hoverBorder: 'hover:border-amber-500/30'
    },
    {
      name: 'Pending Messages',
      value: stats?.pendingContacts ?? 0,
      path: '/panel/contacts',
      icon: (
        <svg className={`w-6 h-6 ${(stats?.pendingContacts ?? 0) > 0 ? 'text-rose-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bgGlow: (stats?.pendingContacts ?? 0) > 0 ? 'bg-rose-500/10' : 'bg-slate-500/5',
      hoverBorder: (stats?.pendingContacts ?? 0) > 0 ? 'hover:border-rose-500/40 hover:shadow-rose-100' : 'hover:border-slate-300 hover:shadow-slate-100',
      badgeColor: (stats?.pendingContacts ?? 0) > 0 ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'
    }
  ];

  return (
    <div className="space-y-8 text-slate-600">
      
      
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-sm mt-1 text-slate-500">Real-time platform statistics, analytics, and inbound communication logs.</p>
      </div>

      {error && (
        <div className="p-4 border border-rose-200 bg-rose-50 text-rose-600 rounded-2xl text-xs leading-relaxed">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        /* Skeletons */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 border border-slate-200 bg-white rounded-2xl p-5 flex flex-col justify-between animate-pulse shadow-xs">
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-8 bg-slate-200 rounded w-1/3 mt-2"></div>
            </div>
          ))}
        </div>
      ) : (
        /* Statistics Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {cards.map((card) => {
            const isAlert = card.name === 'Pending Messages' && card.value > 0;
            return (
              <div
                key={card.name}
                onClick={() => router.push(card.path)}
                className={`group border border-slate-200 bg-white rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5 shadow-xs hover:shadow-md ${card.hoverBorder}`}
              >
                
                
                <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform ${card.bgGlow}`} />

                
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block truncate max-w-[120px]">
                    {card.name}
                  </span>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100/80">
                    {card.icon}
                  </div>
                </div>

                
                <div className="mt-4 flex items-end justify-between">
                  <span className={`text-3xl font-black leading-none text-slate-900 tracking-tight ${isAlert ? 'text-rose-600' : ''}`}>
                    {card.value}
                  </span>
                  
                  {card.name === 'Pending Messages' && (
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${card.badgeColor}`}>
                      {card.value > 0 ? 'Pending' : 'Empty'}
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      
      <div className="p-6 border border-slate-200 bg-white rounded-2xl space-y-4 shadow-xs">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Control Panel Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button 
            onClick={() => router.push('/panel/projects/new')}
            className="p-3 border border-slate-200 hover:border-violet-500/30 text-center rounded-xl transition-all text-xs font-bold text-slate-700 hover:text-violet-600 hover:bg-violet-50/30 cursor-pointer bg-white shadow-xs"
          >
            + Create Project
          </button>
          <button 
            onClick={() => router.push('/panel/blogs/new')}
            className="p-3 border border-slate-200 hover:border-violet-500/30 text-center rounded-xl transition-all text-xs font-bold text-slate-700 hover:text-violet-600 hover:bg-violet-50/30 cursor-pointer bg-white shadow-xs"
          >
            + Write Blog
          </button>
          <button 
            onClick={() => router.push('/panel/events/new')}
            className="p-3 border border-slate-200 hover:border-violet-500/30 text-center rounded-xl transition-all text-xs font-bold text-slate-700 hover:text-violet-600 hover:bg-violet-50/30 cursor-pointer bg-white shadow-xs"
          >
            + Add Event
          </button>
          <button 
            onClick={() => router.push('/panel/skills')}
            className="p-3 border border-slate-200 hover:border-violet-500/30 text-center rounded-xl transition-all text-xs font-bold text-slate-700 hover:text-violet-600 hover:bg-violet-50/30 cursor-pointer bg-white shadow-xs"
          >
            Manage Skills
          </button>
          <button 
            onClick={() => router.push('/panel/settings')}
            className="p-3 border border-slate-200 hover:border-violet-500/30 text-center rounded-xl transition-all text-xs font-bold text-slate-700 hover:text-violet-600 hover:bg-violet-50/30 cursor-pointer bg-white shadow-xs"
          >
            Site Settings
          </button>
          <a 
            href="/"
            target="_blank"
            className="p-3 border border-slate-200 hover:border-violet-500/30 text-center rounded-xl transition-all text-xs font-bold text-slate-700 hover:text-violet-600 hover:bg-violet-50/30 cursor-pointer bg-white shadow-xs block"
          >
            View Live Site &rarr;
          </a>
        </div>
      </div>

    </div>
  );
}
