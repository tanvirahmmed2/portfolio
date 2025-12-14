import { cookies } from 'next/headers'
import React from 'react'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/middleware/isAdmin'

export const metadata = {
  title: "Tanvir Ahmmed | Sign In",
  description: 'This is the main sign in page'
}

const MainLayout = async ({ children }) => {

  const auth= await isAdmin()


  if (auth.success) {
    return redirect('/profile')
  }

  return (
    <div>
      {children}
    </div>
  )
}

export default MainLayout
