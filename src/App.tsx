import React from 'react';
import {Navbar} from './components/Navbar';
import {Home} from './pages/Home';



const App: React.FC = ()=>{
  return (
    <div className="App">
      <Navbar />
      <Home />
    </div>
  );
}

export default App;
