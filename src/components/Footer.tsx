import React, {useState, useEffect} from 'react';
import {BsInstagram} from 'react-icons/bs';
import {GoMarkGithub} from 'react-icons/go';
import {CgFileDocument} from 'react-icons/cg';
import {AiOutlineMail} from 'react-icons/ai';
import isMobile from '../hooks/isMobile';


export const Footer: React.FC =()=>{


    const [size, setSize] = useState(50);

    useEffect(()=>{
        isMobile() ? setSize(25) : setSize(50);
    },[setSize]);

    const footerData: any = [
            {
                title: "Follow my Instagram Account",
                icon : <BsInstagram size = {size}/>,
                link: "https://www.instagram.com/_ashwin.t/"
            },
            {
                title: "View My Github Portfolio",
                icon : <GoMarkGithub size = {size}/>,
                link: "https://github.com/Ashwin-T"
            },
            {
                title: "View my Resume",
                icon : <CgFileDocument size = {size}/>,
                link: "https://docs.google.com/document/d/1NLQIKOcnzYjrMHtNSmq0sbLgd1uoctfdF5bPjV-1dgM/preview"

            },
            {
                title: "Mail Me",
                icon : <AiOutlineMail size = {size}/>,
                link: "mailto:atalwalkar719@gmail.com"
            },
            
            
        ]

        const handleClick = (url :string) => {
            window.open(url, '_blank')
        }

    return (
        <footer key = 'contact' id = 'contact'> 
            <div className="footerContent flexbox column center ">

                <br />
                <div className="flexbox center">
                    <h4>(425)-892-0645 | atalwalkar719@gmail.com</h4>
                </div>

                <div className="flexbox row center">
                    {footerData.map((data: any, index: number)=>{
                        return(
                            <span key = {index} onClick = {()=>handleClick(data.link)}  className="footer-item">{data.icon}</span>
                        )
                    })}
                </div>

                <div className = 'flexbox column center'>
                    <h5>Created by Ashwin Talwalkar using TypeScript React</h5>
                    <h5>Last Updated on 1/5/2022</h5>
                    <h5 className='last-thing'>v2.25</h5>
                </div>

            </div>
        </footer>
    )
}
