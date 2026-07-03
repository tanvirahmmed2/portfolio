"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/helper/ToastProvider.jsx';

export default function PanelEventsPage() {
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/activities');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      } else {
        showToast('Failed to fetch events list', 'error');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      showToast('Network error fetching events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (id) => {
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/activities?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Event removed successfully');
        setDeleteConfirmId(null);
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
      } else {
        showToast(data.error || 'Failed to delete event', 'error');
      }
    } catch (err) {
      console.error('Delete event error:', err);
      showToast('Network error deleting event', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Events Portfolio</h1>
          <p className="text-sm mt-1 text-slate-500">Manage bootcamps, workshops, conferences, and livestream events.</p>
        </div>

        <Link
          href="/panel/events/new"
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white rounded-xl shadow-md shadow-violet-600/10 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Event
        </Link>
      </div>

      {loading ? (
        /* Skeleton Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-slate-200 bg-white rounded-2xl p-5 space-y-4 animate-pulse shadow-xs">
              <div className="h-28 bg-slate-100 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-3.5 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-full mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 border border-dashed border-slate-200 bg-white rounded-2xl text-slate-500 shadow-xs">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-medium">No events logged yet.</p>
          <p className="text-xs mt-1">Click the "Add Event" button above to log your first event.</p>
        </div>
      ) : (
        /* Events Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="border border-slate-200 bg-white rounded-2xl overflow-hidden flex flex-col justify-between group hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 shadow-xs"
            >
              
              <div className="relative h-40 border-b border-slate-100 bg-slate-50 overflow-hidden">
                {ev.image ? (
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pointer-events-none">
                  {ev.event_type && (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-violet-50 text-violet-650 border border-violet-200/60 uppercase tracking-wide">
                      {ev.event_type}
                    </span>
                  )}
                  {ev.is_featured && (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-600/90 text-white shadow-sm uppercase tracking-wide">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  
                  <div className="flex flex-col text-[10px] font-medium text-slate-450 gap-0.5">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {ev.event_date
                        ? new Date(ev.event_date).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Unscheduled'
                      }
                    </span>
                    {ev.location && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {ev.location}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-800 text-xs leading-snug group-hover:text-violet-600 transition-colors line-clamp-2">
                    {ev.title}
                  </h3>
                </div>

                
                <div className="flex justify-between items-center border-t border-slate-100 pt-3.5 text-slate-400">
                  <span className="text-[10px] font-mono select-all">/{ev.slug}</span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/panel/events/${ev.slug}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 border border-slate-200 transition-all cursor-pointer shadow-xs"
                      title="Edit Event"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>

                    <button
                      onClick={() => setDeleteConfirmId(ev.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer shadow-xs"
                      title="Delete Event"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-slate-200 bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600 mb-4 border border-rose-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="font-bold text-lg text-slate-900 mb-2">Delete Event</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Are you sure you want to delete this event? This action is permanent, will remove it from the dashboard, and clean up stored media.
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
                onClick={() => handleDeleteEvent(deleteConfirmId)}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-50 text-white disabled:opacity-50 flex items-center justify-center gap-2 flex-1"
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
