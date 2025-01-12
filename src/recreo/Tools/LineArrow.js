import { ObjectNode } from "recreo";
import useToolStore from "../../store/ToolStore";
import Line from "../Objects/Line";

export default class PenTool extends ObjectNode {
  constructor(GAME) {
    super(GAME, 0, 0, 0, 0);
    this.lastMouseCoords = { x: undefined, y: undefined };
    this.drawing = false;
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

  endDraw = () => {
    if (!this.drawing && this.line) {
      this.line.vertexs.pop();
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

      // SetLastSize
      this.line.lastSize.x = this.line.size.x;
      this.line.lastSize.y = this.line.size.y;
      this.line.lastVertex = this.line.vertexs.map((vx) => ({
        x: vx.x,
        y: vx.y,
      }));

      // Reset
      this.line = undefined;
      this.minX = undefined;
      this.maxX = undefined;
      this.minY = undefined;
      this.maxY = undefined;
    }
  };

  /**
   *
   * @param {number} deltatime
   */
  steps = () => {
    const arrowTool =
      useToolStore.getState().current === useToolStore.getState().TOOLS.ARROW;
    const lineTool =
      useToolStore.getState().current === useToolStore.getState().TOOLS.LINE;

    if (!arrowTool && !lineTool) {
      if (this.drawing) {
        this.drawing = false;
        // End draw
        this.endDraw();
      }
      return;
    }

    // Set arrow
    if (this.line) {
      this.line.arrow = arrowTool;
    }

    const mouseCoords = this._GAME.input.GetMouseCords();

    // Start draw
    if (this._GAME.input.GetMouseDown(0)) {
      this.drawing = true;
      this.setLastMouseCoords(mouseCoords);
      if (!this.line) {
        this.line = new Line(this._GAME, mouseCoords.x, mouseCoords.y, 50, 50);
        this._GAME.currentRoom.addInstance(
          this.line,
          false,
          "line-" + Math.random().toString().split(".")[1]
        );
      }
      this.line.vertexs.push({
        x: mouseCoords.x - this.line.position.x,
        y: mouseCoords.y - this.line.position.y,
      });
      if (this.line.vertexs.length === 1) {
        this.line.vertexs.push({
          x: mouseCoords.x - this.line.position.x,
          y: mouseCoords.y - this.line.position.y,
        });
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

    // Draw Line
    if (this.line) {
      this.line.vertexs[this.line.vertexs.length - 1].x =
        mouseCoords.x - this.line.position.x;
      this.line.vertexs[this.line.vertexs.length - 1].y =
        mouseCoords.y - this.line.position.y;
      this.setLastMouseCoords(mouseCoords);
    }

    // End draw
    if (this._GAME.input.GetMouseUp(2)) {
      this.drawing = false;
    }
    this.endDraw();
  };
}
