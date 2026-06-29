"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';
import Link from 'next/link';

export default function PanelBlogsPage() {
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Deletion confirm modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || []);
      } else {
        showToast('Failed to fetch blog posts', 'error');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      showToast('Network error fetching blog posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/blog?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Blog post deleted successfully');
        setDeleteConfirmId(null);
        fetchBlogs();
      } else {
        showToast(data.error || 'Failed to delete blog post', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Network error deleting blog post', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Blog Articles</h1>
          <p className="text-sm mt-1">Write, manage, and monitor articles published to your portfolio.</p>
        </div>
        
        <Link
          href="/panel/blogs/new"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 hover:-translate-y-0.5 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Write Article
        </Link>
      </div>

      {loading ? (
        /* Skeleton Loading Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 border rounded-2xl p-5 flex flex-col justify-between animate-pulse">
              <div className="w-full h-32 rounded-xl mb-4"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 rounded-md w-3/4"></div>
                <div className="h-3 rounded-md w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 border border-dashed rounded-2xl">
          <svg className="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2m2 2a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-1m4-13h.01M9 16h6m-6-4h6m-6-4h3" />
          </svg>
          <p className="font-medium">No blog posts found.</p>
          <Link
            href="/panel/blogs/new"
            className="mt-3 inline-block text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
          >
            Draft your first article &rarr;
          </Link>
        </div>
      ) : (
        /* Blogs Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="group border hover:border-violet-500/20 rounded-2xl overflow-hidden flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300 shadow-sm relative"
            >
              
              {/* Thumbnail Cover */}
              <div className="w-full h-44 relative overflow-hidden flex items-center justify-center border-b">
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                ) : (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border
                    ${blog.is_published
                      ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-neutral-800/85 text-neutral-400 border-neutral-700/50'
                    }
                  `}>
                    {blog.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Quick Hover Controls Overlay */}
                <div className="absolute inset-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Link
                    href={`/panel/blogs/${blog.slug}`}
                    className="p-3 rounded-xl border hover:text-white hover:border-violet-500/50 transition-all cursor-pointer"
                    title="Edit Article"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => setDeleteConfirmId(blog.id)}
                    className="p-3 rounded-xl bg-rose-600/10 border border-rose-500/10 text-rose-400 hover:text-white hover:bg-rose-600 hover:border-transparent transition-all cursor-pointer"
                    title="Delete Article"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-2 leading-snug">{blog.title}</h3>
                  <p className="text-[11px] mt-2 font-medium">By: {blog.author_name || 'System Admin'}</p>
                </div>

                <div className="flex justify-between items-center text-[10px] font-semibold border-t pt-3 mt-4">
                  <span>
                    {blog.created_at
                      ? new Date(blog.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'N/A'
                    }
                  </span>
                  {blog.published_at && (
                    <span className="text-violet-500">
                      Pub: {new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            
            <div className="w-12 h-12 bg-rose-600/10 rounded-full flex items-center justify-center mx-auto text-rose-500 mb-4 border border-rose-500/20">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="font-bold text-lg text-white mb-2">Delete Article</h3>
            <p className="text-xs leading-relaxed mb-6">
              Are you sure you want to delete this blog post? This action will permanently remove it from the database and delete its mapping skills associations.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold hover:text-white transition-colors flex-1"
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
