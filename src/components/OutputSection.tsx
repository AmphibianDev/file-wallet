import classNames from 'classnames';

import MnemonicFiled from './MnemonicFiled';

import InputSectionCSS from './InputSection.module.css';
import OutputSectionCSS from './OutputSection.module.css';

const OutputSection = ({ className }: { className?: string }) => {
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
      <div className={OutputSectionCSS.container}>
        <MnemonicFiled bip39="alcohol tattoo ancient ocean olympic nothing expect bind small message sugar charge ankle mango swift drink pink shrug evolve rare record flat okay medal" />
      </div>
    </section>
  );
};

export default OutputSection;
