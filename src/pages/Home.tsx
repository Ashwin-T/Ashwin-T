import React from 'react'
import {motion} from 'framer-motion'

export const Home: React.FC = ()=>{

    
    const homeVarients = {
        inital:{
            x:'-100vw'
        },
        animate:{
            x: 0,
            // backgroundColor: ["#fff", "#aac7d2", "#548fa4"],
            transition:{
                duration: 1,
            }
        }
    }

    return (
        <>
            {/* {!loaded ? <img src = {logo} alt = 'mainLogo' className = 'mainLogo' /> : null} */}
            
            <motion.div className="homeContainer"
                variants = {homeVarients}
                initial = "inital"
                animate = "animate"
            >
                
            </motion.div>
        </>
    )
}
