import React, {useEffect, useRef} from 'react';
import {Navbar} from './components/Navbar';
// import {Footer} from './components/Footer';
import {Home} from './pages/Home';
import {About} from './pages/About';
import {Skills} from './pages/Skills';
import {AboutPanel} from './pages/AboutPanel';
import { Projects } from './pages/Projects';

import {HashRouter} from 'react-router-dom';
import {Switch, Route} from 'react-router-dom'


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
        <HashRouter>
          <Switch>
            <Route exact path = '/'>
              <Navbar anim = {ref}/>
              <Home anim = {ref}/>
              <About />
              <Skills />
            </Route>
            <Route path = '/aboutme'>
              <AboutPanel />
            </Route>
          </Switch>
        </HashRouter>
    </div>
  );
}


export default App;
