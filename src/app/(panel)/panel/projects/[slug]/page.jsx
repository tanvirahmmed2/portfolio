"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/ui/forms/ProjectForm.jsx';
import { useToast } from '@/components/helper/ToastProvider.jsx';

export default function PanelEditProjectPage({ params }) {
  const { slug } = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const res = await fetch(`/api/project?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.project) {
            setProject(data.project);
          } else {
            showToast('Project not found', 'error');
            router.push('/panel/projects');
          }
        } else {
          showToast('Failed to retrieve project settings', 'error');
          router.push('/panel/projects');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        showToast('Network error fetching project details', 'error');
        router.push('/panel/projects');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProject();
    }
  }, [slug, router, showToast]);

  const handleCancel = () => {
    router.push('/panel/projects');
  };

  const handleSuccess = () => {
    router.push('/panel/projects');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border-4 border-violet-500/15 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-violet-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ProjectForm
        project={project}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
