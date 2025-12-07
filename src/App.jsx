import React from 'react'
import Navbar from './component/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './component/Home'
import Skill from './component/Skill'
import Project from './component/Project'
import Projects from './component/Projects'

function App() {
  return (
    <div className='w-full relative overflow-x-hidden bg-gray-200'>
      <Navbar />
      <div className='w-full mt-20'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/skills' element={<Skill />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/project/:[name]' element={<Project />} />
        </Routes>
      </div>

    </div>
  )
}

export default App
