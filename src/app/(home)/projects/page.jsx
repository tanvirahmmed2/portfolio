"use client";
import React, { useState, useEffect } from 'react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Selected project modal details
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/project');
        if (res.ok) {
          const data = await res.json();
          // Public projects only
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

  // Filter based on search query
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
      
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-black tracking-widest text-violet-600 uppercase">My Work</span>
            <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">Projects Archive</h1>
            <p className="text-sm text-slate-500 max-w-lg">
              Explore web systems, multi-tenant databases, automation portals, and libraries I have engineered.
            </p>
          </div>

          {/* Search Input */}
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

        {/* Project Cards Catalog */}
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
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group border border-slate-200 bg-white rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-lg hover:border-violet-400/40"
              >
                <div>
                  {/* Cover */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-100 flex items-center justify-center">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest gap-1.5 p-4">
                        <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        No Preview Image
                      </div>
                    )}
                    {project.is_featured && (
                      <span className="absolute top-3 left-3 bg-violet-600 text-[8px] font-black text-white px-2.5 py-1 rounded-md uppercase tracking-widest shadow-xs">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-sm font-extrabold text-slate-950 group-hover:text-violet-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[11px] leading-relaxed text-slate-500 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tags */}
                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {project.skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="text-[8px] font-black px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-slate-500 uppercase tracking-wider"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <span className="text-[9px] font-extrabold text-violet-600 group-hover:text-violet-500 transition-colors flex items-center gap-1">
                    View Project Specifications
                    <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Details Dialog Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="border border-slate-200 bg-white rounded-3xl w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-slate-600">
            
            {/* Modal Image Header */}
            <div className="relative aspect-video w-full border-b border-slate-100 bg-slate-50 flex items-center justify-center">
              {selectedProject.image ? (
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest gap-2 p-6">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Preview Image Unavailable
                </div>
              )}
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 bg-white/95 border border-slate-200 text-slate-500 rounded-full hover:text-slate-800 hover:shadow-md transition-all cursor-pointer"
                aria-label="Close details"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-extrabold text-slate-900">{selectedProject.title}</h2>
                  {selectedProject.is_featured && (
                    <span className="bg-violet-600 text-[8px] font-black text-white px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line">
                  {selectedProject.description}
                </p>
              </div>

              {/* Technologies */}
              {selectedProject.skills && selectedProject.skills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Technologies Used</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="text-[9px] font-black bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 rounded-lg uppercase tracking-wider"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Project links */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">
                {selectedProject.url && (
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 active:scale-98 transition-all cursor-pointer shadow-md shadow-violet-600/10 hover:-translate-y-0.5"
                  >
                    Launch Live Site
                  </a>
                )}
                {selectedProject.github_url && (
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 active:scale-98 transition-all cursor-pointer hover:-translate-y-0.5"
                  >
                    Explore Repository Source
                  </a>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
