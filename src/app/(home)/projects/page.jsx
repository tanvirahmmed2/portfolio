"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectCard from '@/components/pages/ProjectCard';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/project');
        if (res.ok) {
          const data = await res.json();
          
          const list = (data.projects || []).filter(p => p.is_published);
          setProjects(list);
          setFilteredProjects(list);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  
  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter(p => {
      const titleMatch = p.title.toLowerCase().includes(query);
      const summaryMatch = (p.description || '').toLowerCase().includes(query);
      const skillsMatch = (p.skills || []).some(s => s.name.toLowerCase().includes(query));
      return titleMatch || summaryMatch || skillsMatch;
    });

    setFilteredProjects(filtered);
  }, [search, projects]);

  return (
    <div className="min-h-screen py-28 px-6 sm:px-8 relative overflow-hidden bg-white text-slate-600 selection:bg-violet-100 selection:text-violet-900">
      
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-black tracking-widest text-violet-600 uppercase">My Work</span>
            <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">Projects Archive</h1>
            <p className="text-sm text-slate-500 max-w-lg">
              Explore web systems, multi-tenant databases, automation portals, and libraries I have engineered.
            </p>
          </div>

          
          <div className="relative w-full md:w-80 shadow-xs">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, stack, or tools..."
              className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 pl-10 text-xs text-slate-800 focus:outline-none focus:border-violet-500 focus:bg-white transition-all placeholder-slate-400"
            />
            <svg className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="h-72 bg-slate-50 rounded-3xl"></div>
            <div className="h-72 bg-slate-50 rounded-3xl"></div>
            <div className="h-72 bg-slate-50 rounded-3xl"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center border border-slate-200 bg-slate-50/20 rounded-3xl space-y-2">
            <p className="text-sm font-bold text-slate-800">No matching projects found.</p>
            <p className="text-xs text-slate-500">Try searching for alternative keywords, technologies, or tools.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

      </div>



    </div>
  );
}
