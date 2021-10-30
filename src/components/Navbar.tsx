import {FaMailBulk, FaRegUser,FaCode, FaProjectDiagram} from "react-icons/fa";
import {motion} from 'framer-motion'
import logo from '../assets/images/logo.png'
import React from 'react'
import { HashLink } from 'react-router-hash-link';
 
  
export const Navbar: React.FC<{anim: React.MutableRefObject<boolean>}> = ({anim})=>{

    const NavbarData: any = [
        {
            title: "About",
            icon : <FaRegUser />,
            tag: "/#about"
        },
        {
            title: "Skills",
            icon : <FaCode />,
            tag: "/#skills"
        },
        {
            title: "Projects",
            icon : <FaProjectDiagram />,
            tag: "/#projects"
        },
        {
            title: "Contact",
            icon : <FaMailBulk />,
            tag: "/#contact"
        },
        
        
    ]


    const navbarVarients = {
        inital:{
            y:'-25vh'
        },
        animate:{
            y: 0,
            transition:{
                duration: 1.5,
            }
        }
    }

    const Animation: React.FC = () =>{
        return(
            <motion.nav 
            variants = {navbarVarients}
            initial = "inital"
            animate = "animate"
            >
                <HashLink smooth to = '/' className="navItemz">
                    <motion.img className = 'logo' alt = 'logo' src = {logo} />
                </HashLink>

                <motion.div className="navbarItem">
                    {NavbarData.map((item: any)=>{
                        return(
                            <HashLink key = {item.title} smooth to = {item.tag}>{item.icon}</HashLink>
                        )
                    })}
                </motion.div> 
        </motion.nav>
        )
    }

    const Regular: React.FC = () =>{
        return(
            <nav>
                <HashLink onClick = {()=>{anim.current = true}} smooth to = '/#'  className="navItemz">
                    <img className = 'logo' alt = 'logo' src = {logo} />
                </HashLink>

                <div className="navbarItem">
                    {NavbarData.map((item: any)=>{
                        return(
                            <HashLink key = {item.title} smooth to = {item.tag}>{item.icon}</HashLink>
                        )
                    })}
                </div> 
            </nav>
        )
    }



    return (
        <>
        {anim ? <Animation /> : <Regular />}
        </>
    )
}
  