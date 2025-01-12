import { ObjectNode, Room } from "recreo";
import SelectTool from "../Tools/SelectTool/SelectTool";
import PenTool from "../Tools/PenTool";
import useToolStore from "../../store/ToolStore";
import useCanvasStore from "../../store/CanvasStore";
import MakeShapeTool from "../Tools/MakeShapeTool";
import LineArrow from "../Tools/LineArrow";

class RoomTest extends Room {
  constructor(GAME) {
    super(GAME);

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
      } else if (HAND_KEY) {
        useToolStore.getState().setTool("HAND");
      } else if (SQUARE_KEY) {
        useToolStore.getState().setTool("SQUARE");
      } else if (CIRCLE_KEY) {
        useToolStore.getState().setTool("CIRCLE");
      } else if (LINE_KEY) {
        useToolStore.getState().setTool("LINE");
      } else if (ARROW_KEY) {
        useToolStore.getState().setTool("ARROW");
      } else if (PEN_KEY) {
        useToolStore.getState().setTool("PEN");
      } else if (ERASER_KEY) {
        useToolStore.getState().setTool("ERASER");
      } else if (IMAGE_KEY) {
        useToolStore.getState().setTool("IMAGE");
      }

      if (
        SELECT_KEY ||
        HAND_KEY ||
        SQUARE_KEY ||
        CIRCLE_KEY ||
        LINE_KEY ||
        ARROW_KEY ||
        PEN_KEY ||
        ERASER_KEY ||
        IMAGE_KEY
      ) {
        useCanvasStore.getState().setShapesSelected([]);
      }
    };

    this.addInstance(toolController, false, "tool-controller");
    this.addInstance(new SelectTool(GAME), false, "select-tool");
    this.addInstance(new PenTool(GAME), false, "pen-tool");
    this.addInstance(new MakeShapeTool(GAME), false, "makeShape-tool");
    this.addInstance(new LineArrow(GAME), false, "lineArrow-tool");

    // useToolStore.getState().setTool("PEN");
  }
}

export default RoomTest;
