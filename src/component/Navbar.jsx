import React from 'react'

const Navbar = () => {
  return (
    <section className='w-full fixed top-0 bg-gradient-to-br from-blue-500 to-purple-400 text-white'>
        <nav className='w-full flex flex-row items-center justify-around px-4 h-20'>
            <a href='/'>
                <h1 className='text-3xl font-semibold'>Tanvir Ahmmed</h1>
                <p className='text-sm'>Full Stack Web Developer</p>
            </a>
            <div>

            </div>

        </nav>
    </section>
  )
}

export default Navbar
