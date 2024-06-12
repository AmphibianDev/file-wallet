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
import WinnerIcon from './components/WinnerIcon';

function App() {
  const isSingleFileBuild = import.meta.env.MODE === 'singleFile';

  const [isLoaded, setIsLoaded] = useState(isSingleFileBuild);

  return (
    <div>
      {!isSingleFileBuild && (
        <ScriptLoader onLoaded={() => setIsLoaded(true)} />
      )}
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
          <WinnerIcon />
        </div>
      )}
    </div>
  );
}

export default App;
