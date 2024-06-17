import { create } from 'zustand';

type CryptoState = {
  cryptoName: string;
  bip39Info: Bip39Info | null;
  loading: boolean;

  setCrypto(cryptoName: string): void;

  bipFromFile(fileDataURL: string, password: string): void;
  bipFromMnemonic(mnemonic: string): void;
  bipRandom(): void;
  bipReset(): void;
};

async function generateFromString(str: string) {
  //TODO: Thinking about adding bcrypt for slower but more secure hashing
  const entropy = await window.sha256(str);
  const mnemonic = window.getMnemonicFromEntropy(entropy);
  return window.generateFromMnemonic(mnemonic);
}

const useCryptoStore = create<CryptoState>(set => ({
  cryptoName: 'BTC - Bitcoin',
  bip39Info: null,
  loading: false,

  setCrypto: cryptoName => {
    window.setCrypto(cryptoName);
    set({ cryptoName, bip39Info: null });
  },

  bipFromFile: (fileDataURL, password) => {
    // TODO: Decide if I want remove the file type (data:image/png;base64,)
    // const urlWithoutFileType = fileDataURL.slice(fileDataURL.indexOf(',') + 1);

    set({ loading: true });
    generateFromString(fileDataURL + password)
      .then(bip39Info => {
        set({ bip39Info, loading: false });
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
    set({ loading: true });

    const array = new Uint32Array(100);
    crypto.getRandomValues(array);

    let randomStr = Math.random().toString().slice(2);
    for (const num of array) {
      randomStr += num;
    }

    generateFromString(randomStr)
      .then(bip39Info => {
        set({ bip39Info, loading: false });
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
