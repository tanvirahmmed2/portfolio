"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const data = await res.json();
          // Filter published blogs
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
    <div className="min-h-screen py-28 px-6 sm:px-8 relative overflow-hidden bg-white text-slate-600 selection:bg-violet-100 selection:text-violet-900">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        
        {/* Header */}
        <div className="space-y-3 border-b border-slate-100 pb-8 text-center sm:text-left">
          <span className="text-xs font-black tracking-widest text-violet-600 uppercase">My Writing</span>
          <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">Articles & Guides</h1>
          <p className="text-sm text-slate-500 max-w-md">
            Insights on full-stack architecture, query optimizations, system integration patterns, and custom dashboard designs.
          </p>
        </div>

        {/* Blogs grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="group border border-slate-200 bg-white rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-lg hover:border-violet-400/40"
              >
                <div>
                  {/* Cover */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-100 flex items-center justify-center">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
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
                  </div>

                  {/* Content summary */}
                  <div className="p-5 space-y-2">
                    
                    {/* Timestamp */}
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">
                      {blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                    </span>

                    <h2 className="text-sm font-extrabold text-slate-950 group-hover:text-violet-600 transition-colors line-clamp-2 leading-snug">
                      {blog.title}
                    </h2>
                    
                    <p className="text-[11px] leading-relaxed text-slate-500 line-clamp-3">
                      {blog.description ? blog.description.replace(/<[^>]*>/g, '').slice(0, 120) + '...' : ''}
                    </p>
                  </div>
                </div>

                {/* Footer read button */}
                <div className="p-5 pt-0">
                  <span className="text-[9px] font-extrabold text-violet-600 group-hover:text-violet-500 transition-colors flex items-center gap-1">
                    Read Article
                    <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>

              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
