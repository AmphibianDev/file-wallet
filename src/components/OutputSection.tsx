import classNames from 'classnames';

import MnemonicFiled from './MnemonicFiled';
import OutputFiled from './OutputFiled';

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
        <OutputFiled
          label="Address"
          text="454702e26c64d928a489deb6f8df944c92b7d51d6b632c774547acfa190c540d"
        />
      </div>
    </section>
  );
};

export default OutputSection;
