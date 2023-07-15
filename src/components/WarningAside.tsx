import { useState } from 'react';
import { RiInformationLine, RiQuestionnaireFill } from 'react-icons/ri';

import WarningAsideCSS from './WarningAside.module.css';

export const WarningAside = () => {
  const [showWarning, setShowWarning] = useState(
    () => !localStorage.getItem('hideWarning')
  );

  const closeWarning = () => {
    localStorage.setItem('hideWarning', 'true');
    setShowWarning(false);
  };

  return showWarning ? (
    <aside className={WarningAsideCSS.container}>
      <div className={WarningAsideCSS.leftSide}>
        <div className={WarningAsideCSS.iconContainer}>
          <RiInformationLine />
        </div>
        <p className={WarningAsideCSS.text}>
          Use it at your own risk. Checkout{' '}
          <a href="\">
            <RiQuestionnaireFill />
          </a>{' '}
          for more info.
        </p>
      </div>
      <button className={WarningAsideCSS.btn} onClick={closeWarning} />
    </aside>
  ) : null;
};

export default WarningAside;
