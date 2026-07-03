"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProjectCard({ project }) {
  return (
    <div className="relative group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col h-full overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 will-change-transform hover:-translate-y-1">
      {/* Image Section */}
      <Link href={`/projects/${project.slug}`} className="block relative h-56 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center cursor-pointer">
        {project.image ? (
          <Image
            width={1000}
            height={1000}
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover opacity-90 dark:opacity-60 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest gap-1 p-4">
            No Preview Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent"></div>
        
        {/* Float Badge */}
        <div className="absolute top-6 left-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/95 dark:bg-zinc-900/95 border border-zinc-100 dark:border-white/5 rounded-full shadow-md">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-650 dark:text-zinc-400">
              {project.is_featured ? 'Featured' : 'Project'}
            </span>
          </div>
        </div>
      </Link>

      {/* Text content container */}
      <div className="relative z-10 p-8 flex flex-col flex-grow -mt-10 bg-white/95 dark:bg-zinc-950/95 rounded-t-[2.5rem]">
        <Link href={`/projects/${project.slug}`}>
          <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 group-hover:text-violet-500 transition-colors leading-tight mb-4 cursor-pointer">
            {project.title}
          </h3>
        </Link>
        
        <div className="flex-grow space-y-3 overflow-hidden">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed transition-all duration-300 line-clamp-2">
            {project.description ? project.description.replace(/<[^>]*>/g, '') : ''}
          </p>
          
          {project.skills && project.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill.id}
                  className="text-[8px] font-bold px-2 py-0.5 rounded bg-violet-50 dark:bg-zinc-800 text-violet-650 dark:text-zinc-300 uppercase tracking-wide border border-violet-100 dark:border-zinc-700"
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

          <Link
            href={`/projects/${project.slug}`}
            className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-violet-500 flex items-center gap-1 transition-colors mt-2"
          >
            Details <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
          </Link>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 flex items-center gap-3">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-transform duration-200 hover:scale-[1.02] shadow-sm cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link" aria-hidden="true"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg> Explore
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-350 px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-transform duration-200 hover:scale-[1.02] bg-white dark:bg-zinc-900 shadow-sm cursor-pointer"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
