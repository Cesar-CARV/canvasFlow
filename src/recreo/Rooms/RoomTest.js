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
      const SELECT_KEY = GAME.input.GetKeyDown("1");
      const HAND_KEY = GAME.input.GetKeyDown("2");
      const SQUARE_KEY = GAME.input.GetKeyDown("3");
      const CIRCLE_KEY = GAME.input.GetKeyDown("4");
      const LINE_KEY = GAME.input.GetKeyDown("5");
      const ARROW_KEY = GAME.input.GetKeyDown("6");
      const PEN_KEY = GAME.input.GetKeyDown("7");
      const ERASER_KEY = GAME.input.GetKeyDown("8");
      const IMAGE_KEY = GAME.input.GetKeyDown("9");

      // RETURN CONDITION
      if (
        !SELECT_KEY &&
        !HAND_KEY &&
        !SQUARE_KEY &&
        !CIRCLE_KEY &&
        !LINE_KEY &&
        !ARROW_KEY &&
        !PEN_KEY &&
        !ERASER_KEY &&
        !IMAGE_KEY
      )
        return;

      if (SELECT_KEY) {
        useToolStore.getState().setTool("SELECT");
      }
      else if (HAND_KEY) {
        useToolStore.getState().setTool("HAND");
      }
      else if (SQUARE_KEY) {
        useToolStore.getState().setTool("SQUARE");
      }
      else if (CIRCLE_KEY) {
        useToolStore.getState().setTool("CIRCLE");
      }
      else if (LINE_KEY) {
        useToolStore.getState().setTool("LINE");
      }
      else if (ARROW_KEY) {
        useToolStore.getState().setTool("ARROW");
      }
      else if (PEN_KEY) {
        useToolStore.getState().setTool("PEN");
      }
      else if (ERASER_KEY) {
        useToolStore.getState().setTool("ERASER");
      }
      else if (IMAGE_KEY) {
        useToolStore.getState().setTool("IMAGE");
      }
    };

    this.addInstance(shape, false, "shape01");
    this.addInstance(shape2, false, "shape02");
    this.addInstance(toolController, false, "tool-controller");
    this.addInstance(new SelectTool(GAME), false, "select-tool");
    this.addInstance(new PenTool(GAME), false, "pen-tool");

    // useToolStore.getState().setTool("PEN");
  }
}

export default RoomTest;
