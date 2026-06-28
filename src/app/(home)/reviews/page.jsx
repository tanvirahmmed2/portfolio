"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';

export default function PublicReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
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

  // Star renderer helper
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
    <div className="min-h-screen bg-neutral-950 py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-fuchsia-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* Left Side: Submit Card (col-span-5) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-neutral-900/30 border border-neutral-800/80 rounded-3xl backdrop-blur-md flex flex-col gap-6">
          <div>
            <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">Testimonials</span>
            <h1 className="text-2xl font-black tracking-tight text-white mt-1">Leave a Review</h1>
            <p className="text-neutral-400 text-xs mt-2 leading-relaxed">
              Your feedback is valuable! Shares your experience collaborating or working with me.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Designation / Role</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Tech Lead (Optional)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google (Optional)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>
            </div>

            {/* Interactive Rating Star Select */}
            <div className="flex flex-col gap-1 bg-neutral-950/30 border border-neutral-850 p-3 rounded-xl">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Select Rating</span>
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
                      className="text-neutral-700 hover:scale-110 active:scale-95 transition-all duration-150 cursor-pointer"
                    >
                      <svg
                        className={`w-7 h-7 transition-colors ${isGold ? 'text-amber-400 fill-current' : 'text-neutral-700'}`}
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
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Review Message</label>
              <textarea
                required
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your detailed feedback here..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none"
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

        {/* Right Side: Reviews Library Feed (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div>
            <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">Approved Library</span>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">Recommendations</h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-neutral-900/15 border border-neutral-900 rounded-2xl p-5 space-y-3 animate-pulse">
                  <div className="h-4 bg-neutral-800 rounded w-20"></div>
                  <div className="h-3.5 bg-neutral-800 rounded w-full"></div>
                  <div className="h-3 bg-neutral-800 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-neutral-900/50 rounded-2xl bg-neutral-900/10">
              <svg className="w-10 h-10 mx-auto text-neutral-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">No reviews approved yet</p>
              <p className="text-[10px] text-neutral-600 mt-0.5">Be the first to submit a review on the left!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-neutral-900/20 hover:bg-neutral-900/40 border border-neutral-900 hover:border-neutral-850 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Rating & Quote Icon */}
                  <div className="flex justify-between items-center">
                    {renderStars(rev.rating)}
                    <span className="text-3xl text-neutral-800 font-serif leading-none select-none">“</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap italic">
                    {rev.review}
                  </p>

                  {/* Reviewer Meta */}
                  <div className="border-t border-neutral-900/60 pt-3 flex justify-between items-center text-[10px] font-semibold text-neutral-500">
                    <div>
                      <span className="text-white block font-bold">{rev.name}</span>
                      {(rev.title || rev.company) && (
                        <span className="text-[9px] text-neutral-500 mt-0.5 block">
                          {rev.title || ''}{rev.title && rev.company ? ' at ' : ''}{rev.company || ''}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-neutral-600">
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
