"use client";
import React from 'react';
import EventForm from '@/components/ui/forms/EventForm.jsx';

export default function PanelNewEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Create Event</h1>
        <p className="text-sm mt-1">Publish a new event details, location credentials, and registration information.</p>
      </div>

      <EventForm />
    </div>
  );
}
