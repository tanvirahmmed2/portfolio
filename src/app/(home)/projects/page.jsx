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
    <div className="min-h-screen bg-neutral-950 py-24 px-6 sm:px-8 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-neutral-900 pb-8">
          <div className="space-y-3">
            <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">My Work</span>
            <h1 className="text-4xl font-black text-white leading-tight">Projects Archive</h1>
            <p className="text-neutral-450 text-xs sm:text-sm max-w-lg">
              Explore websites, open-source libraries, and application utilities I have engineered.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, stack, or tools..."
              className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 transition-all"
            />
            <svg className="absolute left-3 top-3 w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Project Cards Catalog */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="h-64 bg-neutral-900 rounded-3xl"></div>
            <div className="h-64 bg-neutral-900 rounded-3xl"></div>
            <div className="h-64 bg-neutral-900 rounded-3xl"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center border border-neutral-900 bg-neutral-900/10 rounded-3xl space-y-2">
            <p className="text-neutral-400 text-sm">No matching projects found.</p>
            <p className="text-neutral-600 text-xs">Try searching for alternative keywords or tools.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group bg-neutral-900/20 border border-neutral-900 hover:border-neutral-850 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Cover */}
                  <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden border-b border-neutral-900/80">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-700 font-bold uppercase tracking-wider">
                        No Preview Image
                      </div>
                    )}
                    {project.is_featured && (
                      <span className="absolute top-3 left-3 bg-violet-600 text-[8px] font-black text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[11px] text-neutral-450 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tags */}
                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="text-[8px] font-bold text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <span className="text-[9px] font-bold text-violet-400 group-hover:text-violet-300 transition-colors flex items-center gap-1">
                    View Project Specifications
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-850 rounded-3xl w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col">
            
            {/* Modal Image Header */}
            <div className="relative aspect-video w-full bg-neutral-950 border-b border-neutral-850">
              {selectedProject.image ? (
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600 font-bold uppercase tracking-widest">
                  Preview Image Unavailable
                </div>
              )}
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-neutral-900 border border-neutral-800 rounded-full text-neutral-400 hover:text-white transition-all cursor-pointer"
                aria-label="Close details"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">{selectedProject.title}</h2>
                  {selectedProject.is_featured && (
                    <span className="bg-violet-600 text-[8px] font-black text-white px-2 py-0.5 rounded uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-450 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Technologies */}
              {selectedProject.skills && selectedProject.skills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Technologies Used</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="text-[9px] font-bold text-neutral-300 bg-neutral-950 border border-neutral-850 px-2.5 py-1 rounded-lg"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Project links */}
              <div className="pt-4 border-t border-neutral-850 flex flex-wrap items-center gap-4">
                {selectedProject.project_url && (
                  <a
                    href={selectedProject.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition-all cursor-pointer"
                  >
                    Launch Live Site
                  </a>
                )}
                {selectedProject.github_url && (
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-neutral-300 border border-neutral-800 hover:border-neutral-700 bg-neutral-950 hover:text-white transition-all cursor-pointer"
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
