"use client";
import React, { use, useState, useEffect } from 'react';
import EventForm from '@/components/ui/forms/EventForm.jsx';
import { useToast } from '@/components/helper/ToastProvider.jsx';

export default function PanelEditEventPage({ params }) {
  const { slug } = use(params);
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const res = await fetch(`/api/activities?slug=${slug}`);
        const data = await res.json();
        if (res.ok && data.event) {
          setEvent(data.event);
        } else {
          showToast(data.error || 'Failed to load event details', 'error');
        }
      } catch (err) {
        console.error('Error loading event details:', err);
        showToast('Network error loading event details', 'error');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadEvent();
    }
  }, [slug, showToast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Edit Event</h1>
        <p className="text-sm mt-1 text-slate-500">Modify event dates, description details, location credentials, or image covers.</p>
      </div>

      {loading ? (
        <div className="max-w-4xl border border-slate-200 bg-white rounded-3xl p-6 sm:p-8 space-y-6 animate-pulse shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-10 bg-slate-200 rounded-xl"></div>
            <div className="h-10 bg-slate-200 rounded-xl"></div>
            <div className="h-10 bg-slate-200 rounded-xl"></div>
            <div className="h-10 bg-slate-200 rounded-xl"></div>
          </div>
          <div className="h-28 bg-slate-200 rounded-xl mt-4"></div>
        </div>
      ) : event ? (
        <EventForm initialData={event} />
      ) : (
        <div className="text-center py-20 border border-slate-200 bg-white text-slate-550 rounded-2xl shadow-xs">
          <p className="font-semibold uppercase tracking-wider text-xs">Event Not Found</p>
          <p className="text-[11px] mt-1 text-slate-400">The event you are looking for does not exist or has been deleted.</p>
        </div>
      )}
    </div>
  );
}
