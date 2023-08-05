import { create } from 'zustand';

type PopupState = {
  isOpen: boolean;
  message: string;
  openQRCodeModal: (message: string) => void;
  closeQRCodeModal: () => void;
};

const useQRCodeModalStore = create<PopupState>(set => ({
  isOpen: false,
  message: '',
  openQRCodeModal: message => {
    set({
      isOpen: true,
      message,
    });
  },
  closeQRCodeModal: () => set({ isOpen: false }),
}));

export default useQRCodeModalStore;
