import FeaturedProjects from '@/components/pages/FeaturedProjects'
import GetContact from '@/components/pages/GetContact'
import Hero from '@/components/pages/Hero'
import LifeActivities from '@/components/pages/LifeActivities'
import LittleDescription from '@/components/pages/LittleDescription'
import Skills from '@/components/pages/Skills'
import TopReviews from '@/components/pages/TopReviews'
import React from 'react'

const HomePage = () => {
  return (
    <div>
      <Hero/>
      <LittleDescription/>
      <FeaturedProjects/>
      <Skills/>
      <LifeActivities/>
      <TopReviews/>
      <GetContact/>

    </div>
  )
}

export default HomePage