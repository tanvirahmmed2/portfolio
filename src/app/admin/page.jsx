import AddProject from '@/components/adminUI/AddProject'
import Messages from '@/components/adminUI/Messages'
import { BASE_URL } from '@/lib/secure'
import React from 'react'

const Admin = async () => {


  const res= await fetch(`${BASE_URL}/api/project`,{
    method: "GET",
    cache: 'no-store'
  })
  console.log(res)

  return (
    <div className='w-full flex flex-col items-center justify-center gap-10 p-4'>
      <div className='w-full md:w-3/4 lg:w-1/2 flex flex-col items-center justify-center gap-4'>
        <h1 className='text-2xl font-mono'>Add Latest Project</h1>
        <AddProject />
      </div>
      <Messages />
    </div>
  )
}

export default Admin
