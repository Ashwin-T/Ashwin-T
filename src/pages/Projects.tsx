import React from 'react'
import comic from '../assets/images/comicz.jpg'
import comicx from '../assets/images/comicx.jpg'
import isMobile from '../hooks/isMobile'


export const Projects: React.FC = () =>{
    return (
        <div className = 'projectContainer' id = 'projects'>
            <div className="flexbox center column">
                <h1>Project Section Coming Soon! In the mean time enjoy this comic!</h1>
                <br />
                {
                    isMobile() ? <img style = {{width: '350px'}} src ={comicx} alt = 'comic1'/>:  <img src ={comic} alt = 'comic2'/>
                }

            </div>
        </div>
    )
}
