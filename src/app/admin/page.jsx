import AddProject from '@/components/adminUI/AddProject'
import Messages from '@/components/adminUI/Messages'
import React from 'react'

const Admin = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center gap-10'>
      <AddProject/>
      <Messages/>
    </div>
  )
}

export default Admin
