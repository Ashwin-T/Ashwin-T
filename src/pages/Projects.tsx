import React, {useState} from 'react'
import {ProjectOutline} from '../components/ProjectOutline'
import projectData from '../assets/data/projectData'

export const Projects: React.FC = () =>{

    const tempData = {
        'title': '',
        'about': '',
        'stack': '',
        'inspiration': '',
        'image': '',
        'css': '',
        'status': ''
    }
    const [project, setProject] = useState(tempData)

    const ProjectModal = ()=>{

        const imgcss =  `projectModalIMG ${project.css}`
        return(

            <>
                <br />
                <div className = 'projectModal flexbox row center'>

                    <div className = 'flexbox column center'>
                        <img className = {imgcss} src = {project.image} alt = 'project'/>
                    </div>
                    
                    
                    <div className = 'flexbox column projectContent'>
                        <br />
                        <h1>{project.title}</h1>
                        <br />
                        <p>{project.about}</p>
                        <br />
                        <p>{project.inspiration}</p>
                        <br />
                        <p>{project.stack}</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className = 'projectContainer flexbox column center' id = 'projects'>
            <div className='flexbox column center'>
                <h1 className = 'aboutTitle'>PROJECTS</h1>
            </div>

            <div className='flexbox space-between marginz'>
                {projectData.map((project: any, index: number) => {
                    return (
                        <div onClick = {()=>{setProject(project)}}className='flexbox column center'>
                            <ProjectOutline project = {project}/>
                        </div>
                    ) 
                })}
               
            </div>

        {(project !== tempData) && <ProjectModal/>}        
    </div>
    )
}
