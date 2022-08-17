import {FaMailBulk, FaRegUser,FaCode} from "react-icons/fa";
import {AiOutlineFundProjectionScreen} from "react-icons/ai";

import React from 'react'
import { HashLink } from 'react-router-hash-link';

const Navbar: React.FC<{anim: React.MutableRefObject<boolean>}> = ({anim})=>{

    const MobileNav = ()=>{
        return(
            <nav>
                <HashLink smooth to = '/#about'>
                    <FaRegUser  size = {25}/>
                </HashLink>

                <HashLink smooth to = '/#skills'>
                    <FaCode  size = {25}/>
                </HashLink>

                <HashLink smooth to = '/'>
                    Ashwin Talwalkar
                </HashLink>

                <HashLink smooth to = '/#projects'>
                    <AiOutlineFundProjectionScreen  size = {25}/>
                </HashLink>

                <HashLink smooth to = '/#contact'>
                    <FaMailBulk  size = {25}/>
                </HashLink>
            </nav>
        )
    }
  
    return (
        <>
            {window.innerWidth > 786 ? 
            <nav>
                <div>
                    <HashLink smooth to = '/#about'>
                        About
                    </HashLink>

                    <HashLink smooth to = '/#skills'>
                        Skills
                    </HashLink>
                </div>

                <div className = 'name'>
                    <HashLink smooth to = '/'>
                        Ashwin Talwalkar
                    </HashLink>
                </div>

                <div>
                    <HashLink smooth to = '/#projects'>
                        Projects
                    </HashLink>

                    <HashLink smooth to = '/#contact'>
                        Contact
                    </HashLink>
                </div>
            </nav>
                : <MobileNav />
            }
        </>
    )
}
  
export default Navbar;