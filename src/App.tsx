import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import FAQ from './components/FAQ';
import InfoPopup from './components/InfoPopup';
import QRCodeModal from './components/QRCodeModal';
import LoadingScreen from './components/LoadingScreen';
import ScriptLoader from './components/ScriptLoader';

import AppCSS from './App.module.css';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div>
      <ScriptLoader onLoaded={() => setIsLoaded(true)} />
      <LoadingScreen isDone={isLoaded} />
      {isLoaded && (
        <div className={AppCSS.container}>
          <InfoPopup />
          <QRCodeModal />
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;
