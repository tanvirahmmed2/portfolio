import UpdateProject from '@/components/adminUI/UpdateProject'
import { BASE_URL } from '@/lib/secure'
import { redirect } from 'next/navigation'
import React from 'react'

const Slug = async ({ params }) => {
    const tempSlug = await params
    const slug = tempSlug.slug

    const res = await fetch(`${BASE_URL}/api/project/${slug}`, {
        method: "GET",
        cache: 'no-store',
        credentials: 'include'
    })
    const data = await res.json()
    const project = data.payload
    if (!project || project.length < 1) {
        return redirect('/admin')
    }


    return (
        <div className='w-full md:w-3/4 lg:w-1/2 flex flex-col items-center justify-center gap-6 p-4 py-6 bg-white mx-auto'>
            <h1 className='text-2xl text-center'>Update <span className='font-semibold'>{project.title}</span></h1>
            <UpdateProject {...project} />
        </div>
    )
}

export default Slug
