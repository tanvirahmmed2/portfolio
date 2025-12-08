import DetailBox from '@/components/card/DetailBox'
import Image from 'next/image'
import React from 'react'

const Home = () => {
  return (
    <div className='w-full flex flex-col md:flex-row items-center justify-center gap-10 py-12 p-4'>
      <div className='w-full lg:w-1/2 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl p-4'>
          <Image src='/formal.jpg'  alt='main image' width={1000} height={1000} className='w-[300px] h-[300px] rounded-full border-4 border-sky-500'/>
          <h1 className='text-4xl font-semibold'>Tanvir Ahmmed</h1>
          <p className='text-sky-500'>Web Developer & Tech Enthusiast</p>
        <DetailBox/>
      </div>

      <div className='w-full'>

      </div>
    </div>
  )
}

export default Home
