import { create } from "zustand";

const useStore = create((set) => ({
  shapeFocus: undefined,
  setShapeFocus: (shape) => set(() => ({ shapeFocus: shape })),
  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
  // updateBears: (newBears) => set({ bears: newBears }),
}));

export default useStore;
