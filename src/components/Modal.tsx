import { useState, useEffect, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import classNames from 'classnames';

import ModalCSS from './Modal.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

interface CustomPopStateEvent extends PopStateEvent {
  state: {
    isModalOpen?: boolean;
  };
}

const Modal = ({ children, open, onClose }: Props) => {
  const [closing, setClosing] = useState(false);

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);

      const currentState = window.history.state as CustomPopStateEvent['state'];
      if (currentState.isModalOpen) window.history.back();

      onClose();
    }, 300);
  }, [onClose]);

  //make the back arrow to close the modal
  useEffect(() => {
    const onPopState = () => {
      if (open) {
        close();
      }
    };

    if (open) {
      window.history.pushState({ isModalOpen: true }, '');
    }

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [open, close]);

  return (
    <Dialog
      open={open}
      onClose={close}
      className={classNames(ModalCSS.overlay, {
        [ModalCSS.closing || '']: closing,
      })}
    >
      <Dialog.Panel
        className={classNames(ModalCSS.panel, {
          [ModalCSS.closing || '']: closing,
        })}
      >
        {children}
        <button
          onClick={close}
          className="x-btn"
          id={ModalCSS.btn}
          aria-label="Close modal"
        ></button>
      </Dialog.Panel>
    </Dialog>
  );
};

export default Modal;
