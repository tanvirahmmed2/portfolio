import Navbar from '@/components/ui/panel/Navbar'
import Sidebar from '@/components/ui/panel/Sidebar'
import React from 'react'

const PanelLayout = ({ children }) => {
    return (
        <div>
            <Navbar/>
            <Sidebar/>
            {children}
        </div>
    )
}

export default PanelLayout