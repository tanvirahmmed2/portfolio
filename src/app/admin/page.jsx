import AddProject from '@/components/adminUI/AddProject'
import Messages from '@/components/adminUI/Messages'
import DeleteProject from '@/components/buttons/DeleteProject'
import { BASE_URL } from '@/lib/secure'
import Link from 'next/link'
import React from 'react'
import { MdDeleteOutline } from "react-icons/md";

const Admin = async () => {


  const res = await fetch(`${BASE_URL}/api/project`, {
    method: "GET",
    cache: 'no-store'
  })
  const data = await res.json()
  const projects = data.payload

  


  return (
    <div className='w-full flex flex-col items-center justify-center gap-10 p-4'>
      <div className='w-full md:w-3/4 lg:w-1/2 flex flex-col items-center justify-center gap-4'>
        <h1 className='text-2xl font-mono'>Add Latest Project</h1>
        <AddProject />
        {
          projects === null && <div>
            <h1>Latest projects</h1>
            <div>
              {
                projects.map((project) => (
                  <div key={project._id}>
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                    <DeleteProject id={project._id} />
                  </div>
                ))
              }
            </div>
          </div>
        }
      </div>
      <Messages />
    </div>
  )
}

export default Admin
