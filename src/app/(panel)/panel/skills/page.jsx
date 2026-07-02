"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';

export default function PanelSkillsPage() {
  const { showToast } = useToast();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Category tabs / filter
  const [selectedTab, setSelectedTab] = useState('All');

  // Modal form states
  const [modalOpen, setModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [proficiency, setProficiency] = useState(80);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  
  // Cloudinary image upload states
  const [imageUrl, setImageUrl] = useState('');
  const [imageId, setImageId] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete confirmation modal states
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Other'];
  const tabOptions = ['All', ...categories];

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/skill');
      if (res.ok) {
        const data = await res.json();
        setSkills(data.skills || []);
      } else {
        showToast('Failed to fetch skills', 'error');
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
      showToast('Network error fetching skills', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Upload icon/logo to Cloudinary via /api/upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (e.g., 4MB)
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
        showToast('Icon uploaded successfully');
      } else {
        showToast(data.error || 'Failed to upload icon', 'error');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Network error uploading icon', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setName('');
    setCategory('Frontend');
    setProficiency(80);
    setDisplayOrder(0);
    setIsFeatured(false);
    setImageUrl('');
    setImageId('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (skill) => {
    setEditingId(skill.id);
    setName(skill.name);
    setCategory(skill.category);
    setProficiency(skill.proficiency);
    setDisplayOrder(skill.display_order);
    setIsFeatured(skill.is_featured);
    setImageUrl(skill.image || '');
    setImageId(skill.image_id || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Skill name is required', 'error');
      return;
    }

    try {
      setSubmitLoading(true);
      const url = editingId ? `/api/skill?id=${editingId}` : '/api/skill';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          category,
          proficiency: Number(proficiency),
          display_order: Number(displayOrder),
          is_featured: isFeatured,
          image: imageUrl,
          image_id: imageId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(editingId ? 'Skill updated successfully' : 'Skill added successfully');
        setModalOpen(false);
        fetchSkills();
      } else {
        showToast(data.error || 'Failed to save skill', 'error');
      }
    } catch (err) {
      console.error('Submit error:', err);
      showToast('Network error saving skill', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/skill?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Skill deleted successfully');
        setDeleteConfirmId(null);
        fetchSkills();
      } else {
        showToast(data.error || 'Failed to delete skill', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Network error deleting skill', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredSkills = selectedTab === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedTab);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Skills Library</h1>
          <p className="text-sm mt-1 text-slate-500">Manage core competencies, category listings, and proficiencies.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 hover:-translate-y-0.5 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Skill
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {tabOptions.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer
              ${selectedTab === tab
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-500 hover:text-slate-900 border border-transparent hover:bg-slate-200/50'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 border border-slate-200 bg-white rounded-2xl p-6 flex flex-col justify-between animate-pulse shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded-md w-2/3"></div>
                  <div className="h-3 bg-slate-200 rounded-md w-1/3 mt-2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-slate-200 rounded-full w-full"></div>
                <div className="h-3 bg-slate-200 rounded-md w-10 ml-auto mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-200 bg-white rounded-2xl text-slate-500 shadow-xs">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <p className="font-medium">No skills found in this category.</p>
          <button
            onClick={handleOpenCreateModal}
            className="mt-3 text-xs font-bold text-violet-600 hover:text-violet-750 transition-colors cursor-pointer"
          >
            Create one now &rarr;
          </button>
        </div>
      ) : (
        /* Skills Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="group border border-slate-200 bg-white hover:border-violet-500/30 rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 shadow-xs relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="flex items-start gap-4">
                  {/* Skill Icon */}
                  {skill.image ? (
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="w-12 h-12 rounded-xl object-contain border border-slate-200 p-1 bg-white"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold border border-slate-200 bg-slate-50 text-slate-600 uppercase">
                      {skill.name[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 group-hover:text-violet-600 transition-colors truncate">{skill.name}</h3>
                    <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-slate-200 bg-slate-50 text-slate-500 rounded-full mt-1.5">
                      {skill.category}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleOpenEditModal(skill)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Edit Skill"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(skill.id)}
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-colors cursor-pointer"
                    title="Delete Skill"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Progress Slider Display */}
              <div className="mt-6 relative z-10">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-600">Proficiency</span>
                  <span className="font-bold text-slate-800">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${skill.proficiency}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center text-[10px] mt-2 font-medium">
                  <span className="text-slate-400">Order: {skill.display_order}</span>
                  {skill.is_featured && (
                    <span className="flex items-center gap-1 text-amber-500 font-bold uppercase tracking-widest">
                      ★ Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-slate-200 bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black tracking-wider text-slate-850 uppercase">
                {editingId ? 'Edit Skill Profile' : 'Add New Skill'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg p-1 transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Skill Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Skill Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. React.js, PostgreSQL"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Display Order */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Proficiency Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Proficiency</label>
                  <span className="text-xs font-bold text-violet-600">{proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={proficiency}
                  onChange={(e) => setProficiency(Number(e.target.value))}
                  className="w-full accent-violet-500 h-2 border border-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3 border border-slate-200 bg-slate-50/50 p-3.5 rounded-xl">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4.5 h-4.5 accent-violet-600 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="featured" className="text-xs font-bold text-slate-700 uppercase tracking-wide cursor-pointer select-none">
                  Pin to Featured Skills
                </label>
              </div>

              {/* Icon Uploader */}
              <div className="flex flex-col gap-2 border border-slate-200 bg-slate-50/50 p-4 rounded-xl">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Skill Icon / Logo</label>
                
                <div className="flex items-center gap-4 mt-1">
                  {/* Preview Container */}
                  <div className="w-16 h-16 rounded-xl border border-slate-200 bg-white flex items-center justify-center relative overflow-hidden flex-shrink-0">
                    {uploadingImage ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
                      </div>
                    ) : imageUrl ? (
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-contain p-1.5" />
                    ) : (
                      <svg className="w-6 h-6 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="file"
                      id="icon-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="icon-upload"
                      className="inline-block px-4 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-950 cursor-pointer transition-all duration-200 shadow-xs text-xs font-bold"
                    >
                      Choose Icon Image
                    </label>
                    <p className="text-[10px] text-slate-400 mt-1.5">PNG, SVG or JPEG. Recommended size under 1MB.</p>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading || uploadingImage}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
                >
                  {submitLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  )}
                  {editingId ? 'Save Changes' : 'Create Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-slate-200 bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600 mb-4 border border-rose-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="font-bold text-lg text-slate-900 mb-2">Delete Skill</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Are you sure you want to delete this skill profile? This action will permanently remove it from the database and delete its icon assets from Cloudinary.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex-1 cursor-pointer"
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
