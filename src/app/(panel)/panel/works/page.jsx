"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';

export default function PanelWorksPage() {
  const { showToast } = useToast();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [modalOpen, setModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  
  const [companyName, setCompanyName] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState('');

  
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  
  const fetchWorks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/work');
      if (res.ok) {
        const data = await res.json();
        
        
        setWorks(data.workHistory || data.works || []);
      } else {
        showToast('Failed to fetch work history list', 'error');
      }
    } catch (err) {
      console.error('Error fetching work history:', err);
      showToast('Network error fetching work history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthStr = months[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    return `${monthStr} ${year}`;
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setCompanyName('');
    setCompanyUrl('');
    setTitle('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setDescription('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (work) => {
    setEditingId(work.id);
    setCompanyName(work.company_name || '');
    setCompanyUrl(work.company_url || '');
    setTitle(work.title || '');
    setLocation(work.location || '');
    setStartDate(formatDateForInput(work.start_date));
    setEndDate(formatDateForInput(work.end_date));
    setIsCurrent(work.is_current || false);
    setDescription(work.description || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyName.trim() || !title.trim() || !startDate || !description.trim()) {
      showToast('Company name, job title, start date, and description are required.', 'warning');
      return;
    }

    if (!isCurrent && endDate && new Date(startDate) > new Date(endDate)) {
      showToast('Start date cannot be after the end date.', 'error');
      return;
    }

    try {
      setSubmitLoading(true);
      const url = editingId ? `/api/work?id=${editingId}` : '/api/work';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName.trim(),
          company_url: companyUrl.trim() || null,
          title: title.trim(),
          location: location.trim() || null,
          start_date: startDate,
          end_date: isCurrent ? null : (endDate || null),
          is_current: isCurrent,
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(editingId ? 'Work experience updated successfully' : 'Work experience added successfully', 'success');
        setModalOpen(false);
        fetchWorks();
      } else {
        showToast(data.error || 'Failed to save experience details', 'error');
      }
    } catch (err) {
      console.error('Save experience error:', err);
      showToast('Network error saving experience details', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/work?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Work history entry deleted successfully');
        setDeleteConfirmId(null);
        setWorks((prev) => prev.filter((w) => w.id !== id));
      } else {
        showToast(data.error || 'Failed to delete work entry', 'error');
      }
    } catch (err) {
      console.error('Delete work error:', err);
      showToast('Network error deleting work entry', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Career & Work History</h1>
          <p className="text-sm mt-1 text-slate-500">Manage employment timeline, client contract records, and consulting gigs.</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white rounded-xl shadow-md shadow-violet-600/10 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Experience
        </button>
      </div>

      {loading ? (
        /* Skeleton Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border border-slate-200 bg-white rounded-2xl p-5 space-y-4 animate-pulse shadow-xs">
              <div className="flex justify-between">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-24"></div>
              </div>
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6 mt-2"></div>
              <div className="flex gap-3 justify-end pt-3">
                <div className="h-7 bg-slate-200 rounded w-14"></div>
                <div className="h-7 bg-slate-200 rounded w-14"></div>
              </div>
            </div>
          ))}
        </div>
      ) : works.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 border border-dashed border-slate-200 bg-white rounded-2xl text-slate-500 shadow-xs">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="font-medium">No experience history logged yet.</p>
          <p className="text-xs mt-1">Click the "Add Experience" button above to list your past employment details.</p>
        </div>
      ) : (
        /* Experience List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {works.map((work) => (
            <div
              key={work.id}
              className="border border-slate-200 bg-white rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-200 border-l-4 border-l-violet-500"
            >
              
              
              <div className="space-y-1">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-sm font-black text-slate-900 leading-snug">{work.title}</h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-500 shrink-0">
                    {formatDateForDisplay(work.start_date)} - {work.is_current ? 'Present' : formatDateForDisplay(work.end_date)}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  {work.company_url ? (
                    <a
                      href={work.company_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-650 hover:text-violet-500 underline flex items-center gap-1"
                    >
                      {work.company_name}
                      <svg className="w-3 h-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 00-2 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <span>{work.company_name}</span>
                  )}
                  {work.location && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span>{work.location}</span>
                    </>
                  )}
                </div>
              </div>

              
              <div className="flex-1 bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                <p className="text-xs text-slate-650 whitespace-pre-line leading-relaxed line-clamp-4">
                  {work.description}
                </p>
              </div>

              
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => handleOpenEditModal(work)}
                  className="p-1.5 rounded-lg text-slate-450 hover:bg-violet-50 hover:text-violet-600 border border-slate-200 transition-all cursor-pointer shadow-xs"
                  title="Edit Experience"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button
                  onClick={() => setDeleteConfirmId(work.id)}
                  className="p-1.5 rounded-lg text-slate-450 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer shadow-xs"
                  title="Delete Experience"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="border border-slate-200 bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto"
          >
            <div>
              <h3 className="font-bold text-lg text-slate-900">{editingId ? 'Edit Work Experience' : 'Add Work Experience'}</h3>
              <p className="text-xs text-slate-500 mt-1">Specify your employment parameters, date frames, and job obligations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Job Title / Role</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>

              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>

              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Company URL (Optional)</label>
                <input
                  type="url"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  placeholder="https://acme.corp"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>

              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Location (Optional)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote or San Francisco, CA"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>

              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>

              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">End Date</label>
                <input
                  type="date"
                  disabled={isCurrent}
                  required={!isCurrent}
                  value={isCurrent ? '' : endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
            </div>

            
            <div className="flex items-center gap-2.5">
              <input
                id="isCurrentCheckbox"
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => {
                  setIsCurrent(e.target.checked);
                  if (e.target.checked) setEndDate('');
                }}
                className="accent-violet-500 w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="isCurrentCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                I am currently working in this role
              </label>
            </div>

            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Role Description & Responsibilities</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your achievements, technical stack, or project involvements..."
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder-slate-400 leading-relaxed"
              ></textarea>
            </div>

            
            <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-violet-600/10"
              >
                {submitLoading && (
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                )}
                {editingId ? 'Save Changes' : 'Create Entry'}
              </button>
            </div>
          </form>
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

            <h3 className="font-bold text-lg text-slate-900 mb-2">Delete Work Experience</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Are you sure you want to delete this work history record? This action is permanent and cannot be undone.
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
