import Project from '@/components/card/Project'
import { BASE_URL } from '@/lib/secure'
import React from 'react'

const Projects = async () => {

  const res = await fetch(`${BASE_URL}/api/project`, {
    method: 'GET',
    cache: 'no-store'
  })
  const data = await res.json()
  const projects = data.payload
  return (
    <div className='w-full flex flex-col items-center gap-6 p-4'>
      {
        projects === null || projects.length < 1 ? <p>No Project Found</p> : <div className='w-full flex-col flex items-center justify-center gap-6'>
          <h1 className='text-2xl font-semibold text-center'>My Latest Projects</h1>
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
            {
              projects.map((project) => (
                <Project key={project._id} {...project} />
              ))
            }
          </div>
        </div>
      }


    </div>
  )
}

export default Projects
