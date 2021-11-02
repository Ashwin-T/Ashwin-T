import React from 'react'
import {motion} from 'framer-motion'
import flamingo from '../assets/images/flamingo.png'
import {AiOutlineDown} from 'react-icons/ai'
import { HashLink } from 'react-router-hash-link';


export const Home: React.FC<{anim: React.MutableRefObject<boolean>}> = ({anim})=>{

    const sentenceMove = {
        inital:{
            x:'-100vw'
        },
        animate:{
            x: 0,
            transition:{
                delay: 1,
                duration: 2,
            }
        }
    }

    const sentence = {
        inital:{
            opacity: 1
        },
        animate:{
            opacity: 1,
            transition:{
                delay: 0.5,
                staggerChildren: 0.08
            }
        }
    }


    const arrowVarients = {
        inital:{
            x: '200vh',
        },
        animate:{
            x: 0,
            transition: { 
                delay: 1,
                duration: 2,
            }
        }
    }

    const Animation: React.FC = ()=>{
        return(
        <>

         <motion.div className='homeContainer'
             variants = {sentence}
             initial = 'inital'
             animate = 'animate'
         >

             <br />


             <motion.div className='flexbox row space-between'
                 variants = {sentenceMove}
                 initial = 'inital'
                 animate = 'animate'>

                 <div>
                     <h1 className = 'flexbox column homeTitle'>
                         Hey, I'm Ashwin
                         <div className = 'flexbox column homeTitle2'>
                             Student | Athlete | Developer
                         </div>
                     </h1>
                    
                 </div>

                 <img src = {flamingo} alt = 'flamingo' className = 'flamingo'/>

             </motion.div>

             <motion.div className = 'scroll-arrow'
                variants = {arrowVarients}
                initial = 'inital'
                animate = 'animate'>  
                 <HashLink smooth to = '/#about'>
                     <AiOutlineDown />
                 </HashLink>
             </motion.div>

         </motion.div>
        </>
        )
    }


    const Regular: React.FC = ()=>{
        return(
        <>        
         
         <div className='homeContainer'>

             <br />

             <div className='flexbox row space-between'>
                 <div>
                     <h1 className = 'flexbox column homeTitle'>
                         Hey, I'm Ashwin
                         <div className = 'flexbox column homeTitle2'>
                             Student | Athlete | Developer
                         </div>
                     </h1>
                 </div>

                 <img src = {flamingo} alt = 'flamingo' className = 'flamingo'/>

             </div>

             <div className = 'scroll-arrow'>
                <HashLink smooth to = '/#about'>
                     <AiOutlineDown />
                 </HashLink>
             </div>
         </div>
        </>
        )
    }
    
    return (
        <>
            {anim.current ? <Animation /> : <Regular />}
        </>
    )
}
