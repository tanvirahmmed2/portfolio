import Link from 'next/link'
import React from 'react'

import { FaFacebookSquare, FaGithubSquare, FaInstagramSquare, FaLinkedinIn, FaTelegramPlane } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='w-full flex flex-col md:flex-row items-center justify-end md:items-end md:justify-around gap-6 p-4 bg-gray-100'>
      <div className=' flex flex-col gap-4 p-6'>
        <Link href={'/'}>Home</Link>
        <Link href={'/projects'}>Projects</Link>
        <Link href={'/skills'}>Skills</Link>
        <Link href={'/signin'}>Sign In</Link>
        <Link href={'/admin'}>Admin</Link>
      </div>
      <div className=' flex flex-col gap-6 p-6'>
        <div className='w-full flex flex-row gap-4 items-center justify-between text-2xl'>
          <Link href={'https://www.linkedin.com/in/tanvirahmmed4/'}><FaLinkedinIn /></Link>
          <Link href={'https://github.com/tanvirahmmed2'}><FaGithubSquare /></Link>
          <Link href={'https://www.facebook.com/tanvirahmmed.official'}><FaFacebookSquare /></Link>
          <Link href={'https://www.instagram.com/tanvirahmmed.4/'}><FaInstagramSquare /></Link>

        </div>
        <p>Alrights are reserved by <Link href={'/'} className='font-semibold'>Tanvir Ahmmed</Link></p>
      </div>
    </footer>
  )
}

export default Footer
