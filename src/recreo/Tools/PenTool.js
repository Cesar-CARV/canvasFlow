import { ObjectNode } from "recreo";
import useToolStore from "../../store/ToolStore";
import { checkDistance } from "../../utils/checkDistance";
import Line from "../Objects/Line";

export default class PenTool extends ObjectNode {
  constructor(GAME) {
    super(GAME, 0, 0, 0, 0);
    this.lastMouseCoords = { x: undefined, y: undefined };
    this.line = undefined;

    this.minX = undefined;
    this.maxX = undefined;
    this.minY = undefined;
    this.maxY = undefined;
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
    if (useToolStore.getState().current !== useToolStore.getState().TOOLS.PEN)
      return;

    const mouseCoords = this._GAME.input.GetMouseCords();

    // Start draw
    if (this._GAME.input.GetMouseDown(0)) {
      this.setLastMouseCoords(mouseCoords);
      this.line = new Line(this._GAME, mouseCoords.x, mouseCoords.y, 50, 50);
    }

    // Draw Line
    if (this._GAME.input.GetMousePress(0)) {
      if (checkDistance(this.lastMouseCoords, mouseCoords) >= 10) {
        this.line.vertexs.push({
          x: mouseCoords.x - this.line.position.x,
          y: mouseCoords.y - this.line.position.y,
        });

        if (this.line.vertexs.length === 1) {
          this._GAME.currentRoom.addInstance(
            this.line,
            false,
            "line-" + Math.random().toString().split(".")[1]
          );
        }

        this.setLastMouseCoords(mouseCoords);
      }

      // Calculate min max Coords
      this.minX = !this.minX
        ? mouseCoords.x
        : Math.min(this.minX, mouseCoords.x);
      this.maxX = !this.maxX
        ? mouseCoords.x
        : Math.max(this.maxX, mouseCoords.x);
      this.minY = !this.minY
        ? mouseCoords.y
        : Math.min(this.minY, mouseCoords.y);
      this.maxY = !this.maxY
        ? mouseCoords.y
        : Math.max(this.maxY, mouseCoords.y);
    }

    // End draw
    if (this._GAME.input.GetMouseUp(0)) {
      const diffX = this.line.position.x - this.minX;
      const diffY = this.line.position.y - this.minY;

      this.line.vertexs = this.line.vertexs.map((vx) => ({
        x: vx.x + diffX,
        y: vx.y + diffY,
      }));

      this.line.lastVertex = this.line.vertexs.map((vx) => ({
        x: vx.x,
        y: vx.y,
      }));

      this.line.position.x = this.minX;
      this.line.position.y = this.minY;
      this.line.size.x = this.maxX - this.minX;
      this.line.size.y = this.maxY - this.minY;

      // Reset
      this.line = undefined;
      this.minX = undefined;
      this.maxX = undefined;
      this.minY = undefined;
      this.maxY = undefined;
    }
  };
}
