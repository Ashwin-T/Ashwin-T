import React from 'react';
import {Navbar} from './components/Navbar';
import {Home} from './pages/Home';
import {About} from './pages/About';
import {Skills} from './pages/Skills';

import {AnimatePresence} from 'framer-motion'
import {Switch, Route, useLocation} from 'react-router-dom'

const App: React.FC = ()=>{

  interface LocationState {
    from: {
      pathname: string;
    };
  }

  let location = useLocation<LocationState>();

  return (
    <div className="App">
        <AnimatePresence >
          <Switch location = {location} key = {location.key}>
            <Route exact path = '/'>
              <Navbar />
              <Home />
                <About />
                <Skills />
            </Route>
            <Route exact path = '/about'>
                <div>Hello</div>
            </Route>
          </Switch>
        </AnimatePresence>  
      </div>
  );
}

export default App;
