import { create } from 'zustand';

type FileData = {
  dataUrl: string;
  name: string;
};

type CryptoState = {
  cryptoName: string;
  bip39Info: Bip39Info | null;
  setCrypto(cryptoName: string): void;

  fileData: FileData | null;
  password: string;
  mnemonic: string;

  setFileData(fileData: FileData): void;
  setPassword(password: string): void;
  setMnemonic(mnemonic: string): void;

  setRandom(): void;
};

async function generateFromString(str: string) {
  const entropy = await window.sha256(str);
  const mnemonic = window.getMnemonicFromEntropy(entropy);
  return window.generateFromMnemonic(mnemonic);
}

const useCryptoStore = create<CryptoState>((set, get) => ({
  cryptoName: 'BTC - Bitcoin',
  bip39Info: null,

  fileData: null,
  password: '',
  mnemonic: '',

  setCrypto: cryptoName => {
    window.setCrypto(cryptoName);

    // Regenerate bip39Info if inputFileData or inputMnemonic is set
    const inputFileData = get().fileData;
    const inputMnemonic = get().mnemonic;
    if (inputFileData) get().setFileData(inputFileData);
    else if (inputMnemonic) get().setMnemonic(inputMnemonic);

    set({ cryptoName });
  },

  setFileData: fileData => {
    // TODO: Decide if I want remove the file type from the dataUrl
    generateFromString(fileData.dataUrl + get().password)
      .then(bip39Info => {
        set({ mnemonic: '', bip39Info, fileData: fileData });
      })
      .catch(err => {
        console.log(err);
      });
  },

  setPassword: password => {
    const { fileData: inputFileData } = get();
    if (!inputFileData) return;

    generateFromString(inputFileData.dataUrl + get().password)
      .then(bip39Info => {
        set({ mnemonic: '', bip39Info, password: password });
      })
      .catch(err => {
        console.log(err);
      });
  },

  setMnemonic: mnemonic => {
    const bip39Info = window.generateFromMnemonic(mnemonic);
    set({ fileData: null, password: '', bip39Info, mnemonic: mnemonic });
  },

  setRandom: () => {
    // TODO: Add more randomness
    const array = new Uint32Array(10);
    crypto.getRandomValues(array);

    let str = '';
    for (const num of array) {
      str += num;
    }

    generateFromString(str)
      .then(bip39Info => {
        set({ fileData: null, password: '', bip39Info, mnemonic: '' });
      })
      .catch(err => {
        console.log(err);
      });
  },
}));

export default useCryptoStore;
