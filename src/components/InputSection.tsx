import { useEffect, useState, useCallback, useRef } from 'react';
import classNames from 'classnames';

import InputField from './InputField';
import CryptoBtn from './CryptoBtn';
import DropZone from './DropZone';
import TextZone from './TextZone';

import useCryptoStore from './Crypto.store';

import InputSectionCSS from './InputSection.module.css';

const InputSection = ({ className }: { className?: string }) => {
  const { cryptoName, bipFromFile, bipFromMnemonic, bipRandom, bipReset } =
    useCryptoStore();

  const [activeTab, setActiveTab] = useState<'file' | 'seed'>('file');
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');

  // reset when switching tabs
  useEffect(() => {
    setFileData(null);
    setPassword('');
    setMnemonic('');

    bipReset();
  }, [activeTab, bipReset]);

  // memoize and use ref to avoid missing dependencies for useEffect below
  const memoGenerateBip = useCallback(() => {
    if (fileData) bipFromFile(fileData.dataUrl, password);
    if (mnemonic) bipFromMnemonic(mnemonic);
  }, [fileData, password, mnemonic, bipFromFile, bipFromMnemonic]);

  const memoGenerateRef = useRef(memoGenerateBip);
  useEffect(() => {
    memoGenerateRef.current = memoGenerateBip;
  }, [memoGenerateBip]);

  // instant for fileData and cryptoName
  useEffect(() => {
    memoGenerateRef.current();
  }, [fileData, cryptoName]);

  // debounce for mnemonic and password input
  useEffect(() => {
    const handler = setTimeout(() => {
      memoGenerateRef.current();
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [mnemonic, password]);

  // for WAI-ARIA convention
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        setActiveTab('file');
        break;
      case 'ArrowRight':
        setActiveTab('seed');
        break;
      default:
        break;
    }
  };

  return (
    <section className={className}>
      <div
        role="tablist"
        className={InputSectionCSS.tabs}
        onKeyDown={handleKeyDown}
      >
        <button
          role="tab"
          id="file-tab"
          aria-controls="file-panel"
          aria-selected={activeTab === 'file'}
          onClick={() => setActiveTab('file')}
          className={classNames(
            InputSectionCSS.tab,
            InputSectionCSS.leftTab,
            InputSectionCSS.interactiveTab
          )}
        >
          <h2>File</h2>
        </button>
        <button
          role="tab"
          id="seed-tab"
          aria-controls="seed-panel"
          aria-selected={activeTab === 'seed'}
          onClick={() => setActiveTab('seed')}
          className={classNames(
            InputSectionCSS.tab,
            InputSectionCSS.rightTab,
            InputSectionCSS.interactiveTab
          )}
        >
          <h2>Seed</h2>
        </button>
      </div>
      <div>
        <div
          role="tabpanel"
          id="file-panel"
          aria-labelledby="file-tab"
          hidden={activeTab !== 'file'}
          className={InputSectionCSS.container}
        >
          <CryptoBtn cryptoName={cryptoName} />
          <InputField
            type="password"
            placeholder="Optional password.."
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          <DropZone file={fileData} onChange={setFileData} />
        </div>
        <div
          role="tabpanel"
          id="seed-panel"
          aria-labelledby="seed-tab"
          hidden={activeTab !== 'seed'}
          className={InputSectionCSS.container}
        >
          <CryptoBtn cryptoName={cryptoName} />
          <button className={InputSectionCSS.randomBtn} onClick={bipRandom}>
            Random
          </button>
          <TextZone value={mnemonic} onChange={setMnemonic} />
        </div>
      </div>
    </section>
  );
};

export default InputSection;
