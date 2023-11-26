import { useState, useEffect, useRef } from 'react';

function ScriptLoader({ onLoaded }: { onLoaded: () => void }) {
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

    const parallelScripts = [
      'bip39/bip39-libs.js', // This needs to be before sequential scripts
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
      'bip39/monero.js',
      'bip39/sha3.js',
    ];

    const sequentialScripts = [
      'bip39/bitcoinjs-extensions.js',
      'bip39/segwit-parameters.js',
      'bip39/index.js',
    ];

    const loadAllScripts = async () => {
      // Load all parallel scripts and wait for them to finish
      await Promise.all(parallelScripts.map(src => loadScript(src)));

      // After all parallel scripts are loaded, load sequential scripts
      for (const src of sequentialScripts) {
        await loadScript(src);
      }

      setIsLoaded(true);
    };

    loadAllScripts().catch(error =>
      console.error('Error loading scripts:', error)
    );
  }, []);

  useEffect(() => {
    if (isLoaded) {
      onLoaded();
    }
  }, [isLoaded, onLoaded]);

  return null;
}

export default ScriptLoader;
