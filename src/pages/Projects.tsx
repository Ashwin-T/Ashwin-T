import React, {useState} from 'react'
import {ProjectOutline} from '../components/ProjectOutline'
import projectData from '../assets/data/projectData'

export const Projects: React.FC = () =>{

    const [project, setProject] = useState(1000)

    const ProjectModal = ({project}: any)=>{
        return(
            <>Hi</>
        )
    }

    return (
        <div className = 'projectContainer flexbox column center' id = 'projects'>
            <div className="flexbox column center">
                <h1 className = 'aboutTitle'>PROJECTS</h1>
            </div>

            <div className="flexbox space-between marginz">
                {projectData.map((project: any, index: number) => {
                    return (
                        <div className="flexbox column center">
                            <ProjectOutline project = {project} />
                        </div>
                    ) 
                })}
               
            </div>

            <ProjectModal project = {projectData[project]}/>
        </div>
    )
}
