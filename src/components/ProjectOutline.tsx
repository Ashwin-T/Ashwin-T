import React from 'react'
export const ProjectOutline: React.FC<{project: any}> = ({project})=>{
    return (
        <>
            <div className = 'flexbox center projectOutline'>
                <img className = {project.css} alt = {project.title} src = {project.image}></img>
            </div>
        </>
    ) 
}
