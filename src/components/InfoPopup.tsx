import { useEffect, useRef } from 'react';
import classNames from 'classnames';

import useInfoPopupStore from './InfoPopup.store';

import InfoPopupCSS from './InfoPopup.module.css';

const InfoPopup = () => {
  const {
    isOpen,
    message,
    icon: Icon,
    iconColor,
    closeDelay,
    closePopup,
  } = useInfoPopupStore();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        closePopup();
      }, closeDelay);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [isOpen, closeDelay, closePopup]);

  return (
    <div
      className={classNames({
        [InfoPopupCSS.popupContainer || '']: true,
        [InfoPopupCSS.popupVisible || '']: isOpen,
      })}
    >
      {Icon && <Icon style={{ fill: iconColor }} />}
      <p>{message}</p>
    </div>
  );
};

export default InfoPopup;
