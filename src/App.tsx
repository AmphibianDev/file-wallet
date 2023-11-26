import { Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import FAQ from './components/FAQ';
import InfoPopup from './components/InfoPopup';
import QRCodeModal from './components/QRCodeModal';
import LoadingScreen from './components/LoadingScreen';

import AppCSS from './App.module.css';
import ScriptsProvider from './components/ScriptsProvider';

function App() {
  return (
    // Shows loading screen while app is in suspense
    <LoadingScreen>
      {/* Suspends until all scripts are loaded */}
      <ScriptsProvider>
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
      </ScriptsProvider>
    </LoadingScreen >
  );
}

export default App;
