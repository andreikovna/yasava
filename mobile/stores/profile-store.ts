import { create } from 'zustand';

type ProfileState = {
  activeProfileId: string | null;
  setActiveProfileId: (id: string | null) => void;
  reset: () => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  activeProfileId: null,
  setActiveProfileId: (id) => set({ activeProfileId: id }),
  reset: () => set({ activeProfileId: null }),
}));
