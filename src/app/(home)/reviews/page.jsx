"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';

export default function PublicReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const fetchApprovedReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/review');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !reviewText.trim()) {
      showToast('Name, email, and review message are required.', 'warning');
      return;
    }

    try {
      setSubmitLoading(true);
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          title: title.trim() || null,
          company: company.trim() || null,
          rating,
          review: reviewText.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'Review submitted for approval!', 'success');
        setName('');
        setEmail('');
        setTitle('');
        setCompany('');
        setRating(5);
        setReviewText('');
      } else {
        showToast(data.error || 'Failed to submit review', 'error');
      }
    } catch (err) {
      console.error('Submit review error:', err);
      showToast('Network error submitting review', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  
  const renderStars = (count, size = "w-4 h-4") => {
    return (
      <div className="flex gap-0.5 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`${size} ${i < count ? 'fill-current' : 'text-neutral-700'}`}
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
    <div className="min-h-screen py-28 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden bg-white text-slate-600 selection:bg-violet-100 selection:text-violet-900">
      
      
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-fuchsia-100/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        
        <div className="lg:col-span-5 p-6 sm:p-8 border border-slate-200 bg-slate-50/20 rounded-3xl backdrop-blur-md flex flex-col gap-6">
          <div>
            <span className="text-[10px] font-black tracking-widest text-violet-600 uppercase">Testimonials</span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">Leave a Review</h1>
            <p className="text-xs mt-2 leading-relaxed text-slate-500">
              Your feedback is valuable! Shares your experience collaborating or working with me.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-650 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-655 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Designation / Role</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Tech Lead (Optional)"
                  className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-650 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google (Optional)"
                  className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-650 transition-all"
                />
              </div>
            </div>

            
            <div className="flex flex-col gap-1 border border-slate-200 bg-white p-3 rounded-xl">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Select Rating</span>
              <div className="flex gap-1.5 mt-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isGold = hoverRating ? star <= hoverRating : star <= rating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="hover:scale-110 active:scale-95 transition-all duration-150 cursor-pointer"
                    >
                      <svg
                        className={`w-7 h-7 transition-colors ${isGold ? 'text-amber-400 fill-current' : 'text-slate-200'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Review Message</label>
              <textarea
                required
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your detailed feedback here..."
                className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-650 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-md shadow-violet-600/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Submit Review'
              )}
            </button>
          </form>
        </div>

        
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div>
            <span className="text-[10px] font-black tracking-widest text-violet-600 uppercase">Approved Library</span>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-1">Recommendations</h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-slate-200 bg-slate-50/50 rounded-2xl p-5 space-y-3 animate-pulse">
                  <div className="h-4 rounded w-20 bg-slate-200"></div>
                  <div className="h-3.5 rounded w-full bg-slate-200"></div>
                  <div className="h-3 rounded w-1/3 bg-slate-200"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-300 bg-slate-50/20 text-slate-400 rounded-2xl">
              <svg className="w-10 h-10 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-xs font-semibold uppercase tracking-wider">No reviews approved yet</p>
              <p className="text-[10px] mt-0.5">Be the first to submit a review on the left!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="border border-slate-200 bg-white shadow-xs rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 relative overflow-hidden"
                >
                  
                  <div className="flex justify-between items-center">
                    {renderStars(rev.rating)}
                    <span className="text-3xl font-serif leading-none select-none text-slate-200">“</span>
                  </div>

                  
                  <p className="text-xs leading-relaxed whitespace-pre-wrap italic text-slate-650">
                    {rev.review}
                  </p>

                  
                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[10px] font-semibold">
                    <div>
                      <span className="text-slate-900 block font-bold">{rev.name}</span>
                      {(rev.title || rev.company) && (
                        <span className="text-[9px] mt-0.5 block text-slate-400">
                          {rev.title || ''}{rev.title && rev.company ? ' at ' : ''}{rev.company || ''}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-slate-400">
                      {rev.created_at
                        ? new Date(rev.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : ''
                      }
                    </span>
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
