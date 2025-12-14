import SignOut from '@/components/buttons/SignOut'
import { isLogin } from '@/middleware/isLogin'
import React from 'react'

const Profile =async () => {
  const auth= await isLogin()
  const user= auth.user

  
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center gap-4'>
      
      <h1 className='text-2xl'>Welcome, <span className='font-semibold'>{user.name}</span></h1>
      <SignOut/>
    </div>
  )
}

export default Profile
