

import React from 'react'

export const metadata={
    title: "Tanvir Ahmmed | Admin",
    description: 'This is the main admin panel'
}

const MainLayout = ({children}) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default MainLayout