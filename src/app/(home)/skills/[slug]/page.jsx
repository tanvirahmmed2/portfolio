"use client";
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function SkillDetailPage({ params }) {
  // Resolve dynamic parameters in Next.js 15+
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
        // 1. Fetch all skills to find the matching name slug
        const skillRes = await fetch('/api/skill');
        const skillData = await skillRes.json();
        const list = skillData.skills || [];
        
        // Find matching skill slug
        const found = list.find(s => s.name.toLowerCase().replace(/ /g, '-') === slug);
        if (!found) {
          setError('Skill category not found');
          setLoading(false);
          return;
        }
        setSkill(found);

        // 2. Fetch all projects and filter the ones containing this skill
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
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-4 border-violet-500/15 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-violet-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-sm font-semibold tracking-wide text-neutral-400">Loading skill profiles...</p>
        </div>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400 p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <h2 className="text-lg font-bold text-white">Oops! Category Error</h2>
          <p className="text-neutral-500 text-xs">{error || 'Skill details not found'}</p>
          <div className="pt-2">
            <Link
              href="/skills"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-bold text-white hover:bg-neutral-850"
            >
              Back to Skill Stack
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-24 px-6 sm:px-8 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        
        {/* Navigation Link */}
        <div>
          <Link
            href="/skills"
            className="text-xs font-bold text-neutral-500 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to skill stacks
          </Link>
        </div>

        {/* Skill Profile Card */}
        <div className="p-6 sm:p-8 bg-neutral-900/10 border border-neutral-900 rounded-3xl flex flex-col sm:flex-row items-center gap-6">
          {skill.image ? (
            <img
              src={skill.image}
              alt={skill.name}
              className="w-16 h-16 object-contain"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-neutral-950 border border-neutral-850 flex items-center justify-center text-lg font-bold text-neutral-500">
              {skill.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          
          <div className="flex-1 w-full space-y-3">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[9px] font-bold text-violet-400 uppercase tracking-widest block">{skill.category}</span>
              <h1 className="text-2xl font-black text-white">{skill.name}</h1>
            </div>
            
            {/* Proficiency progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                <span>Skill Mastery</span>
                <span>{skill.proficiency || 0}% Proficiency</span>
              </div>
              <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-900">
                <div
                  className="bg-violet-600 h-full rounded-full"
                  style={{ width: `${skill.proficiency || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Associated Projects Section */}
        <div className="space-y-6">
          <div className="border-b border-neutral-900 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Projects built using {skill.name} ({associatedProjects.length})
            </h2>
          </div>

          {associatedProjects.length === 0 ? (
            <div className="p-8 text-center border border-neutral-900 bg-neutral-900/10 rounded-2xl">
              <p className="text-neutral-500 text-xs">No project listings associated with this skill stack yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {associatedProjects.map((project) => (
                <div
                  key={project.id}
                  className="group p-5 bg-neutral-900/10 hover:bg-neutral-900/20 border border-neutral-900 hover:border-neutral-850 rounded-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-white group-hover:text-violet-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[10px] text-neutral-450 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-bold text-white bg-neutral-800 hover:bg-neutral-750 px-3 py-1.5 rounded"
                      >
                        Live Demo
                      </a>
                    )}
                    <Link
                      href="/projects"
                      className="text-[9px] font-bold text-neutral-500 hover:text-white transition-colors"
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
