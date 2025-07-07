import { create } from 'zustand';

interface LanguageState {
  language: string;
  setLanguage: (lang: string) => void;
}

export const useLanguage = create<LanguageState>((set) => ({
  language: 'ar', // Default to Arabic
  setLanguage: (lang) => set({ language: lang }),
})); 