import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='w-full flex flex-col items-center justify-center gap-6 p-4 bg-gray-100'>
      <div>
        <Link href={'/'}>Home</Link>
        <Link href={'/projects'}>Projects</Link>
        <Link href={'/skills'}>Skills</Link>
        <Link href={'/signin'}>Signin</Link>
        <Link href={'/admin'}>Admin</Link>
      </div>
      <div>

      </div>
      <p>Alrights are reserved by <Link href={'/'} className='font-semibold'>Tanvir Ahmmed</Link></p>
    </footer>
  )
}

export default Footer
