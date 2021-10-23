import React, {useEffect, useState} from 'react'
import {motion} from 'framer-motion'
import logo from '../assets/images/logo.png'
import flamingo from '../assets/images/flamingo.png'
import {AiOutlineDown} from 'react-icons/ai'

export const Home: React.FC = ()=>{

    const [loading, setLoading] = useState(true)


    useEffect(()=>{
        setTimeout(()=>{
            setLoading(false);
        }, 3900)
    }, [])

    const sentenceMove = {
        inital:{
            x:'-150vw'
        },
        animate:{
            x: 0,
            transition:{
                delay: 3,
                duration: 2.5,
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



    const logoVarients = {
        inital:{
            x:'-100vw',
        },
        animate:{
            x: 0,
            transition:{
                type: 'spring',
                stiffness: 75,
                duration: 2,
            }
        }
    }

    const imageContainerVarients = {
        inital:{
            opacity: 1,
        },
        animate:{
            x: 0,
            opacity: 0,
            transition:{
                delay: 1,
                duration: 2,
            }
        }
    }

    

    return (
        <>

            {loading && (<motion.div className = 'flexbox column center'
               variants = {imageContainerVarients}
               initial = 'inital'
               animate = 'animate'
            >
                <motion.img src = {logo} alt = 'mainLogo' className = 'mainLogo'  
                    variants = {logoVarients}
                    initial = 'inital'
                    animate = 'animate'
                />
            </motion.div>)}            
            
            <motion.div className='homeContainer'
                variants = {sentence}
                initial = 'inital'
                animate = 'animate'
            >

                <motion.div className='flexbox row space-between'
                    variants = {sentenceMove}
                    initial = 'inital'
                    animate = 'animate'>

                    <div>
                        <h1 className = 'flexbox column homeTitle'>
                            Hey, I'm Ashwin
                            <h1 className = 'flexbox column homeTitle2'>
                                Student | Athelete | Developer
                            </h1>
                        </h1>
                       
                    </div>

                    <img src = {flamingo} alt = 'flamingo' className = 'flamingo'/>

                </motion.div>

                {!loading && <motion.div className = 'scroll-arrow'
                    animate = {{
                        y: [-50, 0],
                        transition: {
                            duration: 1,
                            yoyo: Infinity
                        }
                    }}
                >
                    <a href = '#about'>
                        <AiOutlineDown />
                    </a>
                </motion.div>}
                
                
            </motion.div>
        </>
    )
}
