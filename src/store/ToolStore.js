import { create } from "zustand";

const useToolStore = create((set) => ({
  TOOLS: {
    SELECT: "SELECT",
    PEN: "PEN",
    EASER: "EASER",
    MAKE_SHAPE: "MAKE_SHAPE",
  },
  current: "SELECT",
  setTool: (tool) => set((state) => ({ current: state.TOOLS[tool] })),
}));

export default useToolStore;
