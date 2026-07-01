"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/helper/ContextProvider.jsx';
import Navbar from '@/components/ui/panel/Navbar';
import Sidebar from '@/components/ui/panel/Sidebar';

export default function PanelLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-violet-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-violet-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Don't render content; redirect is handled in useEffect
  }

  return (
    <>
      <head>
        <title>Dashboard | Tanvir Ahmmed</title>
        <meta name="description" content="Admin dashboard to manage portfolio settings, skills, projects, comments, work history, events, and reviews." />
      </head>
      <div className="min-h-screen flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          <Navbar />
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}