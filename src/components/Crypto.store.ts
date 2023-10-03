import { create } from 'zustand';

type CryptoState = {
  cryptoName: string;
  bip39Info: Bip39Info | null;
  setCrypto(cryptoName: string): void;

  bipFromFile(fileDataURL: string, password: string): void;
  bipFromMnemonic(mnemonic: string): void;
  bipRandom(): void;
  bipReset(): void;
};

async function generateFromString(str: string) {
  const entropy = await window.sha256(str);
  const mnemonic = window.getMnemonicFromEntropy(entropy);
  return window.generateFromMnemonic(mnemonic);
}

const useCryptoStore = create<CryptoState>(set => ({
  cryptoName: 'BTC - Bitcoin',
  bip39Info: null,

  setCrypto: cryptoName => {
    window.setCrypto(cryptoName);
    set({ cryptoName, bip39Info: null });
  },

  bipFromFile: (fileDataURL, password) => {
    // TODO: Decide if I want remove the file type from the dataUrl
    generateFromString(fileDataURL + password)
      .then(bip39Info => {
        set({ bip39Info });
      })
      .catch(err => {
        console.log(err);
      });
  },

  bipFromMnemonic: (mnemonic: string) => {
    const bip39Info = window.generateFromMnemonic(mnemonic);
    set({ bip39Info });
  },

  bipRandom: () => {
    // TODO: Add more randomness
    const array = new Uint32Array(10);
    crypto.getRandomValues(array);

    let str = '';
    for (const num of array) {
      str += num;
    }

    generateFromString(str)
      .then(bip39Info => {
        set({ bip39Info });
      })
      .catch(err => {
        console.log(err);
      });
  },

  bipReset: () => {
    set({ bip39Info: null });
  },
}));

export default useCryptoStore;
