import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { QRCodeCanvas } from 'qrcode.react';
import classNames from 'classnames';

import useQRCodeModalStore from './QRCodeModal.store';

import QRCodeModalCSS from './QRCodeModal.module.css';

const QRCodeModal = () => {
  const { isOpen, message, closeQRCodeModal } = useQRCodeModalStore();
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      closeQRCodeModal();
    }, 300);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      className={classNames(QRCodeModalCSS.overlay, {
        [QRCodeModalCSS.closing || '']: closing,
      })}
    >
      <Dialog.Panel
        className={classNames(QRCodeModalCSS.panel, {
          [QRCodeModalCSS.closing || '']: closing,
        })}
      >
        <Dialog.Title className="sr-only">QR Code Modal</Dialog.Title>
        <QRCodeCanvas value={message} size={256} level="M" />
        <button
          onClick={close}
          className="x-btn"
          id={QRCodeModalCSS.btn}
        ></button>
      </Dialog.Panel>
    </Dialog>
  );
};

export default QRCodeModal;
