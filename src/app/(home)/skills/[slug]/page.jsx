"use client";
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function SkillDetailPage({ params }) {
  
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [skill, setSkill] = useState(null);
  const [associatedProjects, setAssociatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSkillAndProjects() {
      try {
        setLoading(true);
        
        const skillRes = await fetch('/api/skill');
        const skillData = await skillRes.json();
        const list = skillData.skills || [];
        
        
        const found = list.find(s => s.name.toLowerCase().replace(/ /g, '-') === slug);
        if (!found) {
          setError('Skill profile not found');
          setLoading(false);
          return;
        }
        setSkill(found);

        
        const projectRes = await fetch('/api/project');
        const projectData = await projectRes.json();
        
        const matching = (projectData.projects || []).filter(p => 
          p.is_published && p.skills && p.skills.some(s => s.id === found.id)
        );
        setAssociatedProjects(matching);

      } catch (err) {
        console.error(err);
        setError('Network error resolving skill details');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadSkillAndProjects();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-4 border-violet-500/15 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-violet-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-sm font-semibold tracking-wide">Loading skill profiles...</p>
        </div>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Oops! Skill Error</h2>
          <p className="text-xs text-slate-500">{error || 'Skill details not found'}</p>
          <div className="pt-2">
            <Link
              href="/skills"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              Back to Skill Stack
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-28 px-6 sm:px-8 relative overflow-hidden bg-white text-slate-650">
      
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        
        <div>
          <Link
            href="/skills"
            className="text-xs font-bold text-violet-600 hover:text-violet-500 transition-colors flex items-center gap-1.5 group"
          >
            <svg className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to skill stacks
          </Link>
        </div>

        
        <div className="p-6 sm:p-8 border border-slate-200 bg-slate-50/20 rounded-3xl flex flex-col sm:flex-row items-center gap-6">
          {skill.image ? (
            <img
              src={skill.image}
              alt={skill.name}
              className="w-16 h-16 object-contain"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-lg font-bold text-slate-700">
              {skill.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          
          <div className="flex-1 w-full space-y-3">
            <div className="space-y-1 text-center sm:text-left">
              <h1 className="text-2xl font-black text-slate-900">{skill.name}</h1>
            </div>
            
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <span>Skill Mastery</span>
                <span className="text-slate-700">{skill.proficiency || 0}% Proficiency</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden border border-slate-100 bg-slate-100">
                <div
                  className="bg-violet-600 h-full rounded-full"
                  style={{ width: `${skill.proficiency || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Projects built using {skill.name} ({associatedProjects.length})
            </h2>
          </div>

          {associatedProjects.length === 0 ? (
            <div className="p-12 text-center border border-slate-200 bg-slate-50/20 rounded-2xl text-slate-400">
              <p className="text-xs">No project listings associated with this skill stack yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {associatedProjects.map((project) => (
                <div
                  key={project.id}
                  className="group p-5 border border-slate-200 bg-white hover:border-violet-500/30 rounded-2xl transition-all duration-300 flex flex-col justify-between hover:shadow-md"
                >
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[10px] leading-relaxed text-slate-500 line-clamp-3">
                      {project.description ? project.description.replace(/<[^>]*>/g, '') : ''}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-bold text-white bg-violet-600 hover:bg-violet-500 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Live Demo
                      </a>
                    )}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-[9px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      Specifications &rarr;
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
