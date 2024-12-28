import { Room } from "recreo";
import Shape from "../Objects/Shape";
import Line from "../Objects/Line";
import SelectTool from "../Tools/SelectTool/SelectTool";
import PenTool from "../Tools/PenTool";
import useToolStore from "../../store/ToolStore";

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

    this.addInstance(shape, false, "shape01");
    this.addInstance(shape2, false, "shape02");
    this.addInstance(new SelectTool(GAME), false, "select-tool");
    this.addInstance(new PenTool(GAME), false, "pen-tool");

    // useToolStore.getState().setTool("PEN");
  }
}

export default RoomTest;
