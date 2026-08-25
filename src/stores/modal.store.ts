


import { create } from "zustand";

interface ModalState {
  isOpen: boolean;

  modalName: string | null;

  openModal: (name: string) => void;

  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,

  modalName: null,

  openModal: (name) =>
    set({
      isOpen: true,
      modalName: name,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      modalName: null,
    }),
}));