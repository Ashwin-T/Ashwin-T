import React, {useState} from 'react'
import {ProjectOutline} from '../components/ProjectOutline'
import projectData from '../assets/data/projectData'
import { HashLink } from 'react-router-hash-link'
import { ProjectModal } from '../components/ProjectModal'
export const Projects: React.FC = () =>{

    const tempData = {
        'title': '',
        'about': '',
        'stack': '',
        'inspiration': '',
        'image': '',
        'css': '',
        'status': '',
        'github': '',
        'link': ''
    }

    const [project, setProject] = useState(tempData)

    return (
        <div className = 'projectContainer flexbox column center' id = 'projects'>
            <div className='flexbox column center'>
                <h1 className = 'aboutTitle'>PROJECTS</h1>
            </div>

            <div className='flexbox space-between marginz'>
                {projectData.map((project: any, index: number) => {
                    return (
                        <HashLink key = {index} smooth to = '/#projectDisplay' onClick = {()=>{setProject(project)}}className='flexbox column center'>
                            <ProjectOutline project = {project}/>
                        </HashLink>
                    ) 
                })}
               
            </div>

        {(project !== tempData) && <ProjectModal project = {project}/>}        
    </div>
    )
}
