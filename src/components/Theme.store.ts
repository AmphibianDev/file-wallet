import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeStoreState = {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
};

const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.classList.remove(`${currentTheme}-theme`);
        document.documentElement.classList.add(`${newTheme}-theme`);

        set({ theme: newTheme });
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => state => {
        if (state)
          document.documentElement.classList.add(`${state.theme}-theme`);
      },
    }
  )
);

export default useThemeStore;
