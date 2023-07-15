import classNames from 'classnames';

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
      <div className={OutputSectionCSS.container}>Content</div>
    </section>
  );
};

export default OutputSection;
