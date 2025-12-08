import { cookies } from 'next/headers'
import React from 'react'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/lib/secure'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "Tanvir Ahmmed | Admin",
  description: 'This is the main admin panel'
}

const MainLayout = async ({ children }) => {

  const token =(await cookies()).get('user_token')?.value

  if (!token) {
    return redirect('/signin')
  }

  let user;
  try {
    user = jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return redirect('/signin')
  }

  if (user.role !== 'admin') {
    return redirect('/signin')
  }

  return (
    <div>
      {children}
    </div>
  )
}

export default MainLayout
