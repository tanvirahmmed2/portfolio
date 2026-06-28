"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setVisible(false);
        setMobileMenuOpen(false); 
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-neutral-900/40
        ${visible ? 'translate-y-0 bg-neutral-950/80 backdrop-blur-md' : '-translate-y-full bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <Link href="/" className="text-xl font-black tracking-tight text-white hover:text-violet-400 transition-colors">
          Tanvir Ahmmed
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/about" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative group py-2">
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/projects" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative group py-2">
            Projects
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/contact" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative group py-2">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-neutral-400 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950/95 border-b border-neutral-900 backdrop-blur-xl px-6 py-4 flex flex-col gap-4">
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-2 transition-colors border-b border-neutral-900/60"
          >
            About
          </Link>
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-2 transition-colors border-b border-neutral-900/60"
          >
            Projects
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-2 transition-colors"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}