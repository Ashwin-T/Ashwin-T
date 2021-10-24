import React from 'react'
import {RiComputerLine} from 'react-icons/ri'
import {motion} from 'framer-motion'
import {AiOutlineDatabase, AiOutlineDown} from 'react-icons/ai'

export const Skills: React.FC =()=>{
    return (
        <div id = 'skills' className="skillsContanier">
            <div className="flexbox column center ">

                <br/>
            
                <h1 className = 'skillsTitle'>
                    SKILLS
                </h1>

                <br/>
            
                <div className="skillsBox flexbox column center">
                    <div className="skillsContent flexbox column center">
                        <div className="flexbox column center">
                            <div className = 'boxTittle'>Frontend <RiComputerLine /></div>
                            <div className = 'skillsSubHeader'>Languages</div>
                            <span>JavaScript, TypeScript, HTML5 & CSS3, </span>
                            <div className = 'skillsSubHeader'>Frameworks / Libraries / Tools</div>
                            <span> React.js, Gatsby, Redux, Bootstrap, Material-UI, A lot of React.js/JS libraries</span>
                        </div> 

                       <hr />

                        <div className="flexbox column center">
                            <div className = 'boxTittle'>Backend <AiOutlineDatabase /></div>
                            <div className = 'skillsSubHeader'>Languages</div>
                            <span>JavaScript, Java, Python, C, C++,</span>
                            <div className = 'skillsSubHeader'>Frameworks / Libraries / Tools</div>
                            <span>Express, MongoDB, Firebase</span>
                        </div>

                    </div>
                </div>
                <motion.div className = 'scroll-arrow'
                    animate = {{
                        y: [-50, 0],
                        transition: {
                            duration: 1,
                            yoyo: Infinity
                        }
                    }}
                >
                    <a href = '#projects'>
                        <AiOutlineDown />
                    </a>
                </motion.div>
                
            </div>
        </div>
       
    )
}
