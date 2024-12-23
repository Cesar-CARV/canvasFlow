import { ObjectNode, Vector2 } from "recreo";
import useCanvasStore from "../../../store/CanvasStore";

export default class SelectRect extends ObjectNode {
  constructor(GAME) {
    super(GAME, 0, 0, 0, 0);
    this.startPosition = new Vector2();
    this.minSize = new Vector2(4, 4);
    this.single = true;
  }

  /**
   *
   * @param {Vector2} position1
   * @param {Vector2} position2
   * @returns {number}
   */
  checkDistance = (position1, position2) => {
    return Math.abs(
      Math.sqrt(
        (position2.x - position1.x) ** 2 + (position2.y - position1.y) ** 2
      )
    );
  };

  shapesOnArea = () => {
    const instances = Object.values(
      this._GAME.currentRoom._INSTANCES
    ).reverse();

    // Check if shape are on selection area
    const shapes = instances.filter(
      (node) =>
        this.position.x + this.size.x >= node.position.x &&
        this.position.x <= node.position.x + node.size.x &&
        this.position.y + this.size.y >= node.position.y &&
        this.position.y <= node.position.y + node.size.y
    );

    // Check if shape are only one
    if (this.single) {
      useCanvasStore.getState().setShapesSelected([shapes[0]]);
      return;
    }

    useCanvasStore.getState().setShapesSelected(shapes);
  };

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw = (ctx) => {
    if (!this._PARENT.selecting) return;
    ctx.fillStyle = "#0ea5e955";
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
  };

  /**
   *
   * @param {number} deltatime
   */
  steps = (deltatime) => {
    if (!this._PARENT.selecting) return;

    const mouseCoords = this._GAME.input.GetMouseCords();

    if (this._GAME.input.GetMousePress(0)) {
      if (mouseCoords.x <= this.startPosition.x) {
        this.position.x = mouseCoords.x;
        this.size.x = this.startPosition.x - mouseCoords.x;
      } else {
        this.size.x = mouseCoords.x - this.position.x;
      }

      if (mouseCoords.y <= this.startPosition.y) {
        this.position.y = mouseCoords.y;
        this.size.y = this.startPosition.y - mouseCoords.y;
      } else {
        this.size.y = mouseCoords.y - this.position.y;
      }
    }

    // Select one
    this.single =
      this.size.x <= this.minSize.x && this.size.y <= this.minSize.y;
    
      // Select shapes
    this.shapesOnArea();
  };
}
