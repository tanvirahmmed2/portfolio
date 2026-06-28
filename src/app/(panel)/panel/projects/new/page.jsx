"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/ui/forms/ProjectForm.jsx';

export default function PanelNewProjectPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/panel/projects');
  };

  const handleSuccess = () => {
    router.push('/panel/projects');
  };

  return (
    <div className="space-y-6">
      <ProjectForm
        project={null}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
