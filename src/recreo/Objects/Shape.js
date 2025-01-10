import { ObjectNode, Vector2 } from "recreo";
import useCanvasStore from "../../store/CanvasStore";

export default class Shape extends ObjectNode {
  #TYPES = { RECT: "RECT", CIRCLE: "CIRCLE" };
  #BORDER_TYPES = { LINE: [100, 0], DASHED: [6, 4], DOTTED: [2, 2] };
  /**
   *
   * @param {Game} Game
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   */
  constructor(Game, x, y, w, h) {
    super(Game, x, y, w, h);
    this.type = this.#TYPES.RECT;
    this.focus = false;
    this.border = true;
    this.borderWidth = 1;
    this.borderType = this.#BORDER_TYPES.LINE;
    this.opacity = "ff";
    this.borderColor = "#000000";
    this.backgroundColor = "#000000";
    this.radius = [0, 0, 0, 0];

    this.velocity = new Vector2(0, 0);

    this.setBorderColor("00", "00", "00");
    this.setBackgroundColor("ee", "ee", "ee");
  }

  /**
   *
   * @param {"RECT" | "CIRCLE"} type
   */
  setType = (type) => {
    this.type = this.#TYPES[type];
  };

  /**
   *
   * @param {"LINE" | "DASHED" | "DOTTED"} type
   */
  setBorderType = (type) => {
    this.borderType = this.#BORDER_TYPES[type];
  };

  /**
   *
   * @param {number} percentage
   * @description 0 -> 1
   */
  setOpacity = (percentage) => {
    const computed = Math.floor(255 * percentage);
    this.opacity = computed.toString(16);

    const brColors = this.borderColor.replace("#", "").match(/.{1,2}/g);
    const bgColors = this.backgroundColor.replace("#", "").match(/.{1,2}/g);

    this.setBorderColor(brColors[0], brColors[1], brColors[2]);
    this.setBackgroundColor(bgColors[0], bgColors[1], bgColors[2]);
  };

  /**
   *
   * @param {string} red
   * @param {string} green
   * @param {string} blue
   * @description values on hexadecimal (00 -> ff)
   */
  setBorderColor = (red, green, blue) => {
    this.borderColor = `#${red}${green}${blue}${this.opacity}`;
  };

  /**
   *
   * @param {string} red
   * @param {string} green
   * @param {string} blue
   * @description values on hexadecimal (00 -> ff)
   */
  setBackgroundColor = (red, green, blue) => {
    this.backgroundColor = `#${red}${green}${blue}${this.opacity}`;
  };

  /**
   *
   * @param {number} topLeft
   * @param {number} topRight
   * @param {number} bottomLeft
   * @param {number} bottomRight
   */
  setRadius = (topLeft, topRight, bottomLeft, bottomRight) => {
    this.radius = [topLeft, topRight, bottomLeft, bottomRight];
  };

  createCopy = () => {
    const copyShape = new Shape(
      this._GAME,
      this.position.x + 10,
      this.position.y + 10,
      this.size.x,
      this.size.y
    );

    copyShape.border = this.border;
    copyShape.borderWidth = this.borderWidth;
    copyShape.opacity = this.opacity;
    copyShape.borderColor = this.borderColor;
    copyShape.backgroundColor = this.backgroundColor;
    copyShape.radius = this.radius;
    copyShape.type = this.type;
    copyShape.borderType = this.borderType;

    return copyShape;
  };

  copy = () => {
    const copiedShape = this.createCopy();
    useCanvasStore.getState().setShapeCopied(copiedShape);
  };

  clone = () => {
    const cloneShape = this.createCopy();

    this._GAME.currentRoom.addInstance(
      cloneShape,
      false,
      this._NAME +
        "-clone" +
        (Math.random() * 10).toFixed(5).toString().replace(".", "")
    );

    if (useCanvasStore.getState().shapesSelected.length === 0) {
      useCanvasStore.getState().setShapeFocus(cloneShape);
    } else {
      useCanvasStore.getState().removeShapeSelected(this);
      useCanvasStore.getState().addShapeSelected(cloneShape);
    }
  };

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw = (ctx) => {
    if (this.type === this.#TYPES.RECT) {
      ctx.beginPath();
      ctx.fillStyle = this.backgroundColor;
      ctx.roundRect(
        this.position.x,
        this.position.y,
        this.size.x,
        this.size.y,
        [
          this.radius[0] + this.borderWidth,
          this.radius[1] + this.borderWidth,
          this.radius[2] + this.borderWidth,
          this.radius[3] + this.borderWidth,
        ]
      );
      ctx.fill();
      ctx.closePath();

      if (this.border) {
        ctx.beginPath();
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.setLineDash(this.borderType);
        ctx.lineDashOffset = 4;
        ctx.roundRect(
          this.position.x + this.borderWidth / 2,
          this.position.y + this.borderWidth / 2,
          this.size.x - this.borderWidth,
          this.size.y - this.borderWidth,
          this.radius
        );
        ctx.stroke();
        ctx.setLineDash(this.#BORDER_TYPES.LINE);
        ctx.closePath();
      }
    } else if (this.type === this.#TYPES.CIRCLE) {
      ctx.beginPath();
      ctx.fillStyle = this.backgroundColor;
      ctx.ellipse(
        this.position.x + this.size.x / 2,
        this.position.y + this.size.y / 2,
        this.size.x / 2,
        this.size.y / 2,
        0,
        0,
        Math.PI * 180
      );
      ctx.fill();
      ctx.closePath();

      if (this.border) {
        ctx.beginPath();
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.setLineDash(this.borderType);
        ctx.ellipse(
          this.position.x + this.size.x / 2,
          this.position.y + this.size.y / 2,
          this.size.x / 2,
          this.size.y / 2,
          0,
          0,
          Math.PI * 180
        );
        ctx.stroke();
        ctx.setLineDash(this.#BORDER_TYPES.LINE);
        ctx.closePath();
      }
    }

    if (useCanvasStore?.getState()?.shapesSelected?.includes(this)) {
      ctx.beginPath();
      ctx.strokeStyle = "#0fa4ff";
      ctx.lineWidth = 1;
      ctx.setLineDash(this.#BORDER_TYPES.LINE);
      ctx.roundRect(
        this.position.x - 2,
        this.position.y - 2,
        this.size.x + 4,
        this.size.y + 4
      );
      ctx.stroke();
      ctx.setLineDash(this.#BORDER_TYPES.LINE);
      ctx.closePath();
    }
  };
}
