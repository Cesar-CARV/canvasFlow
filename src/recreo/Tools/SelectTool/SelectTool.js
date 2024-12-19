import { ObjectNode, Vector2 } from "recreo";
import useCanvasStore from "../../../store/CanvasStore";
import useToolStore from "../../../store/ToolStore";
import SelectRect from "./SelectRect";
import TransformRect from "./TransformRect";

export default class SelectTool extends ObjectNode {
  constructor(GAME) {
    super(GAME, 0, 0, 0, 0);
    this.selecting = false;

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
      this.selecting = true;
      const mouseCoord = this._GAME.input.GetMouseCords();
      this.selectRect.position.x = mouseCoord.x;
      this.selectRect.position.y = mouseCoord.y;
      this.selectRect.startPosition.x = mouseCoord.x;
      this.selectRect.startPosition.y = mouseCoord.y;
    }
    if (this._GAME.input.GetMouseUp(0)) {
      this.selecting = false;
    }
  };

  // constructor(GAME) {
  //   super(GAME, 0, 0, 0, 0);
  //   this.draging = false;
  //   this.startDrag = new Vector2(0, 0);
  //   this.endDrag = new Vector2(0, 0);

  //   // Transform Rect
  //   this.transformRect = false;
  //   this.transformRectPosition = new Vector2();
  //   this.transformRectSize = new Vector2();
  // }

  //   /**
  //    *
  //    * @param {Vector2} position1
  //    * @param {Vector2} position2
  //    * @returns {number}
  //    */
  //   computedDistance = (position1, position2) => {
  //     return Math.sqrt(
  //       (position2.x - position1.x) ** 2 + (position2.y - position1.y) ** 2
  //     );
  //   };

  //   //#region SELECT SHAPE
  //   selectShape = () => {
  //     // Select top shape
  //     if (this._GAME.input.GetMouseUp(0)) {
  //       const mouseCoord = this._GAME.input.GetMouseCords();
  //       const instances = Object.values(
  //         this._GAME.currentRoom._INSTANCES
  //       ).reverse();

  //       // Find shape at mouse point
  //       let selected = false;
  //       let index = 0;
  //       while (!selected && index < instances.length) {
  //         const node = instances[index];

  //         if (node !== this) {
  //           if (
  //             mouseCoord.x >= node?.position.x &&
  //             mouseCoord.x <= node?.position.x + node.size.x &&
  //             mouseCoord.y >= node?.position.y &&
  //             mouseCoord.y <= node?.position.y + node.size.y
  //           ) {
  //             useCanvasStore.getState().setShapeFocus(node);
  //             selected = true;
  //             this.transformRect = true;
  //           }
  //         }

  //         index++;
  //       }

  //       // If there is no shape at point restart
  //       if (!selected) {
  //         useCanvasStore.getState().setShapeFocus(undefined);
  //         if (!this.draging) {
  //           useCanvasStore.getState().setShapesSelected([]);
  //           this.transformRect = false;
  //           this.transformRectPosition.x = 0;
  //           this.transformRectPosition.y = 0;
  //           this.transformRectSize.x = 0;
  //           this.transformRectSize.y = 0;
  //         }
  //       }
  //     }
  //   };

  //   collideShapes = () => {
  //     if (!this.draging) return;

  //     const instances = Object.values(
  //       this._GAME.currentRoom._INSTANCES
  //     ).reverse();

  //     // Check if shape are on selection area
  //     const shapes = instances.filter(
  //       (node) =>
  //         (this.endDrag.x >= node.position.x &&
  //           this.startDrag.x <= node.position.x + node.size.x &&
  //           this.endDrag.y >= node.position.y &&
  //           this.startDrag.y <= node.position.y + node.size.y) ||
  //         (this.startDrag.x >= node.position.x &&
  //           this.endDrag.x <= node.position.x + node.size.x &&
  //           this.startDrag.y >= node.position.y &&
  //           this.endDrag.y <= node.position.y + node.size.y) ||
  //         (this.startDrag.x >= node.position.x &&
  //           this.endDrag.x <= node.position.x + node.size.x &&
  //           this.endDrag.y >= node.position.y &&
  //           this.startDrag.y <= node.position.y + node.size.y) ||
  //         (this.endDrag.x >= node.position.x &&
  //           this.startDrag.x <= node.position.x + node.size.x &&
  //           this.startDrag.y >= node.position.y &&
  //           this.endDrag.y <= node.position.y + node.size.y)
  //     );

  //     useCanvasStore.getState().setShapesSelected(shapes);
  //   };

  //   selectRect = () => {
  //     if (useCanvasStore.getState().shapeFocus) return;

  //     const mouseCoord = this._GAME.input.GetMouseCords();

  //     // Set start Drag Point
  //     if (this._GAME.input.GetMouseDown(0)) {
  //       this.startDrag.x = mouseCoord.x;
  //       this.startDrag.y = mouseCoord.y;
  //     }

  //     // Start selection rect
  //     if (this._GAME.input.GetMousePress(0)) {
  //       this.endDrag.x = mouseCoord.x;
  //       this.endDrag.y = mouseCoord.y;

  //       if (!this.draging) {
  //         const distance = Math.abs(
  //           this.computedDistance(this.startDrag, this.endDrag)
  //         );
  //         if (distance > 2) {
  //           this.draging = true;
  //         }
  //       }
  //     }

  //     if (this._GAME.input.GetMouseUp(0)) {
  //       // Reset select state
  //       this.draging = false;
  //       this.endDrag = new Vector2(0, 0);
  //       this.startDrag = new Vector2(0, 0);

  //       // If there is no shape selected, don't active transform rect
  //       this.transformRect =
  //         useCanvasStore.getState().shapesSelected.length !== 0;
  //     }

  //     this.collideShapes();
  //   };

  //   //#endregion

  //   //#region TRANSFORM SHAPE

  //   computedTransformRect = () => {
  //     if (!this.draging) return;

  //     const shapeFocus = useCanvasStore.getState().shapeFocus;
  //     const shapesSelected = useCanvasStore.getState().shapesSelected;

  //     // Only one Shape
  //     if (shapeFocus) {
  //       this.transformRectPosition.x = shapeFocus.position.x - 4;
  //       this.transformRectPosition.y = shapeFocus.position.y - 4;
  //       this.transformRectSize.x = shapeFocus.size.x + 8;
  //       this.transformRectSize.y = shapeFocus.size.y + 8;
  //       return;
  //     }

  //     if (shapesSelected.length === 0) return;
  //     // Many Shapes
  //     let minShapePos = new Vector2(1, 1);
  //     let maxShapePos = new Vector2(1, 1);

  //     // Set min and max point of transform rect
  //     shapesSelected.forEach((shape, index) => {
  //       minShapePos = index === 0 ? shape.position.Copy() : minShapePos;

  //       minShapePos.x = Math.min(minShapePos.x, shape.position.x);
  //       minShapePos.y = Math.min(minShapePos.y, shape.position.y);
  //       maxShapePos.x = Math.max(maxShapePos.x, shape.position.x + shape.size.x);
  //       maxShapePos.y = Math.max(maxShapePos.y, shape.position.y + shape.size.y);
  //     });

  //     this.transformRectPosition = minShapePos;
  //     this.transformRectSize = maxShapePos.Substract(minShapePos);
  //   };
  //   //#endregion

  //   //#region DRAW
  //   /**
  //    *
  //    * @param {CanvasRenderingContext2D} ctx
  //    */
  //   drawSelectionRect = (ctx) => {
  //     if (useCanvasStore.getState().shapeFocus || !this.draging) return;

  //     ctx.fillStyle = "#0ea5e955";
  //     ctx.fillRect(
  //       this.startDrag.x,
  //       this.startDrag.y,
  //       this.endDrag.x - this.startDrag.x,
  //       this.endDrag.y - this.startDrag.y
  //     );
  //   }

  //   /**
  //    *
  //    * @param {CanvasRenderingContext2D} ctx
  //    */
  //   drawTransformRect = (ctx) => {

  //   }

  //   /**
  //    *
  //    * @param {CanvasRenderingContext2D} ctx
  //    */
  //   draw = (ctx) => {
  //     this.drawSelectionRect(ctx);
  //     this.drawTransformRect(ctx);
  //   };
  //   //#endregion

  //   steps = () => {
  //     if (
  //       useToolStore.getState().current !== useToolStore.getState().TOOLS.SELECT
  //     ) {
  //       return;
  //     }
  //     this.selectShape();
  //     this.selectRect();
  //     this.computedTransformRect();
  //     if (this.transformRect === true) {
  //     }
  //   };
}
