import React, { useEffect } from 'react'
import {BsArrowLeftSquare} from 'react-icons/bs'
// import comic from '../assets/images/comic.png'
import isMobile from '../hooks/isMobile'
import { HashLink } from 'react-router-hash-link';
import AOS from 'aos';
import "aos/dist/aos.css";
import data from "../assets/data/data.json"

import suit from "../assets/images/suit.png"
import us from "../assets/images/us.png"


export const AboutPanel: React.FC = ()=>{


    useEffect(() => {
        AOS.init({
          duration : 1000
        });
      }, []);

      


      
    return (
        <>
            
            <div className="flexbox" id = '#top'>
                <HashLink className = 'backArrow' smooth to = '/#about'><BsArrowLeftSquare /></HashLink>
            </div>

            <br/>
            <br/>


            <div className="flexbox column center APContainer" >

                <div className="flexbox row center" data-aos="flip-left">
                    {!isMobile() &&
                        <div className="flexbox column center">
                            <img src={suit} alt = 'suit' />
                        </div>
                    }                   

                    <div className=" flexbox column center dataContent">
                        <h1 className = 'aboutPaneltitle'>MORE ABOUT ME</h1>
                        <div className = 'wrap'>
                            <h3>{data.aboutMe}</h3>
                            <h3>{data.aboutMore}</h3>
                        </div>
                    </div>
                </div>

                <div className=" flexbox row center" data-aos="fade-right">
                   
                    <div className=" flexbox column center dataContent">
                        <h1 className = 'aboutPaneltitle'>RIGHT NOW?</h1>
                        {data.rightNow.map((item: any, index: number)=>{
                            return(
                                <div key = {index} className="flexbox column center">
                                    <h2 className = {item.css}>{item.title}</h2>
                                    <h3>{item.message}</h3>
                                </div>
                            )
                        })}
                    </div>

                    {!isMobile() &&
                        <div className="flexbox column center">
                            <img src={us} alt = 'us' />
                        </div>
                    } 
                </div>

                <br />
                <br/>
                <br/>



                <div className=" flexbox row center"  data-aos="fade-left">
                    <div className=" flexbox column center">
                        <h1 className = 'aboutPaneltitle'>OTHER ACTIVITIES</h1>
                        <br />
                        {data.activities.map((item: any, index: number)=>{
                            return(
                                <div className = 'flexbox row center' key = {index}>
                                    <div className = 'flexbox column center'>
                                        <h3>{item.message}</h3>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                
                <br />
                <br/>
                <br/>

                


            </div>
        </>
    )
}
