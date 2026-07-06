"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-white 
        ${visible ? 'translate-y-0  backdrop-blur-md' : '-translate-y-full bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <Link href="/" className="text-2xl font-mono font-black text-indigo-600 transition-colors relative group py-2">
            Tanvir
          </Link>

        <nav className="flex items-center gap-8">
          
          <Link href="/projects" className="text-sm font-medium  transition-colors relative group py-2">
            Projects
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-violet-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/about" className="text-sm font-medium  transition-colors relative group py-2">
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-violet-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/contact" className="text-sm border px-4 rounded-2xl font-medium  transition-colors relative group py-2">
            Contact
          </Link>
        </nav>

      </div>

      
    </header>
  );
}