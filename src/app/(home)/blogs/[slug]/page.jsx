"use client";
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function BlogDetailPage({ params }) {
  
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBlogDetails() {
      try {
        setLoading(true);
        const res = await fetch(`/api/blog?slug=${slug}`);
        const data = await res.json();
        
        if (res.ok && data.blog) {
          setBlog(data.blog);
        } else {
          setError(data.error || 'Article details not found');
        }
      } catch (err) {
        console.error(err);
        setError('Network error fetching article specifications');
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadBlogDetails();
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
          <p className="text-sm font-semibold tracking-wide">Retrieving article details...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Oops! Fetching Error</h2>
          <p className="text-xs text-slate-500">{error || 'Unable to locate article'}</p>
          <div className="pt-2">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen py-28 px-6 sm:px-8 relative overflow-hidden bg-white text-slate-650">
      
      
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-violet-100/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        
        <div>
          <Link
            href="/blogs"
            className="text-xs font-bold text-violet-600 hover:text-violet-500 transition-colors flex items-center gap-1.5 group"
          >
            <svg className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to articles index
          </Link>
        </div>

        
        <div className="space-y-4">
          
          <div className="flex flex-wrap items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
            {blog.created_at && (
              <span>
                Posted: {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
            {blog.category && (
              <span className="border border-slate-200 px-2 py-0.5 rounded text-slate-500">
                {blog.category}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
            {blog.title}
          </h1>

        </div>

        
        {blog.image && (
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-50">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        
        <div className="prose prose-slate max-w-none pt-4 text-slate-650 prose-a:text-violet-600 hover:prose-a:text-violet-500">
          <div
            dangerouslySetInnerHTML={{ __html: blog.description }}
            className="text-sm sm:text-base space-y-4 leading-relaxed whitespace-normal"
          />
        </div>

      </div>
    </article>
  );
}
