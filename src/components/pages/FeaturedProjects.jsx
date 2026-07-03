"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/project');
        if (res.ok) {
          const data = await res.json();
          
          const list = (data.projects || []).filter(p => p.is_published && p.is_featured);
          setProjects(list.slice(0, 3)); 
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-6 w-36 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 rounded-3xl animate-pulse"></div>
            <div className="h-64 rounded-3xl animate-pulse"></div>
            <div className="h-64 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section className="py-20 px-6 sm:px-8 border-t">
      <div className="max-w-7xl mx-auto space-y-12">
        
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">Selected Work</span>
            <h2 className="text-3xl font-black text-white">Featured Projects</h2>
          </div>
          <Link
            href="/projects"
            className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            Browse all projects
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                <Link href={`/projects/${project.slug}`} className="block cursor-pointer">
                  
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-100 flex items-center justify-center">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                        No Preview Image
                      </div>
                    )}
                    {project.is_featured && (
                      <span className="absolute top-3 left-3 bg-violet-600 text-[8px] font-black text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                  </div>

                  
                  <div className="p-5 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[11px] leading-relaxed line-clamp-3 text-slate-500">
                      {project.description ? project.description.replace(/<[^>]*>/g, '') : ''}
                    </p>
                  </div>
                </Link>

                
                {project.skills && project.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-5 pb-4">
                    {project.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill.id}
                        className="text-[8px] font-bold px-2 py-0.5 rounded bg-violet-50 text-violet-650 uppercase tracking-wide"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {project.skills.length > 3 && (
                      <span className="text-[8px] font-bold text-slate-400">
                        +{project.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              
              <div className="p-5 pt-0 flex items-center gap-3">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-white bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg transition-all shadow-md shadow-violet-600/10 cursor-pointer"
                  >
                    Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 rounded-lg transition-all cursor-pointer"
                  >
                    Source Code
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}