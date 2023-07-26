import { create } from 'zustand';

type IconManifestEntry = {
  symbol: string;
  name: string;
  color: string;
};

type CryptoIconState = {
  availableIcons: Set<string>;
  isFetching: boolean;
  fetchAvailableIcons: () => void;
};

export const useCryptoIconStore = create<CryptoIconState>((set, get) => ({
  availableIcons: new Set(),
  isFetching: false,

  fetchAvailableIcons: () => {
    if (get().isFetching || get().availableIcons.size > 0) return;

    set({ isFetching: true });

    fetch('https://cdn.jsdelivr.net/npm/cryptocurrency-icons/manifest.json')
      .then(response => response.json())
      .then((manifest: any) => {
        const iconsSet = new Set(
          (manifest as IconManifestEntry[]).map(icon =>
            icon.symbol.toUpperCase()
          )
        );
        set({ availableIcons: iconsSet, isFetching: false });
      })
      .catch(error => {
        console.error('Failed to fetch icons manifest:', error);
        set({ isFetching: false });
      });
  },
}));
