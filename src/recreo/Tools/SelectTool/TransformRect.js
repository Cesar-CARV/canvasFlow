import { ObjectNode, Vector2 } from "recreo";
import useCanvasStore from "../../../store/CanvasStore";
import { LegacyESLint } from "eslint/use-at-your-own-risk";

export default class TransformRect extends ObjectNode {
  constructor(GAME) {
    super(GAME, 100, 100, 50, 50);
    this.padding = 10;

    this.minSize = new Vector2(30, 30);
    this.lastMouseCoords = new Vector2();
    this.directions = {
      top: false,
      left: false,
      bottom: false,
      right: false,
    };

    this.draging = false;
    this.resizing = false;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw = (ctx) => {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
  };

  /**
   *
   * @param {number} start
   * @param {number} end
   * @returns
   */
  onAreaX = (mouseCoords, start, end) => {
    return (
      mouseCoords.x >= start &&
      mouseCoords.x <= end &&
      mouseCoords.y >= this.position.y &&
      mouseCoords.y <= this.position.y + this.size.y
    );
  };

  /**
   *
   * @param {number} start
   * @param {number} end
   * @returns
   */
  onAreaY = (mouseCoords, start, end) => {
    return (
      mouseCoords.x >= this.position.x &&
      mouseCoords.x <= this.position.x + this.size.x &&
      mouseCoords.y >= start &&
      mouseCoords.y <= end
    );
  };

  checkResizeAreas = (mouseCords) => {
    // TOP
    this.directions.top = this.onAreaY(
      mouseCords,
      this.position.y,
      this.position.y + this.padding
    );
    // BOTTOM
    this.directions.bottom = this.onAreaY(
      mouseCords,
      this.position.y + this.size.y - this.padding,
      this.position.y + this.size.y
    );
    // LEFT
    this.directions.left = this.onAreaX(
      mouseCords,
      this.position.x,
      this.position.x + this.padding
    );
    // RIGHT
    this.directions.right = this.onAreaX(
      mouseCords,
      this.position.x + this.size.x - this.padding,
      this.position.x + this.size.x
    );

    this.resizing = true;
    this.lastMouseCoords = mouseCords;
  };

  checkDragArea = (mouseCoords) => {
    if (
      this.directions.top ||
      this.directions.bottom ||
      this.directions.left ||
      this.directions.right
    )
      return;

    // Move
    if (
      mouseCoords.x >= this.position.x + this.padding &&
      mouseCoords.x <= this.position.x + this.size.x - this.padding &&
      mouseCoords.y >= this.position.y + this.padding &&
      mouseCoords.y <= this.position.y + this.size.y - this.padding
    ) {
      this.draging = true;
      this.lastMouseCoords = mouseCoords;
    }
  };

  drag = (mouseCoords) => {
    if (!this.draging) return;
    if (this.lastMouseCoords === mouseCoords) return;

    this.position.x += mouseCoords.x - this.lastMouseCoords.x;
    this.position.y += mouseCoords.y - this.lastMouseCoords.y;

    this.lastMouseCoords = mouseCoords;
  };

  resize = (mouseCoords) => {
    const diffY = mouseCoords.y - this.lastMouseCoords.y;
    if (this.directions.bottom) {
      if (this.size.y >= this.minSize.y) {
        this.size.y += diffY;
      } else if (diffY > 0) {
        this.size.y += diffY;
      } else {
        this.size.y = this.minSize.y;
      }
    }

    this.lastMouseCoords = mouseCoords;
  };

  /**
   *
   * @param {number} deltatime
   */
  steps = (deltatime) => {
    const mouseCoords = this._GAME.input.GetMouseCords();

    if (this._GAME.input.GetMouseDown(0)) {
      this.lastMouseCoords = mouseCoords;
      this.checkResizeAreas(mouseCoords);
      this.checkDragArea(mouseCoords);
    }

    if (this._GAME.input.GetMousePress(0)) {
      this.drag(mouseCoords);
      this.resize(mouseCoords);
    }

    if (this._GAME.input.GetMouseUp(0)) {
      this.directions = {
        TOP: false,
        LEFT: false,
        BOTTOM: false,
        RIGHT: false,
      };
      this.draging = false;
      this.resizing = false;
    }
  };
}
