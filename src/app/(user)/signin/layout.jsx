import { cookies } from 'next/headers'
import React from 'react'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/lib/secure'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "Tanvir Ahmmed | Sign In",
  description: 'This is the main sign in page'
}

const MainLayout = async ({ children }) => {

  const token = (await cookies()).get('user_token')?.value

  if (token) {
    const decode = jwt.verify(token, JWT_SECRET)
    if (decode.role === admin) {
      return redirect('/profile')
    }
  }

  return (
    <div>
      {children}
    </div>
  )
}

export default MainLayout
