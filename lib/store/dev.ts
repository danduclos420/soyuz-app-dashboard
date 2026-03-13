import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DevState {
  isDevMode: boolean;
  isWixModeActive: boolean;
  selectedElementId: string | null;
  elementStyles: Record<string, any>;
  elementTree: any[];
  toggleWixMode: () => void;
  setDevMode: (active: boolean) => void;
  setSelectedElementId: (id: string | null) => void;
  updateElementStyle: (id: string, style: any) => void;
  setElementTree: (tree: any[]) => void;
}

export const useDevStore = create<DevState>()(
  persist(
    (set) => ({
      isDevMode: false,
      isWixModeActive: false,
      selectedElementId: null,
      elementStyles: {},
      elementTree: [],
      toggleWixMode: () => set((state) => ({ isWixModeActive: !state.isWixModeActive, selectedElementId: null, elementTree: [] })),
      setDevMode: (active) => set({ isDevMode: active, isWixModeActive: false }),
      setSelectedElementId: (id) => set({ selectedElementId: id }),
      updateElementStyle: (id: string, style: any) => set((state) => ({
        elementStyles: {
          ...state.elementStyles,
          [id]: { ...(state.elementStyles[id] || {}), ...style }
        }
      })),
      setElementTree: (tree) => set({ elementTree: tree }),
    }),
    {
      name: 'soyuz-dev-storage',
    }
  )
);
