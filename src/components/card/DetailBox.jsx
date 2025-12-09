'use client'
import Link from 'next/link';
import React from 'react'
import { IoCallOutline, IoMailOutline } from "react-icons/io5";

const DetailBox = () => {
  return (
    <div className='w-auto mx-auto flex flex-col gap-2'>
      <p className='w-full flex flex-row items-center  gap-2'><IoMailOutline/> tanvir004006@gmail.com</p>
      <p className='w-full flex flex-row items-center  gap-2'><IoCallOutline/> +8801987131369</p>
      <Link href={'https://github.com/tanvirahmmed2'} className='w-full flex flex-row items-center justify-center shadow-sm bg-sky-500  text-white rounded-lg p-1 gap-2'>GitHub</Link>
      <Link href={'https://www.linkedin.com/in/tanvirahmmed4/'} className='w-full flex flex-row items-center justify-center shadow-sm bg-sky-500  text-white rounded-lg p-1 gap-2'>LinkedIn</Link>
    </div>
  )
}

export default DetailBox
