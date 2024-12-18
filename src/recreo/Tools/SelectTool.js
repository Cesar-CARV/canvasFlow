import { ObjectNode, Vector2 } from "recreo";
import useCanvasStore from "../../store/CanvasStore";

export default class SelectTool extends ObjectNode {
  constructor(GAME) {
    super(GAME, 0, 0, 0, 0);
    this.draging = false;
    this.startDrag = new Vector2(0, 0);
    this.endDrag = new Vector2(0, 0);
  }

  selectShape = () => {
    if (this._GAME.input.GetMouseUp(0)) {
      const mouseCoord = this._GAME.input.GetMouseCords();
      const instances = Object.values(
        this._GAME.currentRoom._INSTANCES
      ).reverse();

      let selected = false;
      let index = 0;
      while (!selected && index < instances.length) {
        const node = instances[index];

        if (node !== this) {
          if (
            mouseCoord.x >= node?.position.x &&
            mouseCoord.x <= node?.position.x + node.size.x &&
            mouseCoord.y >= node?.position.y &&
            mouseCoord.y <= node?.position.y + node.size.y
          ) {
            useCanvasStore.getState().setShapeFocus(node);
            selected = true;
          }
        }

        index++;
      }

      if (!selected) {
        useCanvasStore.getState().setShapeFocus(undefined);
      }
    }
  };

  selectRect = () => {
    if (useCanvasStore.getState().shapeFocus) return;

    const mouseCoord = this._GAME.input.GetMouseCords();

    if (this._GAME.input.GetMouseDown(0)) {
      this.startDrag = mouseCoord;
    }

    if (this._GAME.input.GetMousePress(0)) {
      if (!this.draging) this.draging = true;
      this.endDrag = mouseCoord;
    }

    if (this._GAME.input.GetMouseUp(0)) {
      this.draging = false;

      const instances = Object.values(
        this._GAME.currentRoom._INSTANCES
      ).reverse();

      const shapes = instances.filter(
        (node) =>
          (node.position.x >= this.startDrag.x &&
            node.position.x + node.size.x <= this.endDrag.x &&
            node.position.y >= this.startDrag.y &&
            node.position.y + node.size.y <= this.endDrag.y) ||
          (node.position.x >= this.endDrag.x &&
            node.position.x + node.size.x <= this.startDrag.x &&
            node.position.y >= this.endDrag.y &&
            node.position.y + node.size.y <= this.startDrag.y)
      );

      useCanvasStore.getState().setShapesSelected(shapes);
    }
  };

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw = (ctx) => {
    if (useCanvasStore.getState().shapeFocus || !this.draging) return;

    ctx.fillStyle = "#0ea5e955";
    ctx.fillRect(
      this.startDrag.x,
      this.startDrag.y,
      this.endDrag.x - this.startDrag.x,
      this.endDrag.y - this.startDrag.y
    );
  };

  steps = () => {
    this.selectShape();
    this.selectRect();
  };
}
