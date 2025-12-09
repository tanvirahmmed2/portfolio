import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <section className='w-full fixed top-0 z-40'>
        <nav className='w-full  flex flex-row items-center justify-around px-4 h-20 bg-sky-500 text-white'>
            <Link href={'/'}>
                <h1 className='text-xl sm:text-2xl font-semibold'>Tanvir Ahmmed</h1>
                <p className=' text-[10px] sm:text-[12px]'>Web Developer & Tech Enthusiast</p>
            </Link>
            <div className='w-auto flex flex-row items-center justify-center gap-4 h-20 px-5'>
                <Link href={'/projects'} className='px-4 w-auto h-20 flex items-center justify-center hover:border-b-2 border-white hover:scale-105 transition ease-in-out duration-300 '>Projects</Link>
                <Link href={'/contact'} className='px-4 w-auto h-20 hidden sm:flex items-center justify-center hover:border-b-2 border-white hover:scale-105 transition ease-in-out duration-300 '>Contact</Link>
                <Link href={'/skills'} className='px-4 w-auto h-20 hidden sm:flex items-center justify-center hover:border-b-2 border-white hover:scale-105 transition ease-in-out duration-300 '>Skills</Link>
            </div>

        </nav>

    </section>
  )
}

export default Navbar
