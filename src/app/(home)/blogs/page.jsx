"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BlogCard from '@/components/pages/BlogCard';

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

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const data = await res.json();
          
          const list = (data.blogs || []).filter(b => b.is_published);
          setBlogs(list);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  return (
    <div className="min-h-screen py-28 px-6 sm:px-8 relative overflow-hidden bg-white text-slate-655 selection:bg-violet-100 selection:text-violet-900">
      
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        
        <div className="space-y-3 border-b border-slate-100 pb-8 text-center sm:text-left">
          <span className="text-xs font-black tracking-widest text-violet-600 uppercase">My Writing</span>
          <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">Articles & Guides</h1>
          <p className="text-sm text-slate-500 max-w-md">
            Insights on full-stack architecture, query optimizations, system integration patterns, and custom dashboard designs.
          </p>
        </div>

        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="h-64 bg-slate-50 rounded-3xl"></div>
            <div className="h-64 bg-slate-50 rounded-3xl"></div>
            <div className="h-64 bg-slate-50 rounded-3xl"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center border border-slate-200 bg-slate-50/20 rounded-3xl">
            <p className="text-sm font-bold text-slate-800">No blogs published yet.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {blogs.map((blog) => (
              <motion.div key={blog.id} variants={itemVariants}>
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}
