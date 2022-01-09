import React, {useEffect, useRef} from 'react';
import {Navbar} from './components/Navbar';
// import {Footer} from './components/Footer';
import {Home} from './pages/Home';
import {About} from './pages/About';
import {Skills} from './pages/Skills';
import {AboutPanel} from './pages/AboutPanel';
import { Projects } from './pages/Projects';
import { DevLogPanel } from './pages/DevLogPanel.jsx';
import { Log } from './pages/Log';
import { Post } from './pages/Post.jsx';
import {CantFindPage} from './components/404';

import {Switch, Route} from 'react-router-dom'
import { AnimatePresence } from 'framer-motion';
import { Footer } from './components/Footer';

const App: React.FC = ()=>{

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
              <Footer />
            </Route>
            <Route exact path = '/aboutme'>
              <AboutPanel />
            </Route>
            <Route exact path = '/logs'>
              <DevLogPanel />
            </Route>
            <Route exact path = '/logs/:id'>
              <Log />
            </Route>
            <Route exact path = '/post'>
              <Post />
            </Route>
            <Route path = "">
              <CantFindPage />
            </Route>
          </Switch>
        </AnimatePresence>
    </div>
  );
}


export default App;
