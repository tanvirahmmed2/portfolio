import React from 'react'

const datas = [
  {
    id: 1,
    label: 'Languages',
    skills: ['C', 'C++', 'JavaScript', 'TypeScript']
  },
  {
    id: 2,
    label: 'FrameWorks',
    skills: ['React JS', 'Node JS', 'Express JS', 'Next JS']
  },
  {
    id: 3,
    label: 'Styling',
    skills: ['CSS', 'Bootstraps', 'Tailwind CSS']
  },
  {
    id: 4,
    label: 'Database',
    skills: ['MongoDB', 'mySql']
  },
  {
    id: 5,
    label: 'Authentication',
    skills: ['Google Auth', 'Cookies']
  },
  {
    id: 6,
    label: 'Tools',
    skills: ['Git', 'GitHub', 'Varcel', 'Render', 'Axios', 'PostMan']
  }
]

const Skills = () => {
  return (
    <div className='w-full flex items-center justify-center p-4 min-h-screen'>
      <div>
        <div className='w-full grid grid-cols-2  gap-6'>
          {
            datas.map((data) => (
              <div key={data.id} className='w-full bg-white p-2 rounded-2xl flex flex-col gap-6 py-4 shadow-sm'>
                <h1 className='w-auto mx-auto text-2xl font-semibold text-sky-500'>{data.label}</h1>
                <div className='w-full flex flex-wrap items-center justify-center gap-4 p-4'>
                  {
                    data.skills.map((skill)=>(
                      <p key={skill} className='bg-sky-500 px-4 p-1 text-white rounded-2xl hover:scale-105 transition ease-in-out duration-300 cursor-pointer'>{skill}</p>
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default Skills
