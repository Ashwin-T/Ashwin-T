import React from 'react'
import {RiComputerLine} from 'react-icons/ri'
import {motion} from 'framer-motion'
import {AiOutlineDatabase, AiOutlineDown} from 'react-icons/ai'
import { HashLink } from 'react-router-hash-link';


const Skills: React.FC =()=>{
    return (
        <div id = 'skills' className="skillsContanier flexbox column center">
            <div className="flexbox column center ">
                <h1 className = 'skillsTitle'>
                    SKILLS
                </h1>
            
                <div className="skillsBox flexbox column center">
                    <div className="skillsContent flexbox column center">
                        <div className="flexbox column center">
                            <div className = 'boxTittle'>Frontend <RiComputerLine /></div>
                            <div className = 'skillsSubHeader'>Languages</div>
                            <span>JavaScript, TypeScript, HTML5 & CSS3, </span>
                            <div className = 'skillsSubHeader'>Frameworks / Libraries / Tools</div>
                            <span>React.js, Vue.js, Next, Bootstrap, Material-UI, Node.js</span>
                        </div> 

                       <hr />

                        <div className="flexbox column center">
                            <div className = 'boxTittle'>Backend <AiOutlineDatabase /></div>
                            <div className = 'skillsSubHeader'>Languages</div>
                            <span>JavaScript, Java, C++, Python</span>
                            <div className = 'skillsSubHeader'>Frameworks / Libraries / Tools</div>
                            <span>Firebase, MongoDB, Express, Node/Deno</span>
                        </div>

                    </div>
                </div>
                <motion.div className = 'scroll-arrow'>
                    <HashLink smooth to = '/#projects'>
                        <AiOutlineDown size = {'2.5rem'}/>
                    </HashLink>
                </motion.div>
    
            </div>
        </div>
       
    )
}

export default Skills;