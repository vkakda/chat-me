import React, { useEffect, useState } from 'react'
import { UserContext } from '../context/user.context'
// import { useContext } from 'react'
import axios from '../config/axios'
import { useNavigate } from 'react-router-dom'


const Home = () => {

    
    // const {  } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState(null)
    const [project, setProject] = useState([])

    const navigate = useNavigate()

    function createProject(e) {
      e.preventDefault();
      console.log({projectName});

      axios.post('/projects/create', { 
        name: projectName 
      }).then((res) => {
        console.log(res)
        setIsModalOpen(false)
      })
      .catch((err) => {
        console.log(err)
      })

    }

    useEffect(() => {

      axios.get('/projects/all')
      .then((res) => {
        setProject(res.data.projects)
      })
      .catch((err) => {
        console.log(err)
      })   
    })


  return (
    <main className='p-4'>
      <div className='projects flex flex-wrap gap-3'>
        <button 
        onClick={() => setIsModalOpen(true)}
        className="project p-4 border border-slate-300 rounded-md ">New Project 
          <i className="ri-link ml-2"></i>
        </button>
        {project.map((project) => (
          <div 
          key={project._id}
          onClick={() => navigate(`/project`, {
            state: { project }
          })} 
          className="project cursor-pointer flex flex-col gap-2 p-4 border border-slate-300 rounded-md min-w-52 hover:bg-gray-200">
           <h2 className="font-semibold"> 
            {project.name}
           </h2>
           <div className="flex gap-2">
            <p><small><i className="ri-user-line"></i> Collaborators :</small></p>
            {project.users.length} 
           </div>

          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Project</h2>
            <form
              onSubmit={createProject}
            >
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      

    </main>
  )
}

export default Home