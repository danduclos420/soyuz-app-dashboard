import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase-client';

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
  
  // Persistence Actions (Step 14)
  publishStyles: () => Promise<void>;
  loadStyles: () => Promise<void>;
}

export const useDevStore = create<DevState>()(
  persist(
    (set, get) => ({
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

      // Save to Supabase
      publishStyles: async () => {
        const styles = get().elementStyles;
        const { error } = await supabase
          .from('site_styles')
          .upsert({ 
            id: 'global-v1', // Main style config
            styles: styles,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      },

      // Load from Supabase
      loadStyles: async () => {
        const { data, error } = await supabase
          .from('site_styles')
          .select('styles')
          .eq('id', 'global-v1')
          .maybeSingle();
        
        if (!error && data?.styles) {
          set({ elementStyles: data.styles });
        }
      }
    }),
    {
      name: 'soyuz-dev-storage',
    }
  )
);
