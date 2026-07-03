"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';
import Editor from '@/components/ui/forms/Editor.jsx';

export default function BlogForm({ blog, onCancel, onSuccess }) {
  const { showToast } = useToast();
  
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState(blog ? blog.title : '');
  const [description, setDescription] = useState(blog ? blog.description : '');
  const [isPublished, setIsPublished] = useState(blog ? blog.is_published : false);
  const [imageUrl, setImageUrl] = useState(blog ? blog.image : '');
  const [imageId, setImageId] = useState(blog ? blog.image_id : '');
  
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch('/api/skill');
        if (res.ok) {
          const data = await res.json();
          setSkills(data.skills || []);
        }
      } catch (err) {
        console.error('Error fetching skills:', err);
      }
    }
    
    fetchSkills();

    
    if (blog) {
      async function fetchBlogSkills() {
        try {
          const res = await fetch(`/api/blog?id=${blog.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.skills) {
              setSelectedSkills(data.skills.map((s) => s.id));
            }
          }
        } catch (err) {
          console.error('Error fetching blog skill mapping:', err);
        }
      }
      fetchBlogSkills();
    }
  }, [blog]);

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
      console.error('Error uploading image:', err);
      showToast('Network error uploading cover photo', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSkillToggle = (id) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Title is a required field', 'error');
      return;
    }

    if (!description || description === '<p></p>') {
      showToast('Post content is required', 'error');
      return;
    }

    try {
      setSubmitLoading(true);
      const url = blog ? `/api/blog?id=${blog.id}` : '/api/blog';
      const method = blog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description,
          image: imageUrl || null,
          image_id: imageId || null,
          is_published: isPublished,
          skill_ids: selectedSkills,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(blog ? 'Blog post updated successfully' : 'Blog post created successfully');
        onSuccess();
      } else {
        showToast(data.error || 'Failed to save blog post', 'error');
      }
    } catch (err) {
      console.error('Submit error:', err);
      showToast('Network error saving post', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl mx-auto p-2 sm:p-6 border border-slate-200 bg-white rounded-3xl shadow-xs">
      
      
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-755 uppercase tracking-wide">Post Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Building micro-frontends with React"
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
        />
      </div>

      
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-750 uppercase tracking-wide">Post Content</label>
        <Editor content={description} onChange={setDescription} />
      </div>

      
      <div className="flex flex-col gap-2 border border-slate-200 bg-slate-50/50 p-4 rounded-xl">
        <label className="text-xs font-bold text-slate-750 uppercase tracking-wide">Cover Thumbnail</label>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-1">
          
          <div className="w-40 h-24 rounded-xl border border-slate-200 bg-white flex items-center justify-center relative overflow-hidden flex-shrink-0 text-slate-400">
            {uploadingImage ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="w-5 h-5 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
              </div>
            ) : imageUrl ? (
              <img src={imageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <svg className="w-6 h-6 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wide">No Image</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2 text-slate-400">
            <input
              type="file"
              id="cover-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="cover-upload"
              className="inline-block px-4 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-950 cursor-pointer transition-all duration-200 shadow-xs"
            >
              Choose Cover Image
            </label>
            <p className="text-[10px] text-slate-400">Supported formats: JPEG, PNG, WEBP. Recommend sizes under 2MB.</p>
          </div>
        </div>
      </div>

      
      <div className="flex items-center gap-3 border border-slate-200 bg-slate-50/50 p-3.5 rounded-xl">
        <input
          type="checkbox"
          id="isPublished"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="w-4.5 h-4.5 accent-violet-600 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer"
        />
        <label htmlFor="isPublished" className="text-xs font-bold text-slate-700 uppercase tracking-wide cursor-pointer select-none">
          Publish Post (Visible on public portfolio)
        </label>
      </div>

      
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-slate-750 uppercase tracking-wide">Associated Skills (Click to toggle)</label>
        {skills.length === 0 ? (
          <p className="text-xs italic text-slate-450">No skills configured to associate.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[160px] overflow-y-auto p-3 border border-slate-200 bg-white rounded-xl">
            {skills.map((skill) => {
              const isSelected = selectedSkills.includes(skill.id);
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => handleSkillToggle(skill.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold transition-all duration-150 cursor-pointer
                    ${isSelected
                      ? 'bg-violet-50 text-violet-650 border-violet-200'
                      : 'bg-transparent text-slate-650 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="w-3 h-3 accent-violet-600 pointer-events-none"
                  />
                  <span className="truncate">{skill.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitLoading || uploadingImage}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 cursor-pointer"
        >
          {submitLoading && (
            <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          )}
          {blog ? 'Save Changes' : 'Create Post'}
        </button>
      </div>

    </form>
  );
}
