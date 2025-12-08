'use client'
import React from 'react'
import { motion } from 'framer-motion';


const Contact = () => {
  return (
    <div className='w-full h-auto px-4 py-20 flex flex-col items-center justify-center text-center gap-2  '>
      <h1 className='text-4xl font-bold py-4 text-indigo-500'>Get in touch</h1>
      <div className='w-full h-auto flex flex-col lg:flex-row gap-8 lg:px-12 items-center justify-center'>
        
        <motion.div initial={{x:50, opacity:0}} whileInView={{x:0, opacity:1}} transition={{duration:0.6}} className={`w-full md:w-3/4 lg:w-1/2 h-[500px] shadow-sm shadow-indigo-200 bg-white flex flex-col items-center justify-center  bg-opacity-40 rounded-xl p-4`}>

          <h1 className='text-3xl font-semibold mt-4'>Message:</h1>
          <form className='flex flex-col gap-4 w-full lg:px-12 h-auto items-center justify-center  '>
            <div className='flex flex-col w-full items-start gap-2'>
              <label className='text-xs' htmlFor="name">Name</label>
              <input className='border-2 text-black border-indigo-200 px-4 py-2 rounded-lg w-full outline-none' type="text" id='name' name='name' placeholder='full name' required />
            </div>
            <div className='flex flex-col w-full items-start gap-2'>
              <label className='text-xs' htmlFor="mail">Email</label>
              <input   className='border-2 text-black border-indigo-200 px-4 py-2 rounded-lg w-full outline-none' type='email' id='mail' name='mail' placeholder='email' required />
            </div>
            <div className='flex flex-col w-full items-start gap-2'>
              <label className='text-xs' htmlFor="report">Text</label>
              <textarea  className='border-2 text-black resize-none border-indigo-200 px-4 py-2 rounded-lg w-full outline-none' placeholder='enter your text' rows={4} type="text" id='report' name='report' required />
            </div>
            <button type='submit' className='px-4 rounded-xl bg-indigo-500 text-white cursor-pointer hover:scale-110 transition duration-300'>Send</button>
          </form>
        </motion.div>

      </div>
      
     



    </div>
  )
}

export default Contact
