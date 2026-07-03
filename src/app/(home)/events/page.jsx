"use client";
import React, { useState, useEffect } from 'react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/activities');
        if (res.ok) {
          const data = await res.json();
          
          const list = (data.activities || []).filter(e => e.is_published);
          setEvents(list);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen py-28 px-6 sm:px-8 relative overflow-hidden bg-white text-slate-655 selection:bg-violet-100 selection:text-violet-900">
      
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        
        <div className="space-y-3 border-b border-slate-100 pb-8">
          <span className="text-[10px] font-black tracking-widest text-violet-600 uppercase">Community & Outreach</span>
          <h1 className="text-4xl font-black text-slate-900 leading-tight">Featured Events</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Keep track of upcoming hackathons, tech meetups, presentations, and webinars.
          </p>
        </div>

        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-48 rounded-3xl bg-slate-100"></div>
            <div className="h-48 rounded-3xl bg-slate-100"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center border border-slate-200 bg-slate-50/20 text-slate-400 rounded-3xl">
            <p className="text-xs">No active events listed at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="group border border-slate-200 bg-white shadow-xs rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-lg"
              >
                
                <div>
                  
                  <div className="relative aspect-video w-full overflow-hidden border-b border-slate-100 bg-slate-50">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                        No Event Cover Preview
                      </div>
                    )}
                    
                    {event.is_featured && (
                      <span className="absolute top-3 left-3 bg-violet-600 text-[8px] font-black text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Featured Event
                      </span>
                    )}
                  </div>

                  
                  <div className="p-6 space-y-3">
                    
                    
                    {event.event_date && (
                      <span className="text-[8px] font-bold text-violet-600 uppercase tracking-widest block">
                        {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}

                    <h2 className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                      {event.title}
                    </h2>
                    
                    {event.location && (
                      <span className="text-[10px] block text-slate-500">
                        📍 {event.location}
                      </span>
                    )}

                    <p className="text-[11px] leading-relaxed text-slate-500 line-clamp-3">
                      {event.description ? event.description.replace(/<[^>]*>/g, '') : ''}
                    </p>
                  </div>
                </div>

                
                <div className="p-6 pt-0 flex flex-wrap items-center gap-4">
                  {event.registration_url && (
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg text-[10px] font-bold text-white bg-violet-600 hover:bg-violet-500 transition-all cursor-pointer shadow-md shadow-violet-600/10"
                    >
                      Register
                    </a>
                  )}
                  {event.event_url && (
                    <a
                      href={event.event_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors border border-slate-200 bg-white hover:bg-slate-50"
                    >
                      Event Details
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
