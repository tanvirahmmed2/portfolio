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
          // Filter published events
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
    <div className="min-h-screen bg-neutral-950 py-24 px-6 sm:px-8 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        
        {/* Header */}
        <div className="space-y-3 border-b border-neutral-900 pb-8">
          <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">Community & Outreach</span>
          <h1 className="text-4xl font-black text-white leading-tight">Featured Events</h1>
          <p className="text-neutral-450 text-xs sm:text-sm">
            Keep track of upcoming hackathons, tech meetups, presentations, and webinars.
          </p>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-48 bg-neutral-900 rounded-3xl"></div>
            <div className="h-48 bg-neutral-900 rounded-3xl"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center border border-neutral-900 bg-neutral-900/10 rounded-2xl">
            <p className="text-neutral-500 text-xs">No active events listed at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="group bg-neutral-900/20 border border-neutral-900 hover:border-neutral-850 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
              >
                
                <div>
                  {/* Event Cover Photo */}
                  <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden border-b border-neutral-900/80">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-700 font-bold uppercase tracking-wider">
                        No Event Cover Preview
                      </div>
                    )}
                    
                    {event.is_featured && (
                      <span className="absolute top-3 left-3 bg-violet-600 text-[8px] font-black text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Featured Event
                      </span>
                    )}
                  </div>

                  {/* Body details */}
                  <div className="p-6 space-y-3">
                    
                    {/* Date label */}
                    {event.event_date && (
                      <span className="text-[8px] font-bold text-violet-400 uppercase tracking-widest block">
                        {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}

                    <h2 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
                      {event.title}
                    </h2>
                    
                    {event.location && (
                      <span className="text-[10px] text-neutral-500 block">
                        📍 {event.location}
                      </span>
                    )}

                    <p className="text-[11px] text-neutral-450 leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 pt-0 flex flex-wrap items-center gap-4">
                  {event.registration_url && (
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg text-[10px] font-bold text-white bg-violet-600 hover:bg-violet-500 transition-all cursor-pointer"
                    >
                      Register
                    </a>
                  )}
                  {event.event_url && (
                    <a
                      href={event.event_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg text-[10px] font-bold text-neutral-400 hover:text-white transition-colors"
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
