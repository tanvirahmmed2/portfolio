"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';
import Link from 'next/link';

export default function PanelProjectsPage() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Deletion confirm modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/project');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      } else {
        showToast('Failed to fetch projects', 'error');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      showToast('Network error fetching projects list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/project?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Project deleted successfully');
        setDeleteConfirmId(null);
        fetchProjects();
      } else {
        showToast(data.error || 'Failed to delete project', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Network error deleting project', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Project Catalog</h1>
          <p className="text-sm mt-1 text-slate-500">Manage and present your case studies, web applications, and repositories.</p>
        </div>
        
        <Link
          href="/panel/projects/new"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 hover:-translate-y-0.5 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Create Project
        </Link>
      </div>

      {loading ? (
        /* Skeleton Loading Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 border border-slate-200 bg-white rounded-2xl p-5 flex flex-col justify-between animate-pulse shadow-xs">
              <div className="w-full h-36 bg-slate-100 rounded-xl mb-4"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded-md w-1/2 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 border border-dashed border-slate-200 bg-white rounded-2xl shadow-xs text-slate-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="font-medium">No projects in your catalog yet.</p>
          <Link
            href="/panel/projects/new"
            className="mt-3 inline-block text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors"
          >
            Add your first case study &rarr;
          </Link>
        </div>
      ) : (
        /* Projects Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group border border-slate-200 bg-white hover:border-violet-500/30 rounded-2xl overflow-hidden flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 shadow-xs relative"
            >
              
              {/* Cover Image Showcase */}
              <div className="w-full h-44 relative overflow-hidden flex items-center justify-center border-b border-slate-100 bg-slate-50">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                ) : (
                  <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}

                {/* Status and Featured Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
                  {project.is_featured && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-violet-50 border border-violet-200 text-violet-600 shadow-xs">
                      Featured
                    </span>
                  )}
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border
                    ${project.is_published
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                    }
                  `}>
                    {project.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Hover Controls Overlay */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Link
                    href={`/panel/projects/${project.slug}`}
                    className="p-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-violet-600 hover:border-violet-300 transition-all cursor-pointer shadow-xs"
                    title="Edit Project"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:text-white hover:bg-rose-600 hover:border-transparent transition-all cursor-pointer shadow-xs"
                    title="Delete Project"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Project Card Text */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 group-hover:text-violet-600 transition-colors line-clamp-1 leading-snug">{project.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {project.description ? project.description.replace(/<[^>]*>/g, '') : ''}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] font-semibold border-t border-slate-100 pt-3 mt-4 text-slate-400">
                  <span>
                    {project.created_at
                      ? new Date(project.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'N/A'
                    }
                  </span>
                  <div className="flex gap-2">
                    {project.url && (
                      <span className="text-violet-600 font-black">LIVE DEMO</span>
                    )}
                    {project.github_url && (
                      <span className="text-slate-500">GITHUB</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-slate-200 bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600 mb-4 border border-rose-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="font-bold text-lg text-slate-900 mb-2">Delete Project</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Are you sure you want to delete this project? This action will permanently remove it and all mapped skills associations.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-50 flex items-center justify-center gap-2 flex-1"
              >
                {deleteLoading && (
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                )}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
