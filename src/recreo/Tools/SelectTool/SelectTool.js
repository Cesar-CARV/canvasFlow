import { ObjectNode, Vector2 } from "recreo";
import useCanvasStore from "../../../store/CanvasStore";
import SelectRect from "./SelectRect";
import TransformRect from "./TransformRect";

export default class SelectTool extends ObjectNode {
  constructor(GAME) {
    super(GAME, 0, 0, 0, 0);
    this.selecting = false;
    this.transform = false;
    this.last;

    this.selectRect = new SelectRect(GAME);
    this.transformRect = new TransformRect(GAME);
    this.addChild(this.selectRect, "SelectTool-SelectRect");
    this.addChild(this.transformRect, "SelectTool-TranformRect");
  }

  /**
   *
   * @param {number} deltatime
   */
  steps = (deltatime) => {
    if (this._GAME.input.GetMouseDown(0)) {
      if (!this.transform) {
        this.selecting = true;
        const mouseCoord = this._GAME.input.GetMouseCords();
        this.selectRect.position.x = mouseCoord.x;
        this.selectRect.position.y = mouseCoord.y;
        this.selectRect.startPosition.x = mouseCoord.x;
        this.selectRect.startPosition.y = mouseCoord.y;
      }
    }
    if (this._GAME.input.GetMouseUp(0)) {
      this.selecting = false;
      this.transform = useCanvasStore.getState().shapesSelected[0] !== undefined;
      // if (this.transform && !this.transformRect.visible) {
      //   this.transformRect.show();
      // }
    }

    // console.log(this.selecting, this.transform);
  };
}
