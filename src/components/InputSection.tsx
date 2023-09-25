import { useState } from 'react';
import classNames from 'classnames';

import InputField from './InputField';
import CryptoBtn from './CryptoBtn';
import DropZone from './DropZone';
import TextZone from './TextZone';

import useCryptoStore from './Crypto.store';

import InputSectionCSS from './InputSection.module.css';

const InputSection = ({ className }: { className?: string }) => {
  const { cryptoName } = useCryptoStore();

  const [activeTab, setActiveTab] = useState<'file' | 'seed'>('file');

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
          <InputField type="password" placeholder="Optional password.." />
          <DropZone />
        </div>
        <div
          role="tabpanel"
          id="seed-panel"
          aria-labelledby="seed-tab"
          hidden={activeTab !== 'seed'}
          className={InputSectionCSS.container}
        >
          <CryptoBtn cryptoName={cryptoName} />
          <button className={InputSectionCSS.randomBtn}>Random</button>
          <TextZone />
        </div>
      </div>
    </section>
  );
};

export default InputSection;
