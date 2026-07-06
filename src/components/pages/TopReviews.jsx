"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

export default function TopReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch('/api/review');
        if (res.ok) {
          const data = await res.json();
          
          const list = (data.reviews || []).filter(r => r.status === 'approved');
          setReviews(list.slice(0, 3)); 
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6 sm:px-8 bg-white text-slate-600">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 w-36 rounded bg-slate-100"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-40 rounded-2xl bg-slate-50"></div>
            <div className="h-40 rounded-2xl bg-slate-50"></div>
            <div className="h-40 rounded-2xl bg-slate-50"></div>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="py-20 px-6 sm:px-8 border-t border-slate-105 bg-white text-slate-655 selection:bg-violet-100 selection:text-violet-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto space-y-12"
      >
        
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-widest text-violet-600 uppercase">Recommendations</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Client Feedback</h2>
          </div>
          <Link
            href="/reviews"
            className="text-xs font-bold text-violet-600 hover:text-violet-500 transition-colors flex items-center gap-1.5 self-start sm:self-auto group"
          >
            Submit a review
            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              className="p-6 border border-slate-200 bg-white rounded-3xl transition-all duration-300 flex flex-col justify-between hover:shadow-md hover:border-violet-500/20"
            >
              <div className="space-y-4">
                
                
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: review.rating || 5 }).map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </div>

                
                <p className="text-[11px] leading-relaxed italic text-slate-500">
                  &ldquo;{review.review}&rdquo;
                </p>
              </div>

              
              <div className="mt-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-50 border border-violet-100 text-violet-600 font-black text-xs uppercase flex items-center justify-center font-bold">
                  {review.name ? review.name[0] : 'U'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-slate-800 truncate">{review.name || 'Anonymous client'}</span>
                  <span className="text-[9px] text-slate-400 truncate">{review.email || ''}</span>
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
}