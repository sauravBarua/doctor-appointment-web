import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface SlotSelection {
  doctorId: string;
  startTime: string;
  endTime: string;
}

interface BookingState {
  selection: SlotSelection | null;
  select: (selection: SlotSelection) => void;
  clear: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      selection: null,
      select: (selection) => set({ selection }),
      clear: () => set({ selection: null }),
    }),
    {
      name: 'booking-selection',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ selection: state.selection }),
      // Rehydrated after mount (see BookingFlow) so server and client HTML match.
      skipHydration: true,
    },
  ),
);
