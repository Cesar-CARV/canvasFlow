import { create } from "zustand";

const useToolStore = create((set) => ({
  TOOLS: {
    SELECT: "SELECT",
    PEN: "PEN",
    ERASER: "ERASER",
    SQUARE: "SQUARE",
    CIRCLE: "CIRCLE",
    ARROW: "ARROW",
    HAND: "HAND",
    LINE: "LINE",
    IMAGE: "IMAGE",
  },
  current: "SELECT",
  setTool: (tool) => set((state) => ({ current: state.TOOLS[tool] })),
}));

export default useToolStore;
