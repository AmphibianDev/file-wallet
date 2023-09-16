import { useState, useEffect, useRef } from 'react';

import { Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import FAQ from './components/FAQ';
import InfoPopup from './components/InfoPopup';
import QRCodeModal from './components/QRCodeModal';

import AppCSS from './App.module.css';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const scriptsLoadedRef = useRef(false); // for stopping running twice because of React.StrictMode

  useEffect(() => {
    if (scriptsLoadedRef.current) return;
    scriptsLoadedRef.current = true;

    // function to load a single script
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    // list of scripts to load
    const scripts = [
      'bip39/bip39-libs.js',
      'bip39/bitcoinjs-extensions.js',
      'bip39/segwit-parameters.js',
      'bip39/ripple-util.js',
      'bip39/jingtum-util.js',
      'bip39/casinocoin-util.js',
      'bip39/cosmos-util.js',
      'bip39/eos-util.js',
      'bip39/fio-util.js',
      'bip39/xwc-util.js',
      'bip39/sjcl-bip39.js',
      'bip39/wordlist_english.js',
      'bip39/wordlist_japanese.js',
      'bip39/wordlist_spanish.js',
      'bip39/wordlist_chinese_simplified.js',
      'bip39/wordlist_chinese_traditional.js',
      'bip39/wordlist_french.js',
      'bip39/wordlist_italian.js',
      'bip39/wordlist_korean.js',
      'bip39/wordlist_czech.js',
      'bip39/wordlist_portuguese.js',
      'bip39/jsbip39.js',
      'bip39/entropy.js',
      'bip39/index.js',
    ];

    // function to load all scripts
    const loadAllScripts = async () => {
      for (const src of scripts) {
        // console.log("loading script", src);
        await loadScript(src);
      }
      setIsLoaded(true);
    };

    // start loading all scripts
    loadAllScripts().catch(error => {
      console.error('Error loading scripts:', error);
    });
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>; // Your loading screen here
  }

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
