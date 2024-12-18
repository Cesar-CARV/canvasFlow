import { create } from "zustand";

const useCanvasStore = create((set) => ({
  shapeFocus: undefined,
  shapesSelected: [],
  shapeCopied: undefined,

  setShapesSelected: (shapes) => set(() => ({ shapesSelected: shapes })),

  setShapeFocus: (shape) => set(() => ({ shapeFocus: shape })),

  removeShapeSelected: (shape) =>
    set((state) => ({
      shapesSelected: state.shapesSelected.filter((shp) => shp !== shape),
    })),

  addShapeSelected: (shape) =>
    set((state) => ({ shapesSelected: [...state.shapesSelected, shape] })),

  setShapeCopied: (shape) => set(() => ({ shapeCopied: shape })),
}));

export default useCanvasStore;
