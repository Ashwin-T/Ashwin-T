import {FaMailBulk, FaRegUser,FaCode} from "react-icons/fa";
import {AiOutlineFundProjectionScreen} from "react-icons/ai";
import {motion} from 'framer-motion'
import logo from '../assets/images/logo.png'
import React from 'react'
import { HashLink } from 'react-router-hash-link';

const Navbar: React.FC<{anim: React.MutableRefObject<boolean>}> = ({anim})=>{

    const NavbarData: any = [
        {
            title: "About",
            icon : <FaRegUser  size = {35}/>,
            tag: "/#about"
        },
        {
            title: "Skills",
            icon : <FaCode  size = {35}/>,
            tag: "/#skills"
        },
        {
            title: "Projects",
            icon : <AiOutlineFundProjectionScreen  size = {35}/>,
            tag: "/#projects"
        },
        {
            title: "Contact",
            icon : <FaMailBulk  size = {35}/>,
            tag: "/#contact"
        },
        
        
    ]


    const navbarVarients = {
        inital:{
            opacity:0
        },
        animate:{
            opacity:1,
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
                <HashLink smooth to = '/'>
                    <img className = 'logo' alt = 'logo' src = {logo} />
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


    return (
        <>
            <Animation />
        </>
    )
}
  
export default Navbar;