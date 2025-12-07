import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <section className='w-full fixed top-0 bg-gradient-to-br from-blue-500 to-purple-400 text-white'>
        <nav className='w-full flex flex-row items-center justify-around px-4 h-20'>
            <a href='/'>
                <h1 className='text-3xl font-semibold'>Tanvir Ahmmed</h1>
                <p className='text-sm'>Full Stack Web Developer</p>
            </a>
            <div className='w-auto flex flex-row items-center justify-center h-20 gap-4'>
              <Link className='text-lg px-4 opacity-70 hover:opacity-100 font-semibold' to='/about'>About</Link>  
              <Link className='text-lg px-4 opacity-70 hover:opacity-100 font-semibold' to='/projects'>Projects</Link>  
              <Link className='text-lg px-4 opacity-70 hover:opacity-100 font-semibold' to='/skills'>Skill</Link>  

            </div>

        </nav>
    </section>
  )
}

export default Navbar
