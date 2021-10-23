import {FaMailBulk, FaRegUser,FaCode, FaProjectDiagram} from "react-icons/fa";
import {motion} from 'framer-motion'
import logo from '../assets/images/logo.png'
import React from 'react'
  
export const Navbar: React.FC = ()=>{

    const NavbarData: any = [
        {
            title: "About",
            icon : <FaRegUser />,
            tag: "#about"
        },
        {
            title: "Skills",
            icon : <FaCode />,
            tag: "#skills"
        },
        {
            title: "Projects",
            icon : <FaProjectDiagram />,
            tag: "#projects"
        },
        {
            title: "Contact",
            icon : <FaMailBulk />,
            tag: "#contact"
        },
        
        
    ]


    const navbarVarients = {
        inital:{
            y:'-25vh'
        },
        animate:{
            y: 0,
            transition:{
                delay: 2,
                duration: 2,
            }
        }
    }

    return (
    <motion.nav 
        variants = {navbarVarients}
        initial = "inital"
        animate = "animate"
    >
        <a href = '/' className="navItemz">
            <img className = 'logo' alt = 'logo' src = {logo} />
        </a>
        <div className="navbarItem">
            {NavbarData.map((item: any)=>{
                return(
                    <a key = {item.title} href = {item.tag}>{item.icon}</a>
                )
            })}
        </div> 
    </motion.nav>
    )
}
  