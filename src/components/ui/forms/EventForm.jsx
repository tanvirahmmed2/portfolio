"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/helper/ToastProvider.jsx';
import Editor from '@/components/ui/forms/Editor.jsx';

export default function EventForm({ initialData }) {
  const router = useRouter();
  const { showToast } = useToast();

  const isEdit = !!initialData;

  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [eventUrl, setEventUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageId, setImageId] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    const pad = (num) => String(num).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSlug(initialData.slug || '');
      setDescription(initialData.description || '');
      setEventType(initialData.event_type || '');
      setLocation(initialData.location || '');
      setEventDate(formatDateForInput(initialData.event_date));
      setRegistrationUrl(initialData.registration_url || '');
      setEventUrl(initialData.event_url || '');
      setImageUrl(initialData.image || '');
      setImageId(initialData.image_id || '');
      setIsFeatured(initialData.is_featured || false);
    }
  }, [initialData]);

  
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!isEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generated);
    }
  };

  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadingImage(true);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setImageUrl(data.url);
        setImageId(data.image_id);
        showToast('Cover image uploaded successfully');
      } else {
        showToast(data.error || 'Failed to upload event image', 'error');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      showToast('Network error uploading cover image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim() || !eventDate) {
      showToast('Title, slug, and event date are required.', 'warning');
      return;
    }

    try {
      setSubmitLoading(true);

      const url = isEdit ? `/api/activities?id=${initialData.id}` : '/api/activities';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          description,
          event_type: eventType.trim() || null,
          location: location.trim() || null,
          event_date: eventDate,
          registration_url: registrationUrl.trim() || null,
          event_url: eventUrl.trim() || null,
          image: imageUrl || null,
          image_id: imageId || null,
          is_featured: isFeatured,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(isEdit ? 'Event updated successfully' : 'Event created successfully', 'success');
        router.push('/panel/events');
        router.refresh();
      } else {
        showToast(data.error || 'Failed to save event information', 'error');
      }
    } catch (err) {
      console.error('Save event error:', err);
      showToast('Network error saving event details', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl border border-slate-200 bg-white rounded-3xl p-6 sm:p-8 shadow-xs">
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Event Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. NextJS Developer Meetup"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          />
        </div>

        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">URL Slug</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            placeholder="e.g. nextjs-developer-meetup"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          />
        </div>

        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Event Date & Time</label>
          <input
            type="datetime-local"
            required
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          />
        </div>

        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Event Type / Tag</label>
          <input
            type="text"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            placeholder="e.g. Meetup, Workshop, Conference"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          />
        </div>

        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Location / Streaming Link</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Silicon Valley Center or Zoom/YouTube"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          />
        </div>

        
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-3 border border-slate-200 bg-slate-50/50 p-3.5 rounded-xl cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-violet-500 w-4 h-4 rounded cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-700">Featured Event</span>
              <span className="text-[9px] text-slate-400">Showcase this event prominently</span>
            </div>
          </label>
        </div>

        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Registration Link</label>
          <input
            type="url"
            value={registrationUrl}
            onChange={(e) => setRegistrationUrl(e.target.value)}
            placeholder="https://eventbrite.com/example"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          />
        </div>

        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Join / Details Link</label>
          <input
            type="url"
            value={eventUrl}
            onChange={(e) => setEventUrl(e.target.value)}
            placeholder="https://zoom.us/j/example"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          />
        </div>

      </div>

      
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Cover Image</span>
        <div className="flex items-center gap-6 p-5 border border-slate-200 bg-slate-50/50 rounded-2xl flex-col sm:flex-row">
          {imageUrl ? (
            <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-slate-200 bg-white flex-shrink-0">
              <img src={imageUrl} alt="Thumbnail Preview" className="object-cover w-full h-full" />
              <button
                type="button"
                onClick={() => {
                  setImageUrl('');
                  setImageId('');
                }}
                className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full p-1 hover:bg-red-500 transition-colors shadow-md cursor-pointer"
                title="Remove image"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-40 h-24 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center flex-shrink-0 text-slate-400">
              <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          <div className="flex-1 flex flex-col items-start gap-2 text-slate-400">
            <label className="px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs">
              {uploadingImage ? 'Uploading Image...' : 'Choose Cover File'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
            <span className="text-[10px] text-slate-400">Supports PNG, JPG, or WEBP up to 5MB. Uploaded via Cloudinary.</span>
          </div>
        </div>
      </div>

      
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-semibold">Event Description</label>
        <Editor content={description} onChange={setDescription} />
      </div>

      
      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => router.push('/panel/events')}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitLoading || uploadingImage}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-violet-600/10"
        >
          {submitLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            isEdit ? 'Update Event' : 'Create Event'
          )}
        </button>
      </div>

    </form>
  );
}
