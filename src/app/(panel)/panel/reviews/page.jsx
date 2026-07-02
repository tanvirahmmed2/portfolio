"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';

export default function PanelReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'
  
  // Moderate action loaders (mapped by review ID)
  const [actionLoading, setActionLoading] = useState({});
  // Deletion confirm modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/review');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      } else {
        showToast('Failed to fetch reviews', 'error');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      showToast('Network error fetching reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (id, isApprovedNow) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: true }));
      const res = await fetch(`/api/review?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: isApprovedNow }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(isApprovedNow ? 'Review approved successfully' : 'Review status set to pending');
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, is_approved: isApprovedNow } : r))
        );
      } else {
        showToast(data.error || 'Failed to update review status', 'error');
      }
    } catch (err) {
      console.error('Toggle approval error:', err);
      showToast('Network error updating review status', 'error');
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/review?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Review deleted successfully');
        setDeleteConfirmId(null);
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        showToast(data.error || 'Failed to delete review', 'error');
      }
    } catch (err) {
      console.error('Delete review error:', err);
      showToast('Network error deleting review', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Split reviews
  const pendingReviews = reviews.filter((r) => !r.is_approved);
  const approvedReviews = reviews.filter((r) => r.is_approved);
  const displayedReviews = activeTab === 'pending' ? pendingReviews : approvedReviews;

  // Star renderer helper
  const renderStars = (count, size = "w-3.5 h-3.5") => {
    return (
      <div className="flex gap-0.5 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`${size} ${i < count ? 'fill-current' : 'text-slate-200'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Review Moderation</h1>
        <p className="text-sm mt-1 text-slate-500">Approve client reviews, draft testimonials, and manage recommendation lists.</p>
      </div>

      {/* Tab Selectors */}
      <div className="flex gap-4 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider relative transition-all duration-150 cursor-pointer
            ${activeTab === 'pending'
              ? 'text-slate-800 border-b-2 border-violet-600'
              : 'text-slate-400 hover:text-slate-700'
            }
          `}
        >
          Pending Moderation ({pendingReviews.length})
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider relative transition-all duration-150 cursor-pointer
            ${activeTab === 'approved'
              ? 'text-slate-800 border-b-2 border-violet-600'
              : 'text-slate-400 hover:text-slate-700'
            }
          `}
        >
          Approved Library ({approvedReviews.length})
        </button>
      </div>

      {loading ? (
        /* Skeleton Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border border-slate-200 bg-white rounded-2xl p-5 space-y-4 animate-pulse shadow-xs">
              <div className="flex justify-between">
                <div className="h-3.5 bg-slate-200 rounded w-1/4"></div>
                <div className="h-3.5 bg-slate-200 rounded w-20"></div>
              </div>
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6 mt-2"></div>
              <div className="flex gap-3 justify-end pt-3">
                <div className="h-7 bg-slate-200 rounded w-16"></div>
                <div className="h-7 bg-slate-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : displayedReviews.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 border border-dashed border-slate-200 bg-white rounded-2xl text-slate-500 shadow-xs">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" />
          </svg>
          <p className="font-medium">No reviews in this category.</p>
        </div>
      ) : (
        /* Reviews Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {displayedReviews.map((rev) => {
            const modLoading = actionLoading[rev.id];

            return (
              <div
                key={rev.id}
                className="border border-slate-200 bg-white rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-200"
              >
                
                {/* Header Rating & Email */}
                <div className="flex justify-between items-center flex-wrap gap-2">
                  {renderStars(rev.rating)}
                  {rev.email && (
                    <span className="text-[10px] font-mono text-slate-400 select-all">{rev.email}</span>
                  )}
                </div>

                {/* Body Text */}
                <div className="flex-1 border border-slate-100 bg-slate-50/50 p-3.5 rounded-xl">
                  <p className="text-xs italic text-slate-650 whitespace-pre-wrap leading-relaxed">&ldquo;{rev.review}&rdquo;</p>
                </div>

                {/* Reviewer Meta & Action Buttons */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-3 flex-wrap gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{rev.name}</span>
                    {(rev.title || rev.company) && (
                      <span className="text-[9px] text-slate-400 mt-0.5 block">
                        {rev.title || ''}{rev.title && rev.company ? ' at ' : ''}{rev.company || ''}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {/* Approve / Disapprove Switch */}
                    {rev.is_approved ? (
                      <button
                        onClick={() => handleToggleApproval(rev.id, false)}
                        disabled={modLoading}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer text-[10px] font-bold shadow-xs"
                      >
                        {modLoading ? 'Updating...' : 'Set Pending'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleApproval(rev.id, true)}
                        disabled={modLoading}
                        className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-[10px] font-bold text-white shadow-md shadow-violet-600/5 transition-all cursor-pointer"
                      >
                        {modLoading ? 'Approving...' : 'Approve'}
                      </button>
                    )}

                    {/* Delete Trigger */}
                    <button
                      onClick={() => setDeleteConfirmId(rev.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer shadow-xs"
                      title="Delete Review"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-slate-200 bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600 mb-4 border border-rose-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="font-bold text-lg text-slate-900 mb-2">Delete Review</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Are you sure you want to delete this review? This action is permanent and cannot be undone.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex-1"
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
