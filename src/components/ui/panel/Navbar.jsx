"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/helper/ContextProvider.jsx';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const getRouteTitle = (path) => {
    if (path === '/panel') return 'Dashboard';
    if (path.startsWith('/panel/skills')) return 'Skills Management';
    if (path.startsWith('/panel/projects')) return 'Projects Portfolio';
    if (path.startsWith('/panel/blogs')) return 'Blog Posts';
    if (path.startsWith('/panel/events')) return 'Events Manager';
    if (path.startsWith('/panel/reviews')) return 'Reviews & Testimonials';
    if (path.startsWith('/panel/contacts')) return 'Inbox Messages';
    if (path.startsWith('/panel/profile')) return 'Profile Settings';
    return 'Admin Control Panel';
  };

  return (
    <header className="h-16 border-b backdrop-blur-md px-6 md:px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-white tracking-wider uppercase">
          {getRouteTitle(pathname)}
        </h2>
      </div>
      
      <div className="flex items-center gap-4">
        {user?.name && (
          <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1.5 rounded-full border">
            Welcome back, <strong className="text-violet-400 font-bold ml-1">{user.name}</strong>
          </span>
        )}
      </div>
    </header>
  );
}