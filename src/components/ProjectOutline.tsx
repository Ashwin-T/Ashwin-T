import React from 'react'
import logo from '../assets/images/logos/MVX.png'
export const ProjectOutline: React.FC<{project: any}> = ({project})=>{
    return (
        <>
            <div className = 'flexbox center projectOutline'>
                <img alt = {project.title} src = {project.image}></img>
            </div>
        </>
    ) 
}
