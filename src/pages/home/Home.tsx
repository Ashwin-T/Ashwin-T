import './home.css';
import { FaGithub, FaLinkedin, FaInstagram, FaCopy, FaBookmark } from "react-icons/fa";
import WorkCard from '../../components/cards/work/WorkCard';
import ProjectCard from '../../components/cards/project/ProjectCard';

const Home = () => {

  const links = [
    {
      name: 'Github',
      link: 'https://github.com/Ashwin-T',
      icon: <FaGithub size={35} style={{ color: "black" }} />
    },
    {
      name: 'LinkedIn',
      link: 'https://www.linkedin.com/in/ashwin-talwalkar/',
      icon: <FaLinkedin size={35} style={{ color: "#0072b1" }} />
    },
    {
      name: 'Instagram',
      link: 'https://www.instagram.com/ashwintalwalkar/',
      icon: <FaInstagram size={35} style={{ color: "#E1306C" }} />
    }
  ];

  const workData = [
    {
      image: '/images/plume-logo.png',
      title: 'Software Intern @ Plume Design Inc',
      date: 'June 2022 - September 2022',
      description: "Developed a data collection pipeline at Plume Labs, enhancing data acquisition for a Hidden Markov Model. Engineered Python programs for Raspberry Pis in order to aquire data via MQTT and Bluetooth data handling. Leveraged AWS products such as Kinesis, S3, Elasticache, and IoT Core as well as Apache Flink for data transformation. Streamlined program management and created data visualizers for debugging."
    }
  ];

  const allSkills =  [
    { category: 'Frontend', name: 'JavaScript', logo: 'images/javascript_logo.png' },
    { category: 'Frontend', name: 'TypeScript', logo: 'images/typescript_logo.svg' },
  
    { category: 'Backend', name: 'Java', logo: 'images/java_logo.png' },
    { category: 'Backend', name: 'Python', logo: 'images/python_logo.png' },
    { category: 'Backend', name: 'C', logo: 'images/c_logo.png' },
    { category: 'Frontend', name: 'React / React Native', logo: 'images/react_logo.svg' },
    { category: 'Backend', name: 'Node', logo: 'images/node_logo.png' },
    { category: 'Backend', name: 'Flask', logo: 'images/flask_logo.png' },
    { category: 'Backend', name: 'Express', logo: 'images/express_logo.png' },
    { category: 'Backend', name: 'Apache Maven', logo: 'images/maven_logo.svg' },

    { category: 'Cloud', name: 'AWS', logo: 'images/aws_logo.png' },
    { category: 'Cloud', name: 'Google Cloud', logo: 'images/google_cloud_logo.png' },
    { category: 'Cloud', name: 'Firebase', logo: 'images/firebase_logo.png' },
    { category: 'Cloud', name: 'Raspberry Pi', logo: 'images/rpi_logo.png' },
    { category: 'Cloud', name: 'Arduino', logo: 'images/ard_logo.png' },
    { category: 'Cloud', name: 'Git / Github', logo: 'images/github_logo.png' },

  ];

  const projects = [
    {
      "name": "Hiro",
      "description": "React Native, Typescript, Express, Firebase, AWS, Arduino C",
      "image": "images/icon.png",
      "link": "https://apps.apple.com/app/id6475178904",
      "github": "https://github.com/Ashwin-T/Hiro",
      "timeline": "June 2023 – Present",
      "borderColor": 'transparent',
      "backgroundColor": "transparent",
      "highlights": "Hiro is an IOS app built with React Native. It was designed to manage custom smart home devices such as smart frames, temperature sensors, smart lights, and more. This is part of a fullstack project that utilizes AWS IoT Core, Firebase, a React Native frontend, and a express backend. It is published on the iOS Apple App Store."
    },
    {
      "name": "Spartan Assistant",
      "description": "React, Firebase, Mapbox",
      "image": "images/SA.034e5d00.png",
      "borderColor": 'var(--text-color-light)',
      "backgroundColor": "transparent",
      "link": "https://the-spartan-assistant.web.app/",
      "github": "https://github.com/Ashwin-T/Spartan-Assistant",
      "timeline": "December 2021 – August 2022",
      "highlights": "A PWA created to help incoming freshmen orient themselves on campus by using an interactive map with GPS functionality and other tools. Due to how hard it is to adapt to a new school, MVHS Ambassadors asked to work with them to create a PWA to help incoming freshmen on campus. Reached a total of 774 distinct daily active users."
    },
    {
      "name": "PRformance",
      "description": "React, Firebase",
      "image": "images/prformance.png",
      "borderColor": 'black',
      "backgroundColor": "black",
      "link": " https://prformance.net/",
      "github": "https://github.com/Ashwin-T/PRformance",
      "timeline": "June 2021 – August 2021",
      "highlights": "PRformance is a specialized Progressive Web App (PWA) designed for athletes, prioritizing self-confidence and community building. This platform helps athletes track their progress and share achievements, fostering a supportive environment for confidence growth."
    }
  ]

  return (
    <>
      <img src = "images/rship.png" className = "rship" alt = "rocketship" />
      <img src = "images/rship.png" className = "upsidedown-rship" alt = "rocketship" />
      <main>
        <div className="enter">
          <div className="left">
            <h1>Ashwin Talwalkar</h1>
            <p style={{ fontSize: "1.1rem", margin: '0.25rem' }}>
              Computer Science @ <a href="https://www.cs.wisc.edu/" target="_blank" className="uw">UW Madison</a>
            </p>
            <div className="flex-inline" style={{ margin: '0.5rem' }}>
              <div className="active-circle" />
              <p>Available for opportunities</p>
            </div>
            <div className="flex-inline">
            {links.map((link, index) => (
              <a key={index} href={link.link} target="_blank" className="link">
                {link.icon}
              </a>
            ))}
          </div>

          <div className="flex-inline">
            <button onClick={() => navigator.clipboard.writeText("atalwalkar719@gmail.com")}>
              <FaCopy size = {15}/> Copy Email
            </button>
            <p style={{ margin: "0 0.75rem" }}>or</p>
            <button>
              <a href = "pdf/Ashwin_s_Resume.pdf" target="_blank" style = {{color: 'white'}}>
              <FaBookmark size={15}/> View Resume
              </a>
            </button>
          </div>
          </div>
          <div className="right">
            <div className="img"></div>
          </div>
        </div>

    
        <div className="content">
          <div className="content-bit" id = "about">
            <h4>About</h4>
            <p>Hello! I'm Ashwin Talwalkar, a second-year Computer Science student at UW-Madison and an aspiring Software Engineer. Whether it's full-stack, machine learning, or embedded devices - I'm passionate about all aspects of software engineering. With an open mind and eagerness to learn, I'm currently on the lookout for exciting internship opportunities for Summer 2023.</p>
            <br/>
            <p>Born and raised in the Bay Area, I am always interested in the tech industry and the latest innovations and activley studying to be a part of it.</p>
            <br/>
            <p>Outside of school, I enjoy reading Calvin and Hobbes, playing sports, lifting weights, and learning new life skills. I'm always looking for new opportunities to grow and learn!<br/></p>
          </div>
          <div className="content-bit" id = "work">
            <h4>Work Experience</h4>
            <div className="workEx">
              {workData.map((work, index) => (
                <WorkCard key={index} work={work} />
              ))}
            </div>
          </div>
          <div className="content-bit" id = "skills">
            <h4>Skills</h4>
            <div className="skills">
              {
                allSkills.map((skill, index) => (
                  <div className="skill" key={index}>
                    <img src={skill.logo} alt={skill.name} />
                    <p>{skill.name}</p>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="content-bit" id = "projects"> 
            <h4>Projects</h4>
            <div className="projects">
              {
                projects.map((project, index) => {
                  return (
                    <ProjectCard key={index} project = {project} />
                  )
                })                  
              }
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
