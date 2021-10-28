import React, {useEffect, useRef} from 'react';
import {Navbar} from './components/Navbar';
// import {Footer} from './components/Footer';
import {Home} from './pages/Home';
import {About} from './pages/About';
import {Skills} from './pages/Skills';
import {AboutPanel} from './pages/AboutPanel';

import {AnimatePresence} from 'framer-motion'
import {Switch, Route, useLocation} from 'react-router-dom'


const App: React.FC = ()=>{

  interface LocationState {
    from: {
      pathname: string;
    };
  }

  let location = useLocation<LocationState>();


  const ref = useRef(true);

    useEffect(()=>{
  
      setTimeout(()=>{
          ref.current = false;
      }, 5000)

    }, [])


  return (
    <div className="App">
        <AnimatePresence>
          <Switch location = {location} key = {location.key}>
            <Route exact path = '/'>
              <Navbar anim = {ref}/>
              <Home anim = {ref}/>
              <About />
              <Skills />
              {/* <Footer /> */}
            </Route>
            <Route exact path = '/aboutme'>
                <AboutPanel /> 
            </Route>
          </Switch>
        </AnimatePresence>  
      </div>
  );
}

export default App;
