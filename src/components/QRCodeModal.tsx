import { Dialog } from '@headlessui/react';
import { QRCodeCanvas } from 'qrcode.react';

import Modal from './Modal';
import useQRCodeModalStore from './QRCodeModal.store';

const QRCodeModal = () => {
  const { isOpen, message, closeQRCodeModal } = useQRCodeModalStore();

  const rootStyle = getComputedStyle(document.documentElement);
  const fgColor = rootStyle.getPropertyValue('--color-text').trim();
  const bgColor = rootStyle.getPropertyValue('--color-background').trim();

  return (
    <Modal open={isOpen} onClose={closeQRCodeModal}>
      <Dialog.Title className="sr-only">QR Code Modal</Dialog.Title>
      <QRCodeCanvas
        value={message}
        size={256}
        fgColor={fgColor}
        bgColor={bgColor}
      />
    </Modal>
  );
};

export default QRCodeModal;
