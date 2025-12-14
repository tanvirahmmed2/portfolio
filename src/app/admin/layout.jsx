
import React from 'react'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/middleware/isAdmin'

export const metadata = {
  title: "Tanvir Ahmmed | Admin",
  description: 'This is the main admin panel'
}

const MainLayout = async ({ children }) => {

  const auth= await isAdmin()

  if (!auth.success) {
    return redirect('/signin')
  }


  return (
    <div>
      {children}
    </div>
  )
}

export default MainLayout
