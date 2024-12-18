import { Room } from "recreo";
import Shape from "../Objects/Shape";
import SelectTool from "../Tools/SelectTool";

class RoomTest extends Room {
  constructor(GAME) {
    super(GAME);

    const shape = new Shape(this._GAME, 50, 50, 50, 100);
    // shape.setType("CIRCLE");
    shape.setBorderType("DASHED");
    shape.setRadius(80, 0, 0, 0);

    this.addInstance(shape, false, "shape01");
    this.addInstance(new SelectTool(GAME), false, "select-tool");
  }
}

export default RoomTest;
