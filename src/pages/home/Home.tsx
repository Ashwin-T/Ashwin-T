import './home.css';
import { FaGithub, FaLinkedin, FaInstagram, FaBookmark } from "react-icons/fa";
import WorkCard from '../../components/cards/work/WorkCard';
import ProjectCard from '../../components/cards/project/ProjectCard';
import CopyEmailButton from '../../components/buttons/CopyEmailButton';

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
      image: '/images/luminys-logo.png', // You'll need to add this logo
      title: 'Software Engineer Intern @ Luminys Corp',
      date: 'June 2025 - August 2025',
      description: "Engineered a CRM-database integration system using Python and PostgreSQL, implementing batch and real-time processing to synchronize customer data and streamline business operations. Developed an Android shipping application used by warehouse workers to streamline operations, reducing preparation time and improving shipping efficiency with features including barcode scanning, real-time inventory management, and automated UPS tracking. Developed an internal API gateway with role-based authentication system, enabling secure access control and streamlined API management across multiple internal services."
    },
    {
      image: '/images/plume-logo.png',
      title: 'Software Engineer Intern @ Plume Design Inc',
      date: 'May 2024 - September 2024',
      description: "Implemented simulated annealing algorithms to optimize Hidden Markov Model parameters, resulting in 5% increased model accuracy and validated convergence to optimal parameters. Engineered an automated Spark job using Databricks to efficiently process and transform data from Kafka streams. Created a Dash application for visualizing and analyzing Quality of Experience (QoE) and WiFi metrics, enabling the identification of discrepancies in large datasets for a proof of concept."
    },
    {
      image: '/images/plume-logo.png',
      title: 'Software Engineer Intern @ Plume Design Inc',
      date: 'June 2023 - September 2023',
      description: "Established a data collection pipeline to build a Hidden Markov Model within a Plume Labs team. Developed software for Raspberry Pis to improve data acquisition, including MQTT message processing and Bluetooth Low Energy data handling. Employed AWS (Kinesis, ElastiCache, IoT Core, S3) and Apache Flink to perform real-time analysis, processing, transformation, and storage of training and ground truth data."
    }
  ];

  const allSkills = [
    // Languages
    { category: 'Languages', name: 'JavaScript', logo: 'images/javascript_logo.png' },
    { category: 'Languages', name: 'TypeScript', logo: 'images/typescript_logo.svg' },
    { category: 'Languages', name: 'Java', logo: 'images/java_logo.png' },
    { category: 'Languages', name: 'Python', logo: 'images/python_logo.png' },
    { category: 'Languages', name: 'C', logo: 'images/c_logo.png' },
    { category: 'Languages', name: 'R', logo: 'images/r_logo.png' },
    
    // Frontend/Mobile
    { category: 'Frontend', name: 'React / React Native', logo: 'images/react_logo.svg' },
    
    // Backend/Frameworks
    { category: 'Backend', name: 'Node.js', logo: 'images/node_logo.png' },
    { category: 'Backend', name: 'Flask', logo: 'images/flask_logo.png' },
    { category: 'Backend', name: 'FastAPI', logo: 'images/fastapi_logo.png' },
    { category: 'Backend', name: 'Express', logo: 'images/express_logo.png' },
    { category: 'Backend', name: 'Spring MVC', logo: 'images/spring_logo.png' },
    
    // Cloud & Infrastructure
    { category: 'Cloud', name: 'AWS', logo: 'images/aws_logo.png' },
    { category: 'Cloud', name: 'Google Cloud', logo: 'images/google_cloud_logo.png' },
    { category: 'Cloud', name: 'Firebase', logo: 'images/firebase_logo.png' },
    { category: 'Cloud', name: 'Docker', logo: 'images/docker_logo.png' },
    
    // Data & Analytics
    { category: 'Data', name: 'Apache Spark', logo: 'images/spark_logo.png' },
    { category: 'Data', name: 'Apache Kafka', logo: 'images/kafka_logo.png' },
    { category: 'Data', name: 'Databricks', logo: 'images/databricks_logo.png' },
    { category: 'Data', name: 'Redis', logo: 'images/redis_logo.png' },
    { category: 'Data', name: 'PostgreSQL', logo: 'images/postgresql_logo.png' },
    
    // Hardware/IoT
    { category: 'Hardware', name: 'Raspberry Pi', logo: 'images/rpi_logo.png' },
    { category: 'Hardware', name: 'Arduino', logo: 'images/ard_logo.png' },
    
    // Tools
    { category: 'Tools', name: 'Git / Github', logo: 'images/github_logo.png' },
    { category: 'Tools', name: 'Apache Maven', logo: 'images/maven_logo.svg' }
  ];

  const projects = [
    {
      "name": "Beluga",
      "description": "React Native, Python, FastAPI, ChromaDB, Redis",
      "image": "images/beluga_logo.png", // You'll need to add this image
      "link": "https://github.com/Ashwin-T/Beluga", // Update with actual demo link
      "github": "https://github.com/Ashwin-T/Beluga",
      "timeline": "November 2024 – Present",
      "borderColor": '#4A90E2',
      "backgroundColor": "white",
      "highlights": "Multi-media knowledge system enabling natural language search across documents, photos, and calendar data. Full-stack app featuring React Native frontend, FastAPI backend, ChromaDB vector storage, and Redis Queue. Extended from RetroSpecs project and represents the evolution of AI-powered personal assistance technology."
    },
    {
      "name": "RetroSpecs",
      "description": "React.js, Flask, ChromaDB, OpenAI, OpenCV, Raspberry Pi",
      "image": "images/retrospecs_logo.png",
      "link": "https://github.com/RetroSpecs-Suite",
      "github": "https://github.com/RetroSpecs-Suite",
      "timeline": "November 2024",
      "borderColor": '#FFD700',
      "backgroundColor": "white",
      "highlights": "🏆 1st Place Winner at CheeseHacks 2024 among 42 projects. Revolutionary smart glasses system that helps individuals with Alzheimer's maintain independence through AI-powered memory assistance. The system continuously captures daily activities via a device that attaches to glasses and allows natural language querying of experiences. Built with React.js frontend, Flask backend, Raspberry Pi hardware, and leverages OpenAI and ChromaDB for image analysis and retrieval."
    },
    {
      "name": "Hiro",
      "description": "React Native, Typescript, Express, Firebase, AWS, Arduino C, ESP32",
      "image": "images/icon.png",
      "link": "https://apps.apple.com/app/id6475178904",
      "github": "https://github.com/Ashwin-T/Hiro",
      "timeline": "June 2023 – Present",
      "borderColor": 'transparent',
      "backgroundColor": "transparent",
      "highlights": "📱 Published iOS app built with React Native for real-time smart home management. Engineered a RESTful API with TypeScript, Express, and Firebase for data storage and real-time updates. Created autonomous software for Arduino and Raspberry Pis, powering smart picture frames, lights, and mirrors with seamless device-backend communication via AWS IoT Core and MQTT."
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
      "highlights": "Progressive Web App (PWA) created to help incoming freshmen orient themselves on campus using an interactive map with GPS functionality. Developed in collaboration with MVHS Ambassadors to address the challenges of adapting to a new school environment. Successfully reached 774 distinct daily active users, demonstrating significant impact on student orientation."
    }
  ];

  return (
    <>
      <img src="images/rship.png" className="rship" alt="rocketship" />
      <img src="images/rship.png" className="upsidedown-rship" alt="rocketship" />
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
              <CopyEmailButton />
              <p style={{ margin: "0 0.75rem" }}>or</p>
              <button>
                <a href="pdf/ashwin_talwalkar_resume.pdf" target="_blank" style={{ color: 'white' }}>
                  <FaBookmark size={15} /> View Resume
                </a>
              </button>
            </div>
          </div>
          <div className="right">
            <img className='img' src="images/me.jpg" alt="me" />
          </div>
        </div>

        <div className="content">
          <div className="content-bit" id="about">
            <h4>About</h4>
            <p>Hello! I'm Ashwin Talwalkar, a third-year Computer Science student at UW-Madison. I'm passionate about full-stack development, machine learning, and embedded systems, with hands-on experience across the entire technology stack.</p>
            <br />
            <p>As President of the Data Science for Sustainable Development Club, I work with technical teams to build software solutions for nonprofit organizations and UW-Madison's Office of Sustainability. I also enjoy participating in hackathons - recently took part in CheeseHacks 2024 where my team and I won first place.</p>
            <br />
            <p>Born and raised in the Bay Area, I'm always interested in the latest tech innovations and actively studying to be part of the industry. Outside of school, I enjoy reading Calvin and Hobbes, playing sports, lifting weights, and learning new life skills.</p>
          </div>

          <div className="content-bit" id="current">
            <h4>Currently</h4>
            <p>At the moment, I am President for <a href='https://madison.dssdglobal.org/' target="_blank" style={{ 'color': 'green' }}>Data Science for Sustainable Development</a>: A club that creates software tools for nonprofit organizations.</p>
            <br />
            <p>I'm also taking 14 credits in my final semester, focusing on coursework in Operating Systems and Software Engineering. Currently seeking exciting full time opportunities for Spring 2026.</p>
          </div>

          <div className="content-bit" id="work">
            <h4>Work Experience</h4>
            <div className="workEx">
              {workData.map((work, index) => (
                <WorkCard key={index} work={work} />
              ))}
            </div>
          </div>

          <div className="content-bit" id="skills">
            <h4>Technical Skills</h4>
            <div className="skills">
              {allSkills.map((skill, index) => (
                <div className="skill" key={index}>
                  <img src={skill.logo} alt={skill.name} />
                  <p>{skill.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="content-bit" id="projects">
            <h4>Projects</h4>
            <div className="projects">
              {projects.map((project, index) => {
                return (
                  <ProjectCard key={index} project={project} />
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;