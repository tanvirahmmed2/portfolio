"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectCard from './ProjectCard';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto space-y-12"
      >
        
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">Selected Work</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Featured Projects</h2>
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

        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
}