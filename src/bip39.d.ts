type FileData = {
  dataUrl: string;
  name: string;
};

interface AddressInfo {
  derivationPath: string;
  address: string;
  privkey: string;
  pubkey: string;
}

interface Bip39Info {
  errorMessage: string;
  bip39Mnemonic: string;
  bip39Seed: string;
  bip39RootKey: string;
  accountExtendedPrvKey: string;
  accountExtendedPubKey: string;
  derivationPath: string;
  wallets: AddressInfo[];
}

interface Window {
  networksNames: string[];
  setCrypto: (cryptoName: string) => boolean;
  sha256: (message: string) => Promise<string>;
  getMnemonicFromEntropy: (entropyStr: string) => string;
  generateFromMnemonic: (
    mnemonic: string,
    numberOfWallets?: number
  ) => Bip39Info;
}
