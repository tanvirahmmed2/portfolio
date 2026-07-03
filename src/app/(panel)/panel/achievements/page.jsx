"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';

export default function PanelAchievementsPage() {
  const { showToast } = useToast();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal and submit state
  const [modalOpen, setModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [awarder, setAwarder] = useState('');
  const [dateEarned, setDateEarned] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageId, setImageId] = useState('');
  const [url, setUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/achievements');
      if (res.ok) {
        const data = await res.json();
        setAchievements(data.achievements || []);
      } else {
        showToast('Failed to fetch achievements list', 'error');
      }
    } catch (err) {
      console.error('Error fetching achievements:', err);
      showToast('Network error fetching achievements', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      showToast('Image size should be less than 4MB', 'error');
      return;
    }

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
        showToast('Image uploaded successfully');
      } else {
        showToast(data.error || 'Failed to upload image', 'error');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Network error uploading image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setAwarder('');
    setDateEarned('');
    setDescription('');
    setImageUrl('');
    setImageId('');
    setUrl('');
    setIsFeatured(true);
    setModalOpen(true);
  };

  const handleOpenEditModal = (ach) => {
    setEditingId(ach.id);
    setTitle(ach.title || '');
    setAwarder(ach.awarder || '');
    setDateEarned(formatDateForInput(ach.date_earned));
    setDescription(ach.description || '');
    setImageUrl(ach.image || '');
    setImageId(ach.image_id || '');
    setUrl(ach.url || '');
    setIsFeatured(ach.is_featured !== false);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !awarder.trim() || !dateEarned) {
      showToast('Title, awarder, and date earned are required.', 'warning');
      return;
    }

    try {
      setSubmitLoading(true);
      const urlEndpoint = editingId ? `/api/achievements?id=${editingId}` : '/api/achievements';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(urlEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          awarder: awarder.trim(),
          date_earned: dateEarned,
          description: description.trim() || null,
          image: imageUrl || null,
          image_id: imageId || null,
          url: url.trim() || null,
          is_featured: isFeatured,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(editingId ? 'Achievement updated successfully' : 'Achievement added successfully', 'success');
        setModalOpen(false);
        fetchAchievements();
      } else {
        showToast(data.error || 'Failed to save achievement details', 'error');
      }
    } catch (err) {
      console.error('Save achievement error:', err);
      showToast('Network error saving achievement details', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/achievements?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Achievement deleted successfully');
        setDeleteConfirmId(null);
        setAchievements((prev) => prev.filter((a) => a.id !== id));
      } else {
        showToast(data.error || 'Failed to delete achievement', 'error');
      }
    } catch (err) {
      console.error('Delete achievement error:', err);
      showToast('Network error deleting achievement', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Achievements & Certifications</h1>
          <p className="text-sm mt-1 text-slate-500">Manage your honors, test scores, certifications, and academic trophies.</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white rounded-xl shadow-md shadow-violet-600/10 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Achievement
        </button>
      </div>

      {loading ? (
        /* Skeleton Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border border-slate-200 bg-white rounded-2xl p-5 space-y-4 animate-pulse shadow-xs">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-slate-200 rounded-xl shrink-0"></div>
                <div className="flex-grow space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="flex gap-3 justify-end pt-3">
                <div className="h-7 bg-slate-200 rounded w-14"></div>
                <div className="h-7 bg-slate-200 rounded w-14"></div>
              </div>
            </div>
          ))}
        </div>
      ) : achievements.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 border border-dashed border-slate-200 bg-white rounded-2xl text-slate-500 shadow-xs">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          <p className="font-medium">No achievements logged yet.</p>
          <p className="text-xs mt-1">Click the "Add Achievement" button above to publish your accomplishments.</p>
        </div>
      ) : (
        /* Achievements Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="border border-slate-200 bg-white rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-200 border-l-4 border-l-cyan-500"
            >
              <div className="flex gap-4">
                {ach.image ? (
                  <img
                    src={ach.image}
                    alt={ach.title}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0 bg-slate-50"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                    </svg>
                  </div>
                )}
                
                <div className="space-y-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-sm font-black text-slate-900 leading-snug truncate">{ach.title}</h3>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-500 shrink-0">
                      {formatDateForDisplay(ach.date_earned)}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-violet-650 truncate">{ach.awarder}</p>
                  {ach.url && (
                    <a
                      href={ach.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-700 underline inline-flex items-center gap-1.5"
                    >
                      Credential Link
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 00-2 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {ach.description && (
                <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                  <p className="text-xs text-slate-650 leading-relaxed line-clamp-3">
                    {ach.description}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  {ach.is_featured ? 'Featured on Home' : 'Private'}
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditModal(ach)}
                    className="p-1.5 rounded-lg text-slate-450 hover:bg-violet-50 hover:text-violet-600 border border-slate-200 transition-all cursor-pointer shadow-xs"
                    title="Edit Achievement"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(ach.id)}
                    className="p-1.5 rounded-lg text-slate-450 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer shadow-xs"
                    title="Delete Achievement"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation / Editing Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="border border-slate-200 bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto"
          >
            <div>
              <h3 className="font-bold text-lg text-slate-900">{editingId ? 'Edit Achievement' : 'Add Achievement'}</h3>
              <p className="text-xs text-slate-500 mt-1">Add your certifications, academic degrees, or professional awards.</p>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Achievement / Certification Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>

              {/* Awarder & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Issued By / Awarder</label>
                  <input
                    type="text"
                    required
                    value={awarder}
                    onChange={(e) => setAwarder(e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Date Earned</label>
                  <input
                    type="date"
                    required
                    value={dateEarned}
                    onChange={(e) => setDateEarned(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  />
                </div>
              </div>

              {/* Verification URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Verification Link (Optional)</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://credly.com/your-badge"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe what this honor/certification demonstrates..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-y"
                />
              </div>

              {/* Image upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Credential Image (Optional)</label>
                <div className="flex items-center gap-4">
                  {imageUrl ? (
                    <div className="relative w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                      <img src={imageUrl} alt="Uploaded preview" className="w-full h-full object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => { setImageUrl(''); setImageId(''); }}
                        className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-0.5 cursor-pointer shadow-sm transition-transform active:scale-90"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-violet-500 cursor-pointer flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-50/10 transition-colors">
                      <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  )}
                  <div className="text-slate-500 text-[10px]">
                    {uploadingImage ? (
                      <span className="text-violet-650 font-bold animate-pulse">Uploading file to Cloudinary...</span>
                    ) : (
                      <span>Upload certification badge or photo. Max 4MB.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Is Featured Checkbox */}
              <div className="flex items-center gap-2.5">
                <input
                  id="isFeaturedCheckbox"
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-violet-500 w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="isFeaturedCheckbox" className="text-xs text-slate-700 font-bold select-none cursor-pointer">
                  Feature this on the Home Page
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:border-slate-800 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition-all cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading || uploadingImage}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-400 text-xs font-bold text-white rounded-xl shadow-md shadow-violet-600/10 transition-all cursor-pointer"
              >
                {submitLoading ? 'Saving...' : 'Save Achievement'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-slate-200 bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div>
              <h3 className="font-bold text-base text-slate-900">Delete Achievement</h3>
              <p className="text-xs text-slate-500 mt-1">Are you sure you want to permanently delete this achievement? This action cannot be undone.</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 border border-slate-200 hover:border-slate-800 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition-all cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleteLoading}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-450 text-xs font-bold text-white rounded-xl shadow-md shadow-rose-600/10 transition-all cursor-pointer"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
