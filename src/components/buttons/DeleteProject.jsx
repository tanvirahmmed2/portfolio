'use client'
import axios from 'axios';
import React from 'react'
import { MdDeleteOutline } from "react-icons/md";

const DeleteProject = ({id}) => {
    const deleteProject=async () => {
        try {
            const response= await axios.delete('/api/project', {data: {id}, withCredentials: true})
            alert(response.data.message)
        } catch (error) {
            alert(error?.response?.data?.message)
            console.log(error)
            
        }
        
    }
  return (
    <button onClick={deleteProject} className='cursor-pointer'><MdDeleteOutline/></button>
  )
}

export default DeleteProject
