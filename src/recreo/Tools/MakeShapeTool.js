import { ObjectNode } from "recreo";
import useToolStore from "../../store/ToolStore";
import { checkDistance } from "../../utils/checkDistance";
import Shape from "../Objects/Shape";

export default class MakeShapeTool extends ObjectNode {
  constructor(GAME) {
    super(GAME, 0, 0, 0, 0);
    this.lastMouseCoords = { x: undefined, y: undefined };
    this.minSize = 30;

    this.shape = undefined;
  }

  /**
   *
   * @param {object} coords { x, y }
   */
  setLastMouseCoords = (coords) => {
    this.lastMouseCoords.x = coords.x;
    this.lastMouseCoords.y = coords.y;
  };

  /**
   *
   * @param {number} deltatime
   */
  steps = () => {
    if (
      useToolStore.getState().current !==
        useToolStore.getState().TOOLS.CIRCLE &&
      useToolStore.getState().current !== useToolStore.getState().TOOLS.SQUARE
    )
      return;

    const mouseCoords = this._GAME.input.GetMouseCords();

    // Create shape
    if (this._GAME.input.GetMouseDown(0)) {
      this.setLastMouseCoords(mouseCoords);
      this.shape = new Shape(
        this._GAME,
        this.lastMouseCoords.x,
        this.lastMouseCoords.y,
        this.minSize,
        this.minSize
      );

      // CIRCLE
      if (
        useToolStore.getState().current === useToolStore.getState().TOOLS.CIRCLE
      ) {
        this.shape.setType("CIRCLE");
      }

      this._GAME.currentRoom.addInstance(
        this.shape,
        false,
        "shape-" + Math.random().toString().split(".")[1]
      );
    }

    // Resize shape
    if (this._GAME.input.GetMousePress(0)) {
      if (checkDistance(this.lastMouseCoords, mouseCoords) >= this.minSize) {
        const resizeX = mouseCoords.x - this.shape.position.x;
        const resizeY = mouseCoords.y - this.shape.position.y;

        this.shape.size.x =
          resizeX >= this.minSize ? resizeX : this.shape.size.x;
        this.shape.size.y =
          resizeY >= this.minSize ? resizeY : this.shape.size.y;
      }
    }

    // Restar shape
    if (this._GAME.input.GetMouseUp(0)) {
      this.shape = undefined;
    }
  };
}
