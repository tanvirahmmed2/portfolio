import AddProject from '@/components/adminUI/AddProject'
import Messages from '@/components/adminUI/Messages'
import React from 'react'

const Admin = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center gap-10 p-4'>
      <div className='w-full md:w-3/4 lg:w-1/2 flex flex-col items-center justify-center gap-4'>
        <h1>Add Latest Project</h1>
        <AddProject />
      </div>
      <Messages />
    </div>
  )
}

export default Admin
