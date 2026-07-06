import Footer from '@/components/ui/bars/Footer';
import Navbar from '@/components/ui/bars/Navbar';
import Template from '@/components/Template';
import React from 'react';

export const metadata = {
  title: 'Home | Tanvir Ahmmed',
  description: 'Explore the full-stack portfolio of Tanvir Ahmmed, a software engineer building web applications and IoT systems.',
};

export default function HomeLayout({ children }) {
  return (
    <Template>
      <div className='w-full'>
        <Navbar />
        {children}
        <Footer />
      </div>
    </Template>
  );
}
