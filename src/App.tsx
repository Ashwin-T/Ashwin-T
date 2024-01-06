import {Routes, Route} from 'react-router-dom';
import Home from './pages/home/Home';
import DesktopNav from './components/navbars/desktop/DesktopNav';
import Footer from './components/footer/Footer';

const App = () => {
  return (
    <>  
      <DesktopNav />
      <Routes>
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;