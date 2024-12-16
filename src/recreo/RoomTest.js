import { Room } from "recreo";
import Shape from "./Shape";

class RoomTest extends Room {
  constructor(GAME) {
    super(GAME);

    const shape = new Shape(this._GAME, 50, 50, 50, 100);
    // shape.setType("CIRCLE");
    shape.setBorderType("DASHED");
    shape.setRadius(80, 0, 0, 0);

    this.addInstance(shape, false, "shape01");
  }
}

export default RoomTest;
