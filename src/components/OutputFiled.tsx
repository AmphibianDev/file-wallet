import { useEffect, useRef, useCallback } from 'react';
import { MdContentCopy, MdQrCode } from 'react-icons/md';

import MiddleTruncate from './MiddleTruncate';

import useInfoPopupStore from './InfoPopup.store';
import useQRCodeModalStore from './QRCodeModal.store';

import OutputFiledCSS from './OutputFiled.module.css';

type Props = {
  text: string;
  label?: string;
};

const OutputFiled = ({ text, label }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { openPopup } = useInfoPopupStore();
  const { openQRCodeModal } = useQRCodeModalStore();

  const handleQR = () => {
    if (!text) return;

    openQRCodeModal(text);
  };

  const handleCopy = useCallback(() => {
    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        openPopup('copied', 'success', 1000);
      })
      .catch(error => {
        console.error('Failed to copy text: ', error);
        openPopup('failed to copy', 'error', 1000);
      });
  }, [text, openPopup]);

  useEffect(() => {
    const currentSpan = divRef.current;
    const copy = (e: ClipboardEvent) => {
      e.preventDefault();
      handleCopy();
    };

    currentSpan?.addEventListener('copy', copy);
    return () => {
      currentSpan?.removeEventListener('copy', copy);
    };
  }, [handleCopy]);

  return (
    <div className={OutputFiledCSS.container}>
      {label && <label className={OutputFiledCSS.label}>{label}</label>}
      <div ref={divRef} className={OutputFiledCSS.box}>
        <MiddleTruncate
          className={OutputFiledCSS.text}
          maxChars={14}
          text={text}
        />
        <div className={OutputFiledCSS.buttons}>
          <button aria-label={`show ${label} QR code`} onClick={handleQR}>
            <MdQrCode />
          </button>
          <button aria-label={`Copy ${label}`} onClick={handleCopy}>
            <MdContentCopy />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutputFiled;
