import React, {useState} from 'react'
import {ProjectOutline} from '../components/ProjectOutline'
import projectData from '../assets/data/projectData'
import { HashLink } from 'react-router-hash-link'
import {BsGithub} from 'react-icons/bs'
import {BiLink, BiUnlink} from 'react-icons/bi'

export const Projects: React.FC = () =>{

    const handleClick = (url :string) => {
        window.open(url, '_blank')
    }

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

    const ProjectModal = ()=>{

        const imgcss =  `projectModalIMG ${project.css}`
        return(

            <div id = 'projectDisplay'>
                <br />
                <div className = 'projectModal flexbox row center'>

                    <div className = 'flexbox column center'>
                        <br />
                        <img className = {imgcss} src = {project.image} alt = 'project'/>
                    </div>
                    
                    <div className = 'flexbox center column projectContent'>
                        <br />
                        <h1>{project.title}</h1>
                        <br />
                        <p>{project.about}</p>
                        <br />
                        <p>{project.inspiration}</p>
                        <br />
                        <p>Status: {project.status}</p>
                        <br />
                        <p className = 'flexbox icons'>
                        {project.github !== "None" ?
                            <span className = 'iconsChild'>
                                <BsGithub onClick = {()=>handleClick(project.github)} size = '25'/> 
                            </span>: null}
                            <span className = 'iconsChild'>
                                {project.link !== "None" ? <BiLink onClick = {()=>handleClick(project.link)} size = '25'/> : <BiUnlink size = '25'/>}
                            </span>
                        </p>
                        <br />
                        <p>{project.stack}</p>

                    </div>
                </div>
            </div>
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
                        <HashLink smooth to = '/#projectDisplay' onClick = {()=>{setProject(project)}}className='flexbox column center'>
                            <ProjectOutline project = {project}/>
                        </HashLink>
                    ) 
                })}
               
            </div>

        {(project !== tempData) && <ProjectModal/>}        
    </div>
    )
}
