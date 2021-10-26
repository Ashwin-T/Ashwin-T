import React from 'react'
import {motion} from 'framer-motion'
import { Link } from 'react-router-dom'
import {AiOutlineDown} from 'react-icons/ai'    
import CH from '../assets/images/CalvinHobbes.png'

export const About: React.FC = () =>{

    return (
        <div id = 'about'>
            <div className="aboutContainer" >
                
                <div className="aboutContent">
                    <motion.div className='flexbox column space-between'>
                        <div className ='flexbox column center'>   
                            <h1 className = 'aboutTitle'>
                                ABOUT ME
                            </h1>

                            <p>
                                — Ashwin Talwalkar is a dedicated and resilient student who is interested in Computer Science and Computer Engineering as a major. He is a current senior currently located at Mountain View High-School in Mountain View, California.
                            </p>

                            <p>
                                Outside of school and programming he enjoys swimming, weightlifting, playing any sport, reading Calvin and Hobbes, playing games and watching anime with his younger brother, as well as trying out new things.
                            </p>

                            <motion.button className = 'learnMoreButton'>
                                <Link className = 'aboutBtnTxt' to = '/about'>Click to Learn More</Link>
                            </motion.button>

                            <img alt = 'C&H' src = {CH} className = 'aboutImg'/>

                            <br/>

                            <motion.div className = 'scroll-arrow2'>
                                <a href = '#skills'>
                                    <AiOutlineDown />
                                </a>
                            </motion.div>

                        </div>

                    </motion.div>

                </div>

            </div>



        </div>
    )
}
