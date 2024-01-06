import './footer.css'
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {

  const links = [
    {
      name: 'Github',
      link: 'https://github.com/Ashwin-T',
      icon: <FaGithub size={35} />
    },
    {
      name: 'LinkedIn',
      link: 'https://www.linkedin.com/in/ashwin-talwalkar/',
      icon: <FaLinkedin size={35}  />
    },
    {
      name: 'Instagram',
      link: 'https://www.instagram.com/ashwintalwalkar/',
      icon: <FaInstagram size={35}  />
    }
  ];

  return (
    <footer id = "contact">
      <h2>Contact Me</h2>
      {links.map((link, index) => (
        <a key={index} href={link.link} target="_blank" style = {{color: 'white', margin: 'auto 0.75rem'}}>
          {link.icon}
        </a>
      ))}        
      <p>+1(425)892-0645 | atalwalkar719@gmail.com</p>
      <p>Developed By Ashwin Talwalkar</p>
      <p>Last update was on 01/01/2023 - v3.0</p>
      <p className = 'trademark'>&copy; 2023 Ashwin Talwalkar. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
