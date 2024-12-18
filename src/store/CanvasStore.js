import { create } from "zustand";

const useCanvasStore = create((set) => ({
  shapesSelected: [],
  shapeCopied: undefined,

  setShapesSelected: (shapes) => set(() => ({ shapesSelected: shapes })),

  removeShapeSelected: (shape) =>
    set((state) => ({
      shapesSelected: state.shapesSelected.filter((shp) => shp !== shape),
    })),

  addShapeSelected: (shape) =>
    set((state) => ({ shapesSelected: [...state.shapesSelected, shape] })),

  setShapeCopied: (shape) => set(() => ({ shapeCopied: shape })),
}));

export default useCanvasStore;
