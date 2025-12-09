'use client'
import React, { useState } from 'react'
import axios from 'axios';


const Contact = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    try {
      const response= await axios.post('/api/message', formData, {withCredentials: true})
      alert(response.data.message)
    } catch (error) {
      alert(error?.response?.data?.message)
      console.log(error)
      
    }

  }
  return (
    <div className='w-full h-auto px-4 py-20 flex flex-col items-center justify-center text-center gap-2  '>
      <h1 className='text-4xl font-bold py-4 text-sky-500'>Get in touch</h1>
      <div className='w-full h-auto flex flex-col lg:flex-row gap-8 lg:px-12 items-center justify-center'>

        <div className={`w-full md:w-3/4 lg:w-1/2 h-[500px] shadow-sm shadow-sky-200 bg-white flex flex-col items-center justify-center  bg-opacity-40 rounded-xl p-4`}>

          <h1 className='text-3xl font-semibold mt-4'>Message:</h1>
          <form onSubmit={sendMessage} className='flex flex-col gap-4 w-full lg:px-12 h-auto items-center justify-center  '>
            <div className='flex flex-col w-full items-start gap-2'>
              <label className='text-xs' htmlFor="name">Name</label>
              <input value={formData.name} onChange={handleChange} className='border-2 text-black border-sky-200 px-4 py-2 rounded-lg w-full outline-none' type="text" id='name' name='name' placeholder='full name' required />
            </div>
            <div className='flex flex-col w-full items-start gap-2'>
              <label className='text-xs' htmlFor="email">Email</label>
              <input value={formData.email} onChange={handleChange} className='border-2 text-black border-sky-200 px-4 py-2 rounded-lg w-full outline-none' type='email' id='email' name='email' placeholder='email' required />
            </div>
            <div className='flex flex-col w-full items-start gap-2'>
              <label className='text-xs' htmlFor="message">Message</label>
              <textarea value={formData.message} onChange={handleChange} className='border-2 text-black resize-none border-sky-200 px-4 py-2 rounded-lg w-full outline-none' placeholder='enter your text' rows={4} type="text" id='message' name='message' required />
            </div>
            <button type='submit' className='px-4 rounded-xl bg-sky-500 text-white cursor-pointer hover:scale-110 transition duration-300'>Send</button>
          </form>
        </div>

      </div>





    </div>
  )
}

export default Contact
