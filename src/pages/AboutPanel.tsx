import React, { useEffect } from 'react'
import {BsArrowLeftSquare} from 'react-icons/bs'
// import comic from '../assets/images/comic.png'
import { HashLink } from 'react-router-hash-link';
import AOS from 'aos';
import "aos/dist/aos.css";



export const AboutPanel: React.FC = ()=>{


    useEffect(() => {
        AOS.init({
          duration : 2000
        });
      }, []);

      
    return (
        <>
            
            <div className="flexbox">
                <HashLink className = 'backArrow' smooth to = '/#about'><BsArrowLeftSquare /></HashLink>
            </div>
            <div className="flexbox column center APContainer">
               <h1>MORE ABOUT ME</h1>
               <br />
               {/* <img src = {comic} alt = 'hello' /> */}
            </div>
        </>
    )
}
