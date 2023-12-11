import classNames from 'classnames';
import { AiFillCaretDown } from 'react-icons/ai';

import MnemonicFiled from './MnemonicFiled';
import OutputFiled from './OutputFiled';

import useCryptoStore from './Crypto.store';

import InputSectionCSS from './InputSection.module.css';
import OutputSectionCSS from './OutputSection.module.css';

const OutputSection = ({ className }: { className?: string }) => {
  const { bip39Info } = useCryptoStore();

  const waitingJSX = (
    <div className={OutputSectionCSS.middle}>
      <p>
        Waiting For
        <br />
        Input
      </p>
    </div>
  );

  const errorJSX = (errorMessage: string) => {
    return (
      <div tabIndex={0} className={OutputSectionCSS.middle}>
        <p>{errorMessage}</p>
      </div>
    );
  };

  const outJSX = (bip39Info: Bip39Info) => {
    if (!bip39Info.wallets[0]) return null;

    return (
      <>
        <MnemonicFiled
          bip39={bip39Info.bip39Mnemonic}
          xmr={bip39Info.xmrMnemonic}
        />
        <OutputFiled label="Address" text={bip39Info.wallets[0].address} />
        <OutputFiled
          label={bip39Info.xmrMnemonic ? 'Secret View Key' : 'Public Key'}
          text={bip39Info.wallets[0].pubkey}
        />
        <OutputFiled
          label={bip39Info.xmrMnemonic ? 'Secret Spend Key' : 'Private Key '}
          text={bip39Info.wallets[0].privkey}
        />
        <div className={OutputSectionCSS.downArrow}>
          <AiFillCaretDown />
        </div>
        <div className={OutputSectionCSS.advanceContainer}>
          <OutputFiled
            label="Master Public Key"
            text={bip39Info.accountExtendedPubKey}
          />
          <OutputFiled
            label="Master Private Key"
            text={bip39Info.accountExtendedPrvKey}
          />
          <OutputFiled label="Entropy" text={bip39Info.entropy} />
          <OutputFiled label="Bip39 Seed" text={bip39Info.bip39Seed} />
          <OutputFiled label="Bip32 Root Key" text={bip39Info.bip32RootKey} />
        </div>
      </>
    );
  };

  return (
    <section className={className}>
      <div
        className={classNames(
          InputSectionCSS.tab,
          InputSectionCSS.leftTab,
          InputSectionCSS.staticTab
        )}
      >
        <h2>Output</h2>
      </div>
      <div tabIndex={-1} className={OutputSectionCSS.container}>
        {bip39Info === null
          ? waitingJSX
          : bip39Info.errorMessage
          ? errorJSX(bip39Info.errorMessage)
          : outJSX(bip39Info)}
      </div>
    </section>
  );
};

export default OutputSection;
