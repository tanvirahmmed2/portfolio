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
    <div className="min-h-screen py-24 px-6 sm:px-8 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        
        {/* Header */}
        <div className="space-y-3 border-b pb-8">
          <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">My Writing</span>
          <h1 className="text-4xl font-black text-white leading-tight">Articles & Guides</h1>
          <p className="text-xs sm:text-sm">
            Insights on full-stack architecture, database queries, and custom frontends.
          </p>
        </div>

        {/* Blogs grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="h-56 rounded-3xl"></div>
            <div className="h-56 rounded-3xl"></div>
            <div className="h-56 rounded-3xl"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center border rounded-3xl">
            <p className="text-xs">No blogs published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="group border rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Cover */}
                  <div className="relative aspect-video w-full overflow-hidden border-b">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold uppercase tracking-wider">
                        No Preview Image
                      </div>
                    )}
                  </div>

                  {/* Content summary */}
                  <div className="p-5 space-y-2">
                    
                    {/* Timestamp */}
                    <span className="text-[8px] font-bold uppercase tracking-widest block">
                      {blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                    </span>

                    <h2 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    
                    <p className="text-[11px] leading-relaxed line-clamp-3">
                      {blog.summary || (blog.content ? blog.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...' : '')}
                    </p>
                  </div>
                </div>

                {/* Footer read button */}
                <div className="p-5 pt-0">
                  <span className="text-[9px] font-bold text-violet-400 group-hover:text-violet-300 transition-colors flex items-center gap-1">
                    Read Article
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
