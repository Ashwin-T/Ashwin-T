import React, {useEffect, useRef, Suspense} from 'react';
import Footer from './components/Footer';
import Home from './pages/Home';
// import {About} from './pages/About';
// import {Skills} from './pages/Skills';
// import {AboutPanel} from './pages/AboutPanel';
// import { Projects } from './pages/Projects';
// import {CantFindPage} from './pages/CantFindPage';
// import {OtherProjects} from './pages/OtherProjects';
import {Switch, Route} from 'react-router-dom'
import { AnimatePresence } from 'framer-motion';

//react lazy
const About = React.lazy(()=> import('./pages/About'));
const AboutPanel = React.lazy(()=>import('./pages/AboutPanel'));
const Skills = React.lazy(()=>import('./pages/Skills'));
const Projects = React.lazy(()=>import('./pages/Projects'));
const CantFindPage = React.lazy(()=> import('./pages/CantFindPage'));
const OtherProjects = React.lazy(()=>import('./pages/OtherProjects'));
const App: React.FC = ()=>{

  const ref = useRef(true);

    useEffect(()=>{
  
      setTimeout(()=>{
          ref.current = false;
      }, 3000)

    }, [])


  return (
    <Suspense fallback = {<></>}>
        <AnimatePresence>
          <Switch>
            <Route exact path = '/'>
              <Home anim = {ref}/>
              <About />
              <Skills />
              <Projects />
              <Footer />
            </Route>
            <Route exact path = '/aboutme'>
              <AboutPanel />
            </Route>
            <Route exact path = '/other-projects'>
              <OtherProjects />
            </Route>
            <Route path = "*">
              <CantFindPage />
            </Route>
          </Switch>
        </AnimatePresence>
    </Suspense>
  );
}


export default App;
