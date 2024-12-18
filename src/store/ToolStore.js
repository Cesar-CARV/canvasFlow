import { create } from "zustand";

/**
 *
 * @param {"SELECT" | "PEN" | EASER | "MAKE_SHAPE"} tool
 */
const handleTool = (tool) => set(() => ({ current: tool }));

const useToolStore = create((set) => ({
  TOOLS: {
    SELECT: "SELECT",
    PEN: "PEN",
    EASER: "EASER",
    MAKE_SHAPE: "MAKE_SHAPE",
  },
  current: undefined,
  setTool: handleTool,
}));

export default useStore;
