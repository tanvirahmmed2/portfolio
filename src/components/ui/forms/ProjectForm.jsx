"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';
import Editor from '@/components/ui/forms/Editor.jsx';

export default function ProjectForm({ project, onCancel, onSuccess }) {
  const { showToast } = useToast();
  
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState(project ? project.title : '');
  const [slug, setSlug] = useState(project ? project.slug : '');
  const [summary, setSummary] = useState(project ? project.summary : '');
  const [description, setDescription] = useState(project ? project.description : '');
  const [demoUrl, setDemoUrl] = useState(project ? project.url : '');
  const [githubUrl, setGithubUrl] = useState(project ? project.github_url : '');
  
  const [isFeatured, setIsFeatured] = useState(project ? project.is_featured : false);
  const [isPublished, setIsPublished] = useState(project ? project.is_published : true);
  const [imageUrl, setImageUrl] = useState(project ? project.image : '');
  const [imageId, setImageId] = useState(project ? project.image_id : '');
  
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Avoid hydration issues
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

    // If editing, fetch currently mapped project skills
    if (project) {
      async function fetchProjectSkills() {
        try {
          const res = await fetch(`/api/project?id=${project.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.skills) {
              setSelectedSkills(data.skills.map((s) => s.id));
            }
          }
        } catch (err) {
          console.error('Error fetching project skills:', err);
        }
      }
      fetchProjectSkills();
    }
  }, [project]);

  const generateSlug = (val) => {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!project) {
      setSlug(generateSlug(val));
    }
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
        showToast('Project image uploaded successfully');
      } else {
        showToast(data.error || 'Failed to upload project thumbnail', 'error');
      }
    } catch (err) {
      console.error('Upload image error:', err);
      showToast('Network error uploading thumbnail', 'error');
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
    if (!title.trim() || !slug.trim()) {
      showToast('Title and Slug are required fields', 'error');
      return;
    }

    if (!summary.trim()) {
      showToast('Short project summary is required', 'error');
      return;
    }

    if (!description || description === '<p></p>') {
      showToast('Detailed project description is required', 'error');
      return;
    }

    try {
      setSubmitLoading(true);
      const url = project ? `/api/project?id=${project.id}` : '/api/project';
      const method = project ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          summary: summary.trim(),
          description,
          image: imageUrl || null,
          image_id: imageId || null,
          url: demoUrl.trim() || null,
          github_url: githubUrl.trim() || null,
          is_featured: isFeatured,
          is_published: isPublished,
          skill_ids: selectedSkills,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(project ? 'Project updated successfully' : 'Project created successfully');
        onSuccess();
      } else {
        showToast(data.error || 'Failed to save project settings', 'error');
      }
    } catch (err) {
      console.error('Submit error:', err);
      showToast('Network error saving project', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl p-4 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-xs">
      
      {/* Title & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Antigravity Coding IDE"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">URL Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            placeholder="e.g. antigravity-coding-ide"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Demo & GitHub URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Live Demo Link</label>
          <input
            type="url"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="e.g. https://your-demo-app.com"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">GitHub Repository Link</label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="e.g. https://github.com/user/repository"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Short Project Summary</label>
          <span className="text-[10px] font-medium text-slate-400">{summary.length}/500 chars</span>
        </div>
        <textarea
          rows={3}
          maxLength={500}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Briefly describe what this project does and the technology stack utilized..."
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 resize-none"
        />
      </div>

      {/* Description Content Editor */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Detailed Description</label>
        <Editor content={description} onChange={setDescription} />
      </div>

      {/* Thumbnail Cover Uploader */}
      <div className="flex flex-col gap-2 border border-slate-200 bg-slate-50/50 p-4 rounded-xl">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Project Showcase Image</label>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-1">
          {/* Cover Preview */}
          <div className="w-40 h-24 rounded-xl border border-slate-200 bg-white flex items-center justify-center relative overflow-hidden flex-shrink-0">
            {uploadingImage ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
              </div>
            ) : imageUrl ? (
              <img src={imageUrl} alt="Project Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-slate-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px] uppercase font-bold tracking-wide">No Image</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <input
              type="file"
              id="cover-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="cover-upload"
              className="inline-block px-4 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-950 cursor-pointer transition-all duration-200 shadow-xs text-xs font-bold"
            >
              Choose Showcase Image
            </label>
            <p className="text-[10px] text-slate-400">Supported formats: JPEG, PNG, WEBP. Recommend sizes under 2MB.</p>
          </div>
        </div>
      </div>

      {/* Featured & Published Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 border border-slate-200 bg-slate-50/50 p-3.5 rounded-xl">
          <input
            type="checkbox"
            id="isFeatured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4.5 h-4.5 accent-violet-600 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <label htmlFor="isFeatured" className="text-xs font-bold text-slate-700 uppercase tracking-wide cursor-pointer select-none">
            Featured Project (Prominently shown first)
          </label>
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
            Publish Project (Visible on public portfolio)
          </label>
        </div>
      </div>

      {/* Associated Skills (At the bottom) */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Associated Skills (Click to toggle)</label>
        {skills.length === 0 ? (
          <p className="text-xs italic text-slate-400">No skills configured to associate.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[160px] overflow-y-auto p-3 border border-slate-200 bg-slate-50/30 rounded-xl">
            {skills.map((skill) => {
              const isSelected = selectedSkills.includes(skill.id);
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => handleSkillToggle(skill.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold transition-all duration-150 cursor-pointer
                    ${isSelected
                      ? 'bg-violet-50 text-violet-600 border-violet-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
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

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-colors"
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
          {project ? 'Save Changes' : 'Create Project'}
        </button>
      </div>

    </form>
  );
}
