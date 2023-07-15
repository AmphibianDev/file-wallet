import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';

import AppCSS from './App.module.css';

function App() {
  return (
    <div className={AppCSS.container}>
      <NavBar />
      <Home />
      <Footer />
    </div>
  );
}

export default App;
