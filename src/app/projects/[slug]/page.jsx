import { BASE_URL } from '@/lib/secure'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const Project = async({params}) => {
  const tempSlug= await params
  const slug= tempSlug.slug

  const res= await fetch(`${BASE_URL}/api/project/${slug}`, {
    method: "GET",
    cache: 'no-store',
     credentials: 'include'
  })
  const data= await res.json()
  const project= data.payload
  if(!data || data.length <1){
    return redirect('/projects')
  }

  const {title, description, image, skills, tags, category, repository, siteLink,}= project
  
  return (
    <div className='w-full md:w-3/4 lg:w-1/2 mx-auto flex flex-col items-center justify-center gap-8 p-4 bg-white py-6'>
      <h1 className='text-2xl font-semibold text-center'>{project.title}</h1>
      <Image src={image} alt={title} width={1000} height={1000} className='w-full rounded-2xl shadow-sm'/>
      <p>Category: {category}</p>
      <p className='w-full text-justify'><span className='italic opacity-25'> Description:   </span>{description}</p>
      <div className='w-full flex flex-wrap gap-2'>
        {
          skills.map((skill)=> (
            <p key={skill} className='px-2 bg-black/20 rounded-2xl text-white '>{skill}</p>
          ))
        }
      </div>

      <div className='w-full flex flex-wrap gap-2'>
        {
          tags.map((tag)=> (
            <p key={tag} className='px-2 bg-black/20 rounded-2xl text-white '>{tag}</p>
          ))
        }
      </div>
      <div className='w-full flex flex-row items-center justify-between gap-4'>
        <Link className='w-full bg-sky-500 text-white text-center rounded-2xl' href={repository}>Github</Link>
        <Link className='w-full bg-sky-500 text-white text-center rounded-2xl' href={siteLink}>Live Preview</Link>
      </div>

    </div>
  )
}

export default Project
