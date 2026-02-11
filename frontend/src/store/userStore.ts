import { create } from 'zustand';

interface UserPreferences {
  theme: 'dark' | 'light';
  language: string;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUserStore = create<UserPreferences>((set) => ({
  theme: 'dark',
  language: 'pt-BR',
  setTheme: (theme) => set({ theme }),
}));