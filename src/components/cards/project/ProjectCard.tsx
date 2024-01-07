
import './projectCard.css';
import { FaGithub, FaLink } from 'react-icons/fa';

interface ProjectCard {
  name: string;
  description: string;
  image: string; // Link to portfolio/project image
  link: string; // Link to the project/demo
  github: string; // Link to the project's GitHub repository
  timeline: string;
  highlights: string;
  backgroundColor: string;
  borderColor: string;
}

interface ProjectCardProps {
  project: ProjectCard;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {

  const imgStyle = {backgroundColor: project.backgroundColor, border: `2px solid ${project.borderColor}`} 

  return (
    <div className='project-card'>

      <div className="imgs">
        <img src={project.image} alt={project.name} style={imgStyle}/>
      </div>

      <div className="project-details">
        <h2>{project.name}</h2>
        <p>{project.description}</p>
        <p>Timeline: {project.timeline}</p>
        <p className="highlight">
          {project.highlights}
        </p>
        <div className="project-links">
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            <FaLink size = {15}/> Demo
          </a>
          <a href={project.github} target="_blank" rel="noopener noreferrer" style = {{backgroundColor: 'black'}}>
            <FaGithub size = {15}/> GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
