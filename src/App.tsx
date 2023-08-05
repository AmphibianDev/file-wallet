import { Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import FAQ from './components/FAQ';
import InfoPopup from './components/InfoPopup';
import QRCodeModal from './components/QRCodeModal';

import AppCSS from './App.module.css';

function App() {
  return (
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
  );
}

export default App;
