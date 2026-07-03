"use client";
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function ProjectDetailPage({ params }) {
  
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [project, setProject] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProjectDetails() {
      try {
        setLoading(true);
        
        const res = await fetch(`/api/project?slug=${slug}`);
        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || 'Project profile not found');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProject(data.project);
        setSkills(data.skills || []);
      } catch (err) {
        console.error(err);
        setError('Network error resolving project details');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadProjectDetails();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-4 border-violet-500/15 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-violet-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-sm font-semibold tracking-wide text-slate-500">Loading project specs...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Oops! Project Error</h2>
          <p className="text-xs text-slate-500">{error || 'Project details not found'}</p>
          <div className="pt-2">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-28 px-6 sm:px-8 relative overflow-hidden bg-white text-slate-600 selection:bg-violet-100 selection:text-violet-900">
      
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        
        <div>
          <Link
            href="/projects"
            className="text-xs font-bold text-violet-600 hover:text-violet-500 transition-colors flex items-center gap-1.5 group"
          >
            <svg className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to projects
          </Link>
        </div>

        
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
            {project.created_at && (
              <span>
                Completed: {new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
            {project.is_featured && (
              <span className="bg-violet-600 text-white px-2 py-0.5 rounded shadow-xs">
                Featured Work
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
            {project.title}
          </h1>
        </div>

        
        {project.image && (
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-50">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        
        <div className="prose prose-slate max-w-none pt-4">
          <div
            dangerouslySetInnerHTML={{ __html: project.description }}
            className="text-sm sm:text-base text-slate-650 space-y-4 leading-relaxed whitespace-normal"
          />
        </div>

        
        {skills && skills.length > 0 && (
          <div className="space-y-3 border-t border-slate-100 pt-8">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Technologies Used</span>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="text-[10px] font-bold px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 uppercase tracking-wider"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        
        {(project.url || project.github_url) && (
          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-100">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/10 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Launch Live Site</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 hover:border-slate-800 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Browse Source Code</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </a>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
