import { ObjectNode, Room } from "recreo";
import Shape from "../Objects/Shape";
import SelectTool from "../Tools/SelectTool/SelectTool";
import PenTool from "../Tools/PenTool";
import useToolStore from "../../store/ToolStore";
import useCanvasStore from "../../store/CanvasStore";

class RoomTest extends Room {
  constructor(GAME) {
    super(GAME);

    const shape = new Shape(this._GAME, 50, 50, 50, 100);
    shape.setBorderType("DASHED");
    shape.setRadius(80, 0, 0, 0);

    const shape2 = new Shape(this._GAME, 300, 50, 50, 50);
    shape2.setType("CIRCLE");
    shape2.setBorderType("LINE");
    shape2.borderWidth = 5;

    // Tool controller
    const toolController = new ObjectNode(GAME, 0, 0, 0, 0);
    toolController.steps = () => {
      const SHIFT_KEY = GAME.input.GetKeyDown("SHIFT");
      const S_KEY = GAME.input.GetKeyDown("s") || GAME.input.GetKeyDown("S");
      const P_KEY = GAME.input.GetKeyDown("p") || GAME.input.GetKeyDown("P");
      const E_KEY = GAME.input.GetKeyDown("e") || GAME.input.GetKeyDown("E");
      const M_KEY = GAME.input.GetKeyDown("m") || GAME.input.GetKeyDown("M");

      // RETURN CONDITION
      if (SHIFT_KEY) return;

      // SELECT
      if (S_KEY) {
        useToolStore.getState().setTool("SELECT");
        useCanvasStore.getState().setShapesSelected([]);
      }
      
      // PEN
      if (P_KEY) {
        useToolStore.getState().setTool("PEN");
        useCanvasStore.getState().setShapesSelected([]);
      }
      // EASER
      if (E_KEY) {
        useToolStore.getState().setTool("ERASER");
        useCanvasStore.getState().setShapesSelected([]);
      }
      // MAKE_SHAPE
      if (M_KEY) {
        useToolStore.getState().setTool("MAKE_SHAPE");
        useCanvasStore.getState().setShapesSelected([]);
      }
    }

    this.addInstance(shape, false, "shape01");
    this.addInstance(shape2, false, "shape02");
    this.addInstance(toolController, false, "tool-controller");
    this.addInstance(new SelectTool(GAME), false, "select-tool");
    this.addInstance(new PenTool(GAME), false, "pen-tool");

    // useToolStore.getState().setTool("PEN");
  }
}

export default RoomTest;
