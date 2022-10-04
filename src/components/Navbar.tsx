import {FaMailBulk, FaRegUser,FaCode} from "react-icons/fa";
import {AiOutlineFundProjectionScreen} from "react-icons/ai";

import React, {useState, useEffect} from 'react'
import { HashLink } from 'react-router-hash-link';

const Navbar: React.FC<{anim: React.MutableRefObject<boolean>}> = ({anim})=>{

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {

        window.addEventListener('resize', function(event){
            setWidth(window.innerWidth)
        });

        return () => {
            window.removeEventListener('resize', function(event){
                setWidth(window.innerWidth)
            });
        }

    }, []); 

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
            {width > 786 ? 
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