'use client'
import axios from 'axios';
import React from 'react'

import { MdDeleteOutline } from "react-icons/md";

const DeleteMessage = ({ id }) => {

    const deleteMessage = async () => {
        try {
            const response = await axios.delete('/api/message', { data: { id }, withCredentials: true })
            alert(response.data.message)
            console.log(response)
        } catch (error) {
            alert(error?.response?.data?.message)
            console.log(error)

        }

    }
    return (
        <button onClick={deleteMessage} className='p-2 cursor-pointer'><MdDeleteOutline /></button>
    )
}

export default DeleteMessage
