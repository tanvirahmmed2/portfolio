import FeaturedProjects from '@/components/pages/FeaturedProjects'
import GetContact from '@/components/pages/GetContact'
import Hero from '@/components/pages/Hero'
import WorksLife from '@/components/pages/WorksLife'
import Acheivement from '@/components/pages/Acheivement'
import LatestBlogs from '@/components/pages/LatestBlogs'
import LittleDescription from '@/components/pages/LittleDescription'
import Skills from '@/components/pages/Skills'
import TopReviews from '@/components/pages/TopReviews'
import React from 'react'

const HomePage = () => {
  return (
    <div className='w-full'>
      <Hero/>
      <LittleDescription/>
      <FeaturedProjects/>
      <WorksLife/>
      <Acheivement/>
      <TopReviews/>
      <LatestBlogs/>
      <Skills/>
      <GetContact/>

    </div>
  )
}

export default HomePage