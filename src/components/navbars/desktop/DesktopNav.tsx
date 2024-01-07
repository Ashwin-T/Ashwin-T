import '../nav.css'
import { FaInfoCircle, FaCode} from 'react-icons/fa'
const DesktopNav = () => {

  const links = [
    { name: 'About', path: '#about', icon: <FaInfoCircle size = {25}/>},
    { name: 'Work', path: '#work', icon: <FaInfoCircle size = {25}/>},
    { name: 'Skills', path: '#skills', icon: <FaCode size = {25}/>},
    { name: 'Projects', path: '#projects', icon: <FaCode size = {25}/>},
  ]

  return (
    <>
      <nav className='desktop-nav' >
        {
          links.map((link, index) => (
              <a href={link.path} key={index} className = 'nav-item'>{link.name}</a>
            ))
        }
      </nav>
    </>
  )
};

export default DesktopNav;