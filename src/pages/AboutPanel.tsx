import React, { useEffect } from 'react'
import {BsArrowLeftSquare} from 'react-icons/bs'
// import comic from '../assets/images/comic.png'
import isMobile from '../hooks/isMobile'
import { HashLink } from 'react-router-hash-link';
import AOS from 'aos';
import "aos/dist/aos.css";
import data from "../assets/data/data.json"

import ash from "../assets/images/ash1.jpg"
// import suit3 from "../assets/images/PromPortraits-35.jpeg"
import swim from "../assets/images/ashwinSwim.png"
import suit from "../assets/images/suit2.png"

const AboutPanel: React.FC = ()=>{


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

             
                <div className="flexbox row center">
                   
                    <div className="flexbox column center">
                        <img className = "small-img" src={ash} alt = 'suit' />
                    </div>  

                    <div className="flexbox column center dataContent">
                        <h1 className = 'aboutPaneltitle'>MORE ABOUT ME</h1>
                        <div className = 'wrap'>
                            <h3>{data.aboutMe}</h3>
                        </div>
                    </div>
                </div>

                <br />   
                <br />

                <div className="flexbox row center">
      
                    {
                        isMobile() &&
                        
                        <>
                            <img className = "small-img" src={swim} alt = 'us' />  
                            <br />
                        </>
                        
                    }

                    <div className="flexbox column center dataContent" >
                        <h1 className = 'aboutPaneltitle'>Interests</h1>
                        {data.interests.map((item: any, index: number)=>{
                            return(
                                <div key = {index} className="flexbox column center">
                                    <h2 className = {item.css}>{item.title}</h2>
                                    <h3>{item.message}</h3>
                                </div>
                            )
                        })}
                    </div>

                    <div className="flexbox column center">
                        {
                            !isMobile() &&
                            
                            <>
                                <img className = "small-img" src={swim} alt = 'us' />  
                                <br />
                            </>
                          
                        }
                    </div>  

                </div>

                
                <br />   
                <br />
            
            
            
                <div className="flexbox row center">

                    {
                        isMobile() &&
                        
                        <>
                            <img className = "small-img" src={suit} alt = 'us' />  
                            <br />
                        </>
                        
                    }

                    

                    <div className="flexbox column center">
                        {
                            !isMobile() &&
                            
                            <>
                                <br />
                                <img className = "small-img" src={suit} alt = 'us' />  
                            </>
                            
                        }
                    </div>  
                        
                    <div className=" flexbox column center dataContent">
                        <h1 className = 'aboutPaneltitle'>Right Now?</h1>
                        {data.rightNow.map((item: any, index: number)=>{
                            return(
                                <div key = {index} className="flexbox column center">
                                    <h2 className = {item.css}>{item.title}</h2>
                                    <h3>{item.message}</h3>
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

export default AboutPanel;