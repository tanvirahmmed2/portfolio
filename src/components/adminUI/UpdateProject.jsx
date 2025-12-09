'use client'
import axios from 'axios'
import React, { useState } from 'react'

const UpdateProject = ({_id, title, description, category, repository, siteLink }) => {
    const [formData, setFormData] = useState({
        id: _id,
        title: title,
        description: description,
        category: category,
        repository: repository,
        tags: '',
        siteLink: siteLink,
        skills: ''

    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put('/api/project', formData, { withCredentials: true })
            alert(response.data.message)
            console.log(response)
        } catch (error) {
            alert(error?.response?.data?.message)
            console.log(error)

        }

    }
    return (
        <form className='w-full flex flex-col items-center justify-center gap-4' onSubmit={handleSubmit}>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="title">Title</label>
                <input type="text" name='title' id='title' value={formData.title} onChange={handleChange} className='w-full px-2 p-1 border-2 border-black/20 rounded-lg outline-none' />
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="description">Description</label>
                <input type="text" name='description' id='description' value={formData.description} onChange={handleChange} className='w-full px-2 p-1 border-2 border-black/20 rounded-lg outline-none' />
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="category">Category</label>
                <input type="text" name='category' id='category' value={formData.category} onChange={handleChange} className='w-full px-2 p-1 border-2 border-black/20 rounded-lg outline-none' />
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="skills">Skills</label>
                <input type="text" name='skills' id='skills' value={formData.skills} onChange={handleChange} className='w-full px-2 p-1 border-2 border-black/20 rounded-lg outline-none' />
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="tags">Tags</label>
                <input type="text" name='tags' id='tags' value={formData.tags} onChange={handleChange} className='w-full px-2 p-1 border-2 border-black/20 rounded-lg outline-none' />
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="siteLink">Link</label>
                <input type="text" name='siteLink' id='siteLink' value={formData.siteLink} onChange={handleChange} className='w-full px-2 p-1 border-2 border-black/20 rounded-lg outline-none' />
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="repository">Repository</label>
                <input type="text" name='repository' id='repository' value={formData.repository} onChange={handleChange} className='w-full px-2 p-1 border-2 border-black/20 rounded-lg outline-none' />
            </div>

            <button type='submit' className='w-full bg-linear-to-br from-sky-500 to-blue-700 p-1 text-white rounded-lg cursor-pointer hover:opacity-80'>Submit</button>
        </form>
    )
}

export default UpdateProject
