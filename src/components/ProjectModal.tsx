import {BsGithub} from 'react-icons/bs'
import {BiLink, BiUnlink} from 'react-icons/bi'
import { useHistory } from 'react-router-dom'

export const ProjectModal: React.FC<{project: any}> = ({project})=>{
    let history = useHistory();
    const handleClick = (url :string) => {
        if(url.includes('https')){
            window.open(url, "_blank");
        }
        else{
            history.push(url);
        }
    }
    const imgcss =  `projectModalIMG ${project.css}`
    return(
        <div id = 'projectDisplay'>
            <br />
            <div className = 'projectModal flexbox row center' >
                <div className = 'flexbox column center'>
                    <img className = {imgcss} src = {project.image} alt = 'project'/>
                </div>
                <div className = 'flexbox center column projectContent'>
                    <br />
                    <h1>{project.title}</h1>
                    <br />
                    <p>{project.about}</p>
                    <br />
                    <p>{project.inspiration}</p>
                    <br />
                    <p>Status: {project.status}</p>
                    <br />
                    <p className = 'flexbox icons'>
                    {project.github !== "None" ?
                        <span className = 'iconsChild'>
                            <BsGithub className = 'iconz' onClick = {()=>handleClick(project.github)} size = '25'/> 
                        </span>: null}
                        <span className = 'iconsChild'>
                            {project.link !== "None" ? <BiLink className = 'iconz' onClick = {()=>handleClick(project.link)} size = '25'/> : <BiUnlink size = '25'/>}
                        </span>
                    </p>
                    <br />
                    <p>{project.stack}</p>

                </div>
            </div>
        </div>
    )
}
