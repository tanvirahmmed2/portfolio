'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'

const SignUpForm = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const changeHandler = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const signup = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/user', formData, { withCredentials: true })
            alert(response.data.message)
            console.log(response)
        } catch (error) {
            alert(error?.response?.data?.message)
            console.log(error)

        }

    }
    return (
        <div className='w-auto min-w-[300px] flex items-center justify-center bg-white rounded-2xl flex-col gap-6 p-4 shadow-sm shadow-sky-500'>
            <h1 className='text-xl font-semibold'>Sign Up</h1>
            <form className='w-full flex flex-col items-center justify-center gap-4 ' onSubmit={signup}>
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="name">Name</label>
                    <input type="text" name='name' id='name' required onChange={changeHandler} value={formData.name} className=' w-full px-2 p-1 border-2 border-black/20 outline-none rounded-2xl' />
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="emil">Email</label>
                    <input type="email" name='email' id='email' required onChange={changeHandler} value={formData.email} className=' w-full px-2 p-1 border-2 border-black/20 outline-none rounded-2xl' />
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="password">Password</label>
                    <input type="password" name='password' id='password' required onChange={changeHandler} value={formData.password} className=' w-full px-2 p-1 border-2 border-black/20 outline-none rounded-2xl' />
                </div>
                <Link href={'/signin'} className='text-xs'>already signed up? </Link>
                <button type='submit' className='w-full text-center cursor-pointer bg-sky-500 rounded-2xl text-white opacity-85 hover:opacity-100'>Next</button>
            </form>
        </div>
    )
}

export default SignUpForm
