import React, {useEffect, useRef} from 'react';
import {Navbar} from './components/Navbar';
// import {Footer} from './components/Footer';
import {Home} from './pages/Home';
import {About} from './pages/About';
import {Skills} from './pages/Skills';
import {AboutPanel} from './pages/AboutPanel';
import { Projects } from './pages/Projects';

import {Switch, Route} from 'react-router-dom'
import { AnimatePresence } from 'framer-motion';


const App: React.FC = ()=>{

  interface LocationState {
    from: {
      pathname: string;
    };
  }


  const ref = useRef(true);

    useEffect(()=>{
  
      setTimeout(()=>{
          ref.current = false;
      }, 3000)

    }, [])


  return (
    <div className="App">
        <AnimatePresence>
          <Switch>
            <Route exact path = '/'>
              <Navbar anim = {ref}/>
              <Home anim = {ref}/>
              <About />
              <Skills />
              <Projects />
            </Route>
            <Route path = '/aboutme'>
              <AboutPanel />
            </Route>
          </Switch>
        </AnimatePresence>
    </div>
  );
}


export default App;
