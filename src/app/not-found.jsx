import React from 'react'

const NotFound = () => {
  return (
    <div className='w-full flex flex-col sm:flex-row items-center justify-center gap-4 min-h-screen text-xl'>
      <h1 className='font-semibold text-black'>404</h1>
      <p className='text-gray-500'>Page not found</p>
    </div>
  )
}

export default NotFound
