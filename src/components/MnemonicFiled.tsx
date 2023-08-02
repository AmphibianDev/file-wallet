import { useState, useEffect, useRef, useCallback } from 'react';
import { MdContentCopy, MdQrCode } from 'react-icons/md';
import { Switch } from '@headlessui/react';

import useInfoPopupStore from './InfoPopup.store';
import MnemonicFiledCSS from './MnemonicFiled.module.css';

type Props = {
  bip39: string;
  xmr?: string;
};

const MnemonicFiled = ({ bip39, xmr }: Props) => {
  const [isXMR, setIsXMR] = useState(Boolean(xmr));
  useEffect(() => {
    setIsXMR(Boolean(xmr));
  }, [xmr]);

  const { openPopup } = useInfoPopupStore();
  const handleCopy = useCallback(() => {
    const value = isXMR ? xmr : bip39;
    if (!value) return;

    navigator.clipboard
      .writeText(value)
      .then(() => {
        openPopup('copied', 'success', 1000);
      })
      .catch(error => {
        console.error('Failed to copy text: ', error);
        openPopup('failed to copy', 'error', 1000);
      });
  }, [isXMR, bip39, xmr, openPopup]);

  const spanRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const currentSpan = spanRef.current;
    const copy = (e: ClipboardEvent) => {
      e.preventDefault();
      handleCopy();
    };

    currentSpan?.addEventListener('copy', copy);
    return () => {
      currentSpan?.removeEventListener('copy', copy);
    };
  }, [handleCopy]);

  const handleQR = () => {
    const value = isXMR ? xmr : bip39;
    if (!value) return;

    //...
  };

  return (
    <div className={MnemonicFiledCSS.container}>
      <header>
        <label className={MnemonicFiledCSS.label}>Mnemonic Seed</label>
        {xmr && (
          <Switch
            className={MnemonicFiledCSS.switch}
            checked={isXMR}
            onChange={setIsXMR}
          >
            <span className="sr-only">
              {isXMR ? 'show bip39 mnemonic' : 'show xmr mnemonic'}
            </span>
            <span className={MnemonicFiledCSS.xmr}>XMR</span>
            <span className={MnemonicFiledCSS.bip}>BIP</span>
          </Switch>
        )}
      </header>
      <section className={MnemonicFiledCSS.box}>
        <span ref={spanRef} className={MnemonicFiledCSS.text}>
          {isXMR ? xmr : bip39}
        </span>
        <div className={MnemonicFiledCSS.buttons}>
          <button
            className={MnemonicFiledCSS.btn}
            aria-label="show QR code"
            onClick={handleQR}
          >
            <MdQrCode />
          </button>
          <button
            className={MnemonicFiledCSS.btn}
            aria-label="Copy text"
            onClick={handleCopy}
          >
            <MdContentCopy />
          </button>
        </div>
      </section>
    </div>
  );
};

export default MnemonicFiled;
