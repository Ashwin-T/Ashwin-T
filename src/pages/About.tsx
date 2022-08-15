import React from 'react'
import {motion} from 'framer-motion'
import { HashLink } from 'react-router-hash-link';
import {AiOutlineDown} from 'react-icons/ai'    
import CH from '../assets/images/CalvinHobbes.png'

const About: React.FC = () =>{

    return (
        <div>
            <div className="aboutContainer"  id = 'about'>
     
                <div className="aboutContent">
                    <motion.div className='flexbox column space-between'>
                        <div className ='flexbox column center' > 
                            <h1 className = 'aboutTitle'>
                                ABOUT ME
                            </h1>


                            <p>
                                — I am a dedicated and resilient student who will be attending the University of Wisconsin–Madison studying Computer Science.
                            </p>

                            <p>
                                Outside of school, I am a major Calvin and Hobbes fan and Jamba Juice enthusiast. In addition I enjoy playing sports and working out!
                            </p>

                            <br/>

                            <div className = 'buttonContainer flexbox center'>
                                <HashLink to = '/aboutme/#top'>
                                    <button className = 'learnMoreButton aboutBtnTxt'>Click to Learn More</button>
                                </HashLink>
                            </div>


                            <img alt = 'C&H' src = {CH} className = 'aboutImg'/>

                            <motion.div className = 'scroll-arrow2'>
                                <HashLink smooth to = '/#skills'>
                                    <AiOutlineDown />
                                </HashLink>
                            </motion.div>

                        </div>

                    </motion.div>

                </div>

            </div>



        </div>
    )
}

export default About;