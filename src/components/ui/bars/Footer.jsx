"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [settings, setSettings] = useState({
    name: '',
    title: '',
    socials: {
      github: '',
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    }
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings(data.settings);
          }
        }
      } catch (err) {
        console.error('Error fetching settings for footer:', err);
      }
    }
    fetchSettings();
  }, []);

  const socialsList = [
    {
      name: 'GitHub',
      url: settings.socials?.github,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: settings.socials?.linkedin,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      )
    },
    {
      name: 'Twitter',
      url: settings.socials?.twitter,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: settings.socials?.facebook,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: settings.socials?.instagram,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )
    }
  ];

  const activeSocials = socialsList.filter(social => social.url);

  return (
    <footer className="w-full bg-indigo-500 px-4 md:px-10 py-28 text-white">
     
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12">
        
        <div className="flex flex-col">
          <Link href="/" className="text-2xl font-black text-white hover:text-violet-400 transition-colors duration-300 tracking-tight">
            {settings.name}
          </Link>
          <p className="text-sm font-medium mt-2">
            {settings.title}
          </p>
          <p className="text-xs mt-8">
            &copy; {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col">
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-4">
            Navigation
          </h3>
          <nav className="flex flex-col gap-3">
            <Link href="/" className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 block w-fit">
              Home
            </Link>
            <Link href="/works" className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 block w-fit">
              Work Life
            </Link>
            <Link href="/about" className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 block w-fit">
              About
            </Link>
            <Link href="/projects" className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 block w-fit">
              Projects
            </Link>
            <Link href="/blogs" className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 block w-fit">
              Blogs
            </Link>
            <Link href="/skills" className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 block w-fit">
              Skills
            </Link>
            <Link href="/contact" className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 block w-fit">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex flex-col">
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-4">
            Connect
          </h3>
          {activeSocials.length > 0 ? (
            <div className="flex flex-col gap-3">
              {activeSocials.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 w-fit"
                >
                  <span className="group-hover:text-violet-400 transition-colors duration-200">
                    {social.icon}
                  </span>
                  <span>{social.name}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm italic">No social links configured.</p>
          )}
        </div>

      </div>
    </footer>
  );
}