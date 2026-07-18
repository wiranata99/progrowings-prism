import { create } from "zustand";

import { PrismEngine } from "../data/engine/PrismEngine";
import type { PrismSnapshot } from "../types/prism";

interface PrismState {
  snapshot: PrismSnapshot | null;
  isLoading: boolean;
  error: string | null;

  loadWorkbook: (file: File) => Promise<void>;
  clearSnapshot: () => void;
}

const prismEngine = new PrismEngine();

export const usePrismStore = create<PrismState>((set) => ({
  snapshot: null,
  isLoading: false,
  error: null,

  loadWorkbook: async (file: File): Promise<void> => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const snapshot = await prismEngine.load(file);

      set({
        snapshot,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membaca workbook.";

      set({
        snapshot: null,
        isLoading: false,
        error: message,
      });
    }
  },

  clearSnapshot: (): void => {
    set({
      snapshot: null,
      isLoading: false,
      error: null,
    });
  },
}));