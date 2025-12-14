'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'

const SignOut = () => {

  const router= useRouter()
  const signout = async () => {
    try {
      const response = await axios.get('/api/user/signout', { withCredentials: true })
      alert(response.data.message)
      router.push('/signin')
    } catch (error) {
      console.log(error)
      alert(error?.response?.data?.message)
    }

  }
  return (
    <button className='bg-black text-white p-1 px-6 rounded-2xl opacity-70 hover:opacity-100 cursor-pointer' onClick={signout}>Sign Out</button>
  )
}

export default SignOut
