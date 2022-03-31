import React from 'react'
import {motion} from 'framer-motion'
import { HashLink } from 'react-router-hash-link';
import {AiOutlineDown} from 'react-icons/ai'    
import CH from '../assets/images/CalvinHobbes.png'

export const About: React.FC = () =>{

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
                                — I am a dedicated and resilient student who is interested in Computer Science/Computer Engineering as a major. I am currently a senior currently located at Mountain View High School in Mountain View, California.
                            </p>

                            <p>
                                Outside of school & programming I enjos swimming, weightlifting, playing sports, reading Calvin & Hobbes, playing games & watching anime with his younger brother, and eating.
                            </p>
        
                            <br/>

                            <div className = 'buttonContainer flexbox center'>
                                <HashLink to = '/aboutme/#top'>
                                    <motion.button className = 'learnMoreButton aboutBtnTxt'>Click to Learn More</motion.button>
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
