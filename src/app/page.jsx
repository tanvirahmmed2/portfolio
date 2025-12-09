import DetailBox from '@/components/card/DetailBox'
import Image from 'next/image'
import React from 'react'

const education = [
  {
    id: 1,
    title: 'BSc in Eelectrical & Electronics Engineering',
    institution: "Mymensingh Engineering College",
    time: '2023-2028',
    grade: 'Studying'
  },
  {
    id: 2,
    title: 'Higher Secondary Certificate',
    institution: "Notre Dame College Mymensingh",
    time: '2020-2022',
    grade: '5.00'
  },
  {
    id: 3,
    title: 'Secondary School Certificate',
    institution: "Batta Bhat Para S.C. High School",
    time: '2018-2020',
    grade: '5.00'
  },

]

const primarySkill = [
  {
    id: 1,
    title: 'React Js & Next Js',
    level: 'Expert',
    category: 'Frontend'
  },
  {
    id: 2,
    title: 'Node Js & Express Js',
    level: 'Advanced',
    category: 'Backend'
  },
  {
    id: 3,
    title: 'MongoDB & REST API',
    level: 'Expert',
    category: 'Database'
  },
]

const Home = () => {
  return (
    <div className='w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-4 py-12 p-4'>


      <div className='w-full flex flex-col gap-6'>
        <div className='p-4 flex flex-col gap-4 bg-white rounded-2xl'>
          <h1 className='text-3xl border-b-2 border-sky-500'>Bio</h1>
          <p className='text-justify w-full'>Versatile Full Stack Developer with expertise in the MERN stack, Next.js, and modern CSS frameworks like Tailwind and Bootstrap. Experienced in building responsive, high-performance web applications from concept to deployment. Skilled at creating intuitive user interfaces, integrating APIs, and ensuring seamless functionality across platforms. Driven by problem-solving, continuous learning, and a passion for turning ideas into scalable digital solutions.</p>
        </div>

        <div className='p-4 flex flex-col gap-4 bg-white/50 rounded-2xl'>
          <h1 className='text-3xl border-b-2 border-sky-500'>Primary Skills</h1>
          {
            primarySkill.map((e) => (
              <div key={e.id} className='w-full flex flex-row items-center justify-between gap-2 bg-gray-100 rounded-2xl p-2'>

                <div className='w-full flex flex-col gap-2'>
                  <h1 className='text-xl'>{e.title}</h1>
                  <p className='text-sky-500 opacity-50'>{e.category}</p>
                </div>
                <p className='bg-sky-500 px-2 p-1 text-white rounded-2xl'>{e.level}</p>
              </div>
            ))
          }
        </div>


        <div className='p-4 flex flex-col gap-4 bg-white rounded-2xl'>
          <h1 className='text-3xl border-b-2 border-sky-500'>Education</h1>
          {
            education.map((e) => (
              <div key={e.id} className='w-full flex flex-col gap-4 bg-gray-100 rounded-2xl p-2 shadow-xs '>
                <h1 className='text-xl'>{e.title}</h1>
                <p className='text-sky-500'>{e.institution}</p>
                <p className='w-full flex flex-row items-center gap-6 opacity-50'><span>{e.time}</span> <span className='border-l-2 px-4'>{e.grade}</span></p>
              </div>
            ))
          }
        </div>

      </div>

      <div className='w-full lg:w-1/2 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl p-4'>
        <Image src='/formal.jpg' alt='main image' width={1000} height={1000} className='w-[300px] h-[300px] rounded-full border-4 border-sky-500' />
        <h1 className='text-4xl font-semibold'>Tanvir Ahmmed</h1>
        <p className=''>Web Developer & Tech Enthusiast</p>
        <DetailBox />
      </div>


    </div>
  )
}

export default Home
