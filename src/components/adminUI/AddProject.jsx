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
    <form >
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" name='title' id='title' />
      </div>
    </form>
  )
}

export default AddProject
