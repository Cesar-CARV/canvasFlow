import { ObjectNode, Vector2 } from "recreo";
import useCanvasStore from "../../../store/CanvasStore";

export default class TransformRect extends ObjectNode {
  constructor(GAME) {
    super(GAME, 100, 100, 50, 50);
    this.padding = 10;
    this.visible = false;

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

    const moveX = mouseCoords.x - this.lastMouseCoords.x;
    const moveY = mouseCoords.y - this.lastMouseCoords.y;

    this.position.x += moveX;
    this.position.y += moveY;

    useCanvasStore.getState().shapesSelected.forEach((shape) => {
      shape.position.x += moveX;
      shape.position.y += moveY;
    });

    this.lastMouseCoords = mouseCoords;
  };

  resize = (mouseCoords) => {
    const diffY = mouseCoords.y - this.lastMouseCoords.y;
    const diffX = mouseCoords.x - this.lastMouseCoords.x;

    // TOP
    if (this.directions.top) {
      if (this.size.y + -diffY >= this.minSize.y) {
        this.size.y += -diffY;
        this.position.y += diffY;
      }
    }

    // BOTTOM
    if (this.directions.bottom) {
      if (this.size.y + diffY >= this.minSize.y) {
        this.size.y += diffY;
      }
    }

    // LEFT
    if (this.directions.left) {
      if (this.size.x + -diffX >= this.minSize.x) {
        this.size.x += -diffX;
        this.position.x += diffX;
      }
    }

    // RIGHT
    if (this.directions.right) {
      if (this.size.x + diffX >= this.minSize.x) {
        this.size.x += diffX;
      }
    }

    this.lastMouseCoords = mouseCoords;
  };

  show = () => {
    if (!this._PARENT.resizing || this.visible) return;

    const shapesSelected = useCanvasStore.getState().shapesSelected;

    // Many Shapes
    let top = shapesSelected[0].position.y;
    let left = shapesSelected[0].position.x;
    let bottom = shapesSelected[0].position.y + shapesSelected[0].size.y;
    let right = shapesSelected[0].position.x + shapesSelected[0].size.x;

    // Set min and max point of transform rect
    shapesSelected.forEach((shape) => {
      top = Math.min(top, shape.position.y);
      left = Math.min(left, shape.position.x);
      bottom = Math.max(bottom, shape.position.y + shape.size.y);
      right = Math.max(right, shape.position.x + shape.size.x);
    });

    this.position.x = left;
    this.position.y = top;
    this.size.x = right - left;
    this.size.y = bottom - top;
    this.visible = true;
  };

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw = (ctx) => {
    if (!this._PARENT.resizing) return;
    ctx.save();
    ctx.fillStyle = "#F6FFC155";
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    ctx.strokeStyle = "#F6FFC1";
    ctx.lineWidth = 4;
    ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
    ctx.restore();
  };

  /**
   *
   * @param {number} deltatime
   */
  steps = (deltatime) => {
    if (!this._PARENT.resizing) return;

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
      if (
        !(
          mouseCoords.x >= this.position.x &&
          mouseCoords.x <= this.position.x + this.size.x &&
          mouseCoords.y >= this.position.y &&
          mouseCoords.y <= this.position.y + this.size.y
        ) &&
        this.visible
      ) {
        this._PARENT.resizing = false;
        this.visible = false;
        useCanvasStore.getState().setShapesSelected([]);
      }

      this.directions = {
        TOP: false,
        LEFT: false,
        BOTTOM: false,
        RIGHT: false,
      };
      this.draging = false;
      this.resizing = false;
    }

    this.show();
  };
}
