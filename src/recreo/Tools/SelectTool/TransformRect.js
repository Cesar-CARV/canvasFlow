import { ObjectNode, Vector2 } from "recreo";
import useCanvasStore from "../../../store/CanvasStore";
import useToolStore from "../../../store/ToolStore";

export default class TransformRect extends ObjectNode {
  constructor(GAME) {
    super(GAME, 100, 100, 50, 50);
    this.padding = 10;
    this.visible = false;
    this.CtrlKey = false;

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

    // this is used on resize func
    this.initShapes = [];
    this.initSize = {};
    this.initPos = {};
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
    this.initPos.x += moveX;
    this.initPos.y += moveY;

    useCanvasStore.getState().shapesSelected.forEach((shape, i) => {
      shape.position.x += moveX;
      shape.position.y += moveY;
      this.initShapes[i].position.x += moveX;
      this.initShapes[i].position.y += moveY;
    });

    this.lastMouseCoords = mouseCoords;
  };

  resize = (mouseCoords) => {
    const diffY = mouseCoords.y - this.lastMouseCoords.y;
    const diffX = mouseCoords.x - this.lastMouseCoords.x;
    let diffSizeX = this.size.x;
    let diffSizeY = this.size.y;

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

    diffSizeX = this.size.x - diffSizeX;
    diffSizeY = this.size.y - diffSizeY;

    this.lastMouseCoords = mouseCoords;

    if (
      !this.directions.bottom &&
      !this.directions.top &&
      !this.directions.left &&
      !this.directions.right
    )
      return;

    const many = useCanvasStore.getState().shapesSelected.length > 1;

    useCanvasStore.getState().shapesSelected.forEach((shape, i) => {
      if (!many) {
        shape.size.x += diffSizeX;
        shape.size.y += diffSizeY;

        // TOP
        if (this.directions.top) {
          shape.position.y += -diffSizeY;
        }

        // LEFT
        if (this.directions.left) {
          shape.position.x += -diffSizeX;
        }
      } else if (many) {
        // Relative Size
        const proportion = {
          x: (this.size.x * 100) / this.initSize.x,
          y: (this.size.y * 100) / this.initSize.y,
        };
        shape.size.x = (this.initShapes[i].size.x * proportion.x) / 100;
        shape.size.y = (this.initShapes[i].size.y * proportion.y) / 100;

        // Relative Pos
        const postDiffX = this.initPos.x - this.position.x;
        const postDiffY = this.initPos.y - this.position.y;
        shape.position.x =
          this.position.x +
          (this.size.x *
            (((this.initShapes[i].position.x - postDiffX - this.position.x) *
              100) /
              this.initSize.x)) /
            100;

        shape.position.y =
          this.position.y +
          (this.size.y *
            (((this.initShapes[i].position.y - postDiffY - this.position.y) *
              100) /
              this.initSize.y)) /
            100;
      }
    });
  };

  show = () => {
    if (!this._PARENT.transform || this.visible) return;

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
   * @param {number} deltatime
   */
  checkKeyActions = (deltatime) => {
    this.CtrlKey = this._GAME.input.GetKeyPress("Control");
    const deleteShape = this._GAME.input.GetKeyDown("Backspace");
    const cloneshape = this._GAME.input.GetKeyDown("d");

    const shapes = useCanvasStore.getState().shapesSelected;

    // Move
    const velocityX =
      (this._GAME.input.GetKeyPress("ArrowRight") -
        this._GAME.input.GetKeyPress("ArrowLeft")) *
      10 *
      deltatime;

    const velocityY =
      (this._GAME.input.GetKeyPress("ArrowDown") -
        this._GAME.input.GetKeyPress("ArrowUp")) *
      10 *
      deltatime;

    this.position.x += velocityX;
    this.position.y += velocityY;

    for (let i = 0; i < shapes.length; i++) {
      if (cloneshape) {
        shapes[i].clone();
      }
      if (deleteShape) {
        useCanvasStore.getState().removeShapeSelected(shapes[i]);
        shapes[i].kamikaze();
      }

      shapes[i].position.x += velocityX;
      shapes[i].position.y += velocityY;
    }

    if (cloneshape) {
      this.visible = false;
      this.show();
    }

    if (deleteShape) {
      this._PARENT.transform = false;
      this.visible = false;
    }
  };

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw = (ctx) => {
    if (
      useToolStore.getState().current !== useToolStore.getState().TOOLS.SELECT
    )
      return;
    if (!this._PARENT.transform) return;
    ctx.save();
    ctx.fillStyle = "#F6FFC155";
    ctx.fillRect(
      this.position.x - 4,
      this.position.y - 4,
      this.size.x + 8,
      this.size.y + 8
    );
    ctx.strokeStyle = "#F6FFC1";
    ctx.lineWidth = 4;
    ctx.strokeRect(
      this.position.x - 4,
      this.position.y - 4,
      this.size.x + 8,
      this.size.y + 8
    );
    ctx.restore();
  };

  setResizingInitStates = () => {
    // Set initSize
    if (!this.initSize?.x && !this.initSize?.y) {
      this.initSize = { x: this.size.x, y: this.size.y };
    }

    // Set initPos
    if (!this.initPos?.x && !this.initPos?.y) {
      this.initPos = { x: this.position.x, y: this.position.y };
    }

    // Set initShapes
    if (this.initShapes.length === 0) {
      this.initShapes = useCanvasStore
        .getState()
        .shapesSelected.map((shape) => {
          return {
            size: { x: shape.size.x, y: shape.size.y },
            position: { x: shape.position.x, y: shape.position.y },
          };
        });
    }
  };

  /**
   *
   * @param {number} deltatime
   */
  steps = (deltatime) => {
    if (
      useToolStore.getState().current !== useToolStore.getState().TOOLS.SELECT
    )
      return;
    if (!this._PARENT.transform) return;

    const mouseCoords = this._GAME.input.GetMouseCords();

    if (this._GAME.input.GetMouseDown(0)) {
      this.lastMouseCoords = mouseCoords;
      this.checkResizeAreas(mouseCoords);
      this.checkDragArea(mouseCoords);

      this.setResizingInitStates();
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
        this._PARENT.transform = false;
        this.visible = false;
        useCanvasStore.getState().setShapesSelected([]);
        this.initShapes = [];
        this.initSize = {};
        this.initPos = {};
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

    this.checkKeyActions(deltatime);
  };
}
