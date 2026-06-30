import { create } from "zustand";

interface ChatStore {
  isOpen: boolean;
  pendingMessage: string | null;

  open: () => void;
  close: () => void;

  ask: (message: string) => void;
  clearPendingMessage: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  pendingMessage: null,

  open: () => set({ isOpen: true }),

  close: () => set({ isOpen: false }),

  toggle: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),

  ask: (message) => {
    console.log("ask called in store");
    set({
      isOpen: true,
      pendingMessage: message,
    })
  },

  clearPendingMessage: () =>
    set({
      pendingMessage: null,
    }),
}));