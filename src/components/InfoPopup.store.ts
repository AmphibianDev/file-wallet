import { create } from 'zustand';
import { IconType } from 'react-icons';
import { FaCheck, FaTimes } from 'react-icons/fa';

type IconSetting = {
  icon: IconType;
  color: string;
};

type IconKey = 'success' | 'error';

const ICON_SET: Record<IconKey, IconSetting> = {
  success: {
    icon: FaCheck as IconType,
    color: 'var(--color-primary-bright)',
  },
  error: {
    icon: FaTimes as IconType,
    color: 'var(--color-error-bright)',
  },
};

type PopupState = {
  toggleFlag: boolean; //For forced re-render
  isOpen: boolean;
  message: string;
  icon?: IconType;
  iconColor?: string;
  closeDelay: number;
  openPopup: (message: string, type: IconKey, closeDelay?: number) => void;
  closePopup: () => void;
};

const useInfoPopupStore = create<PopupState>(set => ({
  toggleFlag: true,
  isOpen: false,
  message: '',
  icon: undefined,
  iconColor: undefined,
  closeDelay: 1000,
  openPopup: (message, type, closeDelay = 1000) => {
    const selectedIcon = ICON_SET[type] || {};
    set(currentState => ({
      ...currentState,
      isOpen: true,
      message,
      icon: selectedIcon.icon,
      iconColor: selectedIcon.color,
      closeDelay,
      toggleFlag: !currentState.toggleFlag,
    }));
  },
  closePopup: () => set({ isOpen: false }),
}));

export default useInfoPopupStore;
