import Link from 'next/link'
import React from 'react'

import { FaFacebookSquare, FaGithubSquare, FaInstagramSquare, FaLinkedinIn, } from "react-icons/fa";
import { IoCallOutline, IoMailOutline } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className='w-full flex flex-col md:flex-row items-center justify-end md:items-end md:justify-around gap-6 p-4 bg-gray-50'>
      <div className=' flex flex-col gap-2 p-6'>
        <Link href={'/'}>Home</Link>
        <Link href={'/projects'}>Projects</Link>
        <Link href={'/skills'}>Skills</Link>
        <Link href={'/contact'}>Contact</Link>
        <Link href={'/admin'}>Admin</Link>
      </div>
      <div className=' flex flex-col gap-2 p-6'>
        <div className='w-full flex flex-row gap-2 items-center justify-between text-2xl'>
          <Link href={'https://www.linkedin.com/in/tanvirahmmed4/'}><FaLinkedinIn /></Link>
          <Link href={'https://github.com/tanvirahmmed2'}><FaGithubSquare /></Link>
          <Link href={'https://www.facebook.com/tanvirahmmed.official'}><FaFacebookSquare /></Link>
          <Link href={'https://www.instagram.com/tanvirahmmed.4/'}><FaInstagramSquare /></Link>

        </div>
        <div className='w-full flex flex-col gap-2'>
          <p className='w-full flex flex-row gap-2 items-center'><IoCallOutline/> +8801987131369</p>
          <Link href={'mailto:tanvir004006@gmail.com'} className='w-full flex flex-row gap-2 items-center'><IoMailOutline/> tanvir004006@gmail.com</Link>
        </div>
        <p className='text-center'>All rights are reserved by <Link href={'/'} className='font-semibold'>Tanvir Ahmmed</Link></p>
      </div>
    </footer>
  )
}

export default Footer
