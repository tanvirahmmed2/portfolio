import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Project = ({title, slug, description, skills, category, image}) => {
  return (
    <Link href={`/projects/${slug}`} className='w-full p-2 bg-white rounded-xl shadow-sm  flex flex-col gap-2 relative'>
      <Image src={image} alt={title} width={1000} height={1000} className='w-full  rounded-2xl shadow-sm hover:scale-105 transition ease-in-out duration-500 h-[300px] object-cover'/>
      <h1 className='text-xl font-semibold'>{title}</h1>
      <p className='top-4 right-4 absolute px-4 bg-sky-500 text-white rounded-2xl'>{category}</p>
      <p>{description.slice(0,100)}....</p>
      <div className='w-full flex flex-wrap gap-2 opacity-20'>
        {
          skills.map((skill)=> (
            <p key={skill} className='px-2 bg-sky-500 rounded-2xl text-white '>{skill}</p>
          ))
        }
      </div>
    </Link>
  )
}

export default Project
