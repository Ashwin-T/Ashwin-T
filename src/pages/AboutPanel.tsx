import React from 'react'
import {BsArrowLeftSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import comic from '../assets/images/comic.png'

export const AboutPanel: React.FC = ()=>{
    return (
        <>
            
            <div className="flexbox">
                <Link className = 'backArrow' to = '/#about'><BsArrowLeftSquare /></Link>
            </div>
            <div className="flexbox column center APContainer">
               <h1>MORE ABOUT ME</h1>
               <br />
               <img src = {comic} alt = 'hello' />
            </div>
        </>
    )
}
