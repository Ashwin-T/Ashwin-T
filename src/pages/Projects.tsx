import React from 'react'
import {ProjectOutline} from '../components/ProjectOutline'
import projectData from '../assets/data/projectData'



export const Projects: React.FC = () =>{

    return (
        <div className = 'projectContainer' id = 'projects'>
            <div className="flexbox column center">
                <h1 className = 'aboutTitle'>PROJECTS</h1>
            </div>

            <div className="flexbox space-between marginz">
                {projectData.map((project: any, index: number) => {
                    return (
                        <div className="flexbox">
                            <ProjectOutline project = {project} />
                        </div>
                    ) 
                })}
               
            </div>
        </div>
    )
}
