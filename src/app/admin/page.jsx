import AddProject from '@/components/adminUI/AddProject'
import DeleteMessage from '@/components/buttons/DeleteMessage'
import DeleteProject from '@/components/buttons/DeleteProject'
import UpdateProjectButton from '@/components/buttons/UpdateProjectButton'
import { BASE_URL } from '@/lib/secure'
import Link from 'next/link'
import React from 'react'

const Admin = async () => {

  const messageres = await fetch(`${BASE_URL}/api/message`, {
    method: 'GET',
    cache: 'no-store'
  })

  const mdata = await messageres.json()
  const messages = mdata.payload



  const res = await fetch(`${BASE_URL}/api/project`, {
    method: 'GET',
    cache: 'no-store'
  })
  const data = await res.json()
  const projects = data.payload



  return (
    <div className='w-full flex flex-col items-center justify-center gap-10 p-4'>
      <div className='w-full md:w-3/4 lg:w-1/2 flex flex-col items-center justify-center gap-6'>
        <h1 className='text-2xl font-mono'>Add Latest Project</h1>
        <AddProject />
        {
          projects !== null || projects.length > 0 && <div className='w-full flex flex-col items-center justify-center gap-4'>
            <h1 className='text-2xl font-semibold text-center'>Latest projects</h1>
            <div className='w-full flex flex-col items-center justify-center gap-2'>
              {
                projects.map((project) => (
                  <div key={project._id} className='w-full flex flex-row items-center justify-between p-2 bg-white rounded-2xl'>
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>

                    <div className='flex flex-row items-center justify-center gap-12'>
                      <Link href={`/admin/${project.slug}`}><UpdateProjectButton /></Link>
                      <DeleteProject id={project._id} />
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        }
      </div>


      {
        messages !== null || messages.length > 0 && <div className='w-full md:w-3/4 lg:w-1/2 flex flex-col items-center justify-center gap-6'>
          <h1 className='text-2xl font-semibold text-center'>Latest Messages</h1>
          <div className='w-full flex flex-col items-center justify-center gap-2'>
            {
              messages.map((message) => (
                <div key={message._id} className='w-full grid grid-cols-2 bg-white p-2 rounded-2xl'>
                  <div className='w-auto flex flex-col'>
                    <h1>{message.name}</h1>
                    <p className='text-sm italic'>{message.email}</p>

                  </div>
                  <div className='w-full flex flex-row items-center justify-between gap-2'>
                    <p className='w-full'>{message.message}</p>
                    <DeleteMessage id={message._id} />
                  </div>

                </div>
              ))
            }
          </div>
        </div>
      }
    </div>
  )
}

export default Admin
