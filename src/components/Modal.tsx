import { useState, useEffect, useCallback, useRef } from 'react';
import classNames from 'classnames';

import ModalCSS from './Modal.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  theme?: 'light' | 'dark';
};

const Modal = ({ children, open, onClose, theme }: Props) => {
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);

  // close modal with animation
  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);

      onClose();
    }, 300);
  }, [onClose]);

  // close the modal when clicking the back arrow
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

  // close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.target === dialogRef.current) close();
    };

    const dialogElement = dialogRef.current;
    if (dialogElement)
      dialogElement.addEventListener('click', handleClickOutside);

    return () => {
      if (dialogElement)
        dialogElement.removeEventListener('click', handleClickOutside);
    };
  }, [close]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      className={classNames(ModalCSS.panel, {
        [ModalCSS.closing || '']: closing,
      })}
      data-theme={theme}
    >
      <button
        onClick={close}
        className="x-btn"
        id={ModalCSS.btn}
        aria-label="Close modal"
      />
      {children}
    </dialog>
  );
};

export default Modal;
