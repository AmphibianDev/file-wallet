import { useState, useEffect, useRef } from 'react';
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
    toggleFlag, //for forced re-render
  } = useInfoPopupStore();

  const [closing, setClosing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setClosing(false);

      timerRef.current = setTimeout(() => {
        setClosing(true);

        setTimeout(() => {
          closePopup();
        }, 300);
      }, closeDelay);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [isOpen, closeDelay, closePopup, toggleFlag]);

  if (!isOpen && !closing) return null;

  return (
    <div
      key={Number(toggleFlag)}
      className={classNames(InfoPopupCSS.popupContainer, {
        [InfoPopupCSS.popupClose || '']: closing,
      })}
    >
      {Icon && <Icon style={{ fill: iconColor }} />}
      <p>{message}</p>
    </div>
  );
};

export default InfoPopup;
