import { useEffect } from 'react';

const scriptPromises: {
  [key: string]: Promise<string>;
} = {}; // Object to track script promises

function ScriptLoader({ onLoaded }: { onLoaded: () => void }) {
  // function to load a single script
  const loadScript = (src: string): Promise<string> => {
    const existingScriptPromise = scriptPromises[src];
    if (existingScriptPromise) {
      return existingScriptPromise;
    }

    const promise = new Promise<string>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      script.async = true;
      script.onload = () => resolve(src);
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });

    scriptPromises[src] = promise;
    return promise;
  };

  useEffect(() => {
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

      onLoaded();
    };

    loadAllScripts().catch(error =>
      console.error('Error loading scripts:', error)
    );
  }, []);

  return null;
}

export default ScriptLoader;
