import { ObjectNode } from "recreo";
import useToolStore from "../../store/ToolStore";

export default class PenTool extends ObjectNode {
  constructor(GAME) {
    super(GAME, 0, 0, 0, 0);
  }

  /**
   *
   * @param {number} deltatime
   */
  steps = () => {
    if (
      useToolStore.getState().current !== useToolStore.getState().TOOLS.ERASER
    ) {
      return;
    }

    // Room instances
    const instances = Object.values(this._GAME.currentRoom._INSTANCES);

    // Mouse Coords
    const mouseCoords = this._GAME.input.GetMouseCords();

    // Draw Line
    if (this._GAME.input.GetMousePress(0)) {
      // Check if shape are on mouse point
      const shapes = instances.filter(
        (node) =>
          mouseCoords.x >= node.position.x &&
          mouseCoords.x < node.position.x + node.size.x &&
          mouseCoords.y >= node.position.y &&
          mouseCoords.y < node.position.y + node.size.y
      );

      // Delete shapes
      for (let i = 0; i < shapes.length; i++) {
        shapes[i].kamikaze();
        console.log(i);
      }
    }
  };
}
