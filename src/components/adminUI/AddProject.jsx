'use client'
import axios from 'axios'
import React, { useState } from 'react'

const AddProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    category: '',
    repository: '',
    tags: '',
    siteLink: '',
    skills: ''

  })

  const handleChange = (e) => {
    const { name, value, files } = e.tagret
    if (files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const newData = new FormData()
      newData.append('title', formData.title)
      newData.append('description', formData.description)
      newData.append('image', formData.image)
      newData.append('category', formData.category)
      newData.append('repository', formData.repository)
      newData.append('tags', formData.tags)
      newData.append('siteLink', formData.siteLink)
      newData.append('skills', formData.skills)

      const response = await axios.post('/api/project', newData, { withCredentials: true })
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
        <label htmlFor="siteLink">Link</label>
        <input type="text" name='siteLink' id='siteLink' value={formData.siteLink} onChange={handleChange} className='w-full px-2 p-1 border-2 border-black/20 rounded-lg outline-none' />
      </div>
      <div className='w-full flex flex-col gap-2'>
        <label htmlFor="repository">Repository</label>
        <input type="text" name='repository' id='repository' value={formData.repository} onChange={handleChange} className='w-full px-2 p-1 border-2 border-black/20 rounded-lg outline-none' />
      </div>
      <div className='w-full flex flex-col gap-2'>
        <label htmlFor="image">Image</label>
        <input type="file" name='image' id='image' accept='image/*' onChange={handleChange} className='w-full px-2 p-1 border-2 border-black/20 rounded-lg outline-none' />
      </div>
      <button type='submit' className='w-full bg-linear-to-br from-sky-500 to-blue-700 p-1 text-white rounded-lg cursor-pointer hover:opacity-80'>Submit</button>
    </form>
  )
}

export default AddProject
