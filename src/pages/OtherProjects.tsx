import React, {useState} from 'react'
import snowcones from '../assets/images/logos/snowcones.png'
import old from '../assets/images/logos/Main.png'
import polltaker from '../assets/images/logos/polltaker.png'
import todo19 from '../assets/images/logos/todo19.png'
import holanim from '../assets/images/logos/hol-anim.png'
import spaceShip from '../assets/images/logos/spaceShip.png'
import snowball from '../assets/images/logos/snowball.png'
import {BsArrowLeftSquare} from 'react-icons/bs'
import { HashLink } from 'react-router-hash-link';
import {ProjectOutline} from '../components/ProjectOutline'
import { ProjectModal } from '../components/ProjectModal'

export const OtherProjects: React.FC = () =>{
    const tempData = {
        'title': '',
        'about': '',
        'stack': '',
        'inspiration': '',
        'image': '',
        'css': '',
        'status': '',
        'github': '',
        'link': ''
    }
    const [project, setProject] = useState(tempData)

    const otherProjectData = 
    [
        {
            "title": "Old Personal Website",
            "about": "My old, very vanilla, website! View to see my how different my web dev skills were 6 months ago",
            "stack": "HTML, CSS, JavaScript",
            "image": old,
            "css": 'bkpurple',
            "status" : "Finished",
            "bkcolor": '#2d1493',
            "github": "https://github.com/Ashwin-T/Old-Website",
            "link": "https://ashwin-t.github.io/Old-Website/"   
        },
        {
            "title": "At Home Snow Cones",
            "about": "A website and online store for my younger brother`s snow cone business",
            "stack": "React.js, Firebase, Express",
            "inspiration": "With this being the second summer in a row for my younger brother's buisness, he asked me to create a way so that people can order ahead of time.",
            "image": snowcones,
            "css": 'bkwhite',
            "status" : "Finished",
            "bkcolor": 'white',
            "github": "https://github.com/Ashwin-T/Snow-Cones-At-Home",
            "link": "https://at-home-snow-cones.herokuapp.com/"
        },
        {
            "title": "Poll Taker",
            "about": "A live poll taking session that allows for the presenter to get live feedback as they present",
            "stack": "React.js, Firebase 9",
            "inspiration": "A simple live poll taking website created to be able to get live feedback from the Advanced Web Dev class that I teach",
            "image": polltaker,
            "css": 'bkwhite',
            "status" : "Finished",
            "bkcolor": 'white',
            "github": "https://github.com/Ashwin-T/Poll-Taker",
            "link": "https://ashwin-t.github.io/Poll-Taker/"
        },
        {
            "title": "ToDo19",
            "about": "A To Do App linked to your google account to keep you organized! Easily add or delete To-Dos from any device.",
            "stack": "React.js, Node.js, Express, Firebase",
            "inspiration": "As I use multiple devices and often become unorganized, ToDo19 helps me stay on track. It was also a project to further my react and css skills",
            "image": todo19,
            "css": 'bkblack',
            "status" : "Finished",
            "bkcolor": 'black',
            "github": "https://github.com/Ashwin-T/To-Do-19",
            "link": "https://to-do-19.herokuapp.com/"
    
        },
        {
            "title": "The Snowball Effect",
            "about": "A game about the snowball effect. The player controls a snowball and must avoid the yellow snow and avoid melting or getting to small.",
            "stack": "Java",
            "inspiration": "A small game written in Java. Created to inspire younger children that I teach by showing them what Computer Science can create as well as to practice game development strategies.",
            "image": snowball,
            "css": 'bkwhite',
            "status" : "Finished",
            "bkcolor": 'white',
            "github": "https://github.com/Ashwin-T/The-Snowball-Effect",
            "link": "None"
        },
        {
            "title": "Alien Invasion",
            "about": "Navigate through the universe and shoot down the aliens and avoid flying asteroids! Play levels or infinite mode!",
            "stack": "Java",
            "inspiration": "A fun Java Graphics Project that I worked on as a Final Project for my AP CS class.",
            "image": spaceShip,
            "css": 'bkwhite',
            "status" : "Finished",
            "bkcolor": 'white',
            "github": "https://github.com/Ashwin-T/Alien-Invasion-Game",
            "link": "None"
        },
        {
            "title": "Holiday Animation",
            "about": "Watch Santa dash thought he snow and watch the lights flash as he passes your house!",
            "stack": "Java",
            "inspiration": "With the christamas and other being around the corner, I made a simple animation of a winter themed landscape!",
            "image": holanim,
            "css": 'bkwhite',
            "status" : "Finished",
            "bkcolor": 'white',
            "github": "https://github.com/Ashwin-T/Holiday-Animation",
            "link": "None"
        }
    ]

    
    return (
        <>
            <div className = 'otherProjectsContainer flexbox column'>
                <div className="flexbox" id = '#projects'>
                    <HashLink className = 'backArrow' smooth to = '/#projects'><BsArrowLeftSquare /></HashLink>
                </div>
                <div className = 'flexbox column center'> 
                    <h1>Other Projects I Have Worked On</h1>
                    <br />
                    <div className='flexbox space-between marginz'>
                        {otherProjectData.map((project: any, index: number) => {
                            return (
                                <HashLink key = {index} smooth to = '/other-projects/#projectDisplay' onClick = {()=>{setProject(project)}}className='flexbox column center'>
                                    <ProjectOutline project = {project}/>
                                </HashLink>
                            ) 
                        })}
                    
                    </div>
                    {(project !== tempData) && <ProjectModal project = {project}/>}        
                    <br />
                </div>          
            </div>

        </>
    )
}
