import Footer from '@/components/ui/bars/Footer';
import Navbar from '@/components/ui/bars/Navbar';
import React from 'react';

export default function HomeLayout({ children }) {
  return <div>
    <Navbar />
    {children}
    <Footer />
  </div>;
}
