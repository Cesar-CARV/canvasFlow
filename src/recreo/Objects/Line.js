import { ObjectNode, Vector2 } from "recreo";
import useCanvasStore from "../../store/CanvasStore";
import useToolStore from "../../store/ToolStore";

export default class Line extends ObjectNode {
  #LINE_TYPE = { LINE: [100, 0], DASHED: [6, 4], DOTTED: [2, 2] };
  #ARROW = [
    { x: 0, y: 0 },
    { x: 0, y: -10 },
    { x: 20, y: 0 },
    { x: 0, y: 10 },
    { x: 0, y: 0 },
  ];
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
    this.focus = false;
    this.arrow = false;
    this.lineWidth = 1;
    this.lineType = this.#LINE_TYPE.LINE;
    this.opacity = "ff";
    this.lineColor = "#ff0000";

    this.vertexs = [];

    this.lastVertex = this.vertexs.map((vx) => ({ x: vx.x, y: vx.y }));

    this.lastSize = { x: w, y: h };

    this.startObject = { target: undefined, side: undefined };
    this.endObject = { target: undefined, side: undefined };

    this.setLineColor("ff", "00", "00");
  }

  /**
   *
   * @param {"LINE" | "DASHED" | "DOTTED"} type
   */
  setLineType = (type) => {
    this.lineType = this.#LINE_TYPE[type];
  };

  /**
   *
   * @param {number} percentage
   * @description 0 -> 1
   */
  setOpacity = (percentage) => {
    const computed = Math.floor(255 * percentage);
    this.opacity = computed.toString(16);
    const brColors = this.lineColor.replace("#", "").match(/.{1,2}/g);
    this.setLineColor(brColors[0], brColors[1], brColors[2]);
  };

  /**
   *
   * @param {string} red
   * @param {string} green
   * @param {string} blue
   * @description values on hexadecimal (00 -> ff)
   */
  setLineColor = (red, green, blue) => {
    this.lineColor = `#${red}${green}${blue}${this.opacity}`;
  };

  createCopy = () => {
    const copyLine = new Line(
      this._GAME,
      this.position.x + 10,
      this.position.y + 10,
      this.size.x,
      this.size.y
    );

    copyLine.lineWidth = this.lineWidth;
    copyLine.arrow = this.arrow;
    copyLine.opacity = this.opacity;
    copyLine.lineColor = this.lineColor;
    copyLine.lineType = this.lineType;
    copyLine.lastSize = { x: this.lastSize.x, y: this.lastSize.y };
    copyLine.vertexs = this.vertexs.map((vx) => ({ x: vx.x, y: vx.y }));
    copyLine.lastVertex = this.lastVertex.map((vx) => ({ x: vx.x, y: vx.y }));

    return copyLine;
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
   * @param {object} p1 { x: 0, y: 0 }
   * @param {object} p2 { x: 0, y: 0 }
   * @returns
   */
  getAngleBetweenPoints = (p1, p2) => {
    const deltaX = p2.x - p1.x;
    const deltaY = p2.y - p1.y;
    const angleInRadians = Math.atan2(deltaY, deltaX);
    const angleInDegrees = angleInRadians * (180 / Math.PI);
    return angleInDegrees;
  };

  /**
   *
   * @param {number} angle
   */
  rotateArrow = (angle) => {
    const center = { x: 0, y: 0 };
    return this.#ARROW.map((point) => {
      const radians = (Math.PI / 180) * angle;
      const translatedX = point.x - center.x;
      const translatedY = point.y - center.y;
      const rotatedX =
        translatedX * Math.cos(radians) - translatedY * Math.sin(radians);
      const rotatedY =
        translatedX * Math.sin(radians) + translatedY * Math.cos(radians);
      return { x: rotatedX + center.x, y: rotatedY + center.y };
    });
  };

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  drawDot = (ctx) => {
    if (!this.arrow) return;
    ctx.beginPath();
    ctx.fillStyle = this.lineColor;
    ctx.ellipse(
      this.position.x + this.vertexs[0].x,
      this.position.y + this.vertexs[0].y,
      5 + this.lineWidth,
      5 + this.lineWidth,
      0,
      0,
      Math.PI * 180
    );
    ctx.fill();
  };

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  drawArrow = (ctx) => {
    if (!this.arrow) return;

    // Draw Arrow
    const end = this.vertexs[this.vertexs.length - 1];
    const end2 = this.vertexs[this.vertexs.length - 2];

    if (end && end2) {
      const angle = this.getAngleBetweenPoints(end2, end);
      const arrowRotated = this.rotateArrow(angle);

      ctx.beginPath();
      ctx.fillStyle = this.lineColor;
      ctx.moveTo(
        this.position.x + end.x + arrowRotated[0].x,
        this.position.y + end.y + arrowRotated[0].y
      );
      arrowRotated.forEach((point) => {
        ctx.lineTo(
          this.position.x +
            end.x +
            point.x +
            Math.sign(point.x) * this.lineWidth,
          this.position.y +
            end.y +
            point.y +
            Math.sign(point.y) * this.lineWidth
        );
      });
      ctx.closePath();
      ctx.fill();
    }
  };

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw = (ctx) => {
    if (this.vertexs.length === 0) return;

    ctx.strokeStyle = this.lineColor;
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = this.lineWidth;

    this.vertexs.forEach((vertex, i) => {
      // Draw lines
      if (i === 0) {
        ctx.moveTo(this.position.x + vertex.x, this.position.y + vertex.y);
      } else {
        ctx.lineTo(this.position.x + vertex.x, this.position.y + vertex.y);
      }
    });
    ctx.stroke();

    // Draw arrow
    this.drawArrow(ctx);
    this.drawDot(ctx);

    // Draw select rect
    if (useCanvasStore?.getState()?.shapesSelected?.includes(this)) {
      ctx.beginPath();
      ctx.strokeStyle = "#0fa4ff";
      ctx.lineWidth = 1;
      ctx.setLineDash(this.#LINE_TYPE.LINE);
      ctx.roundRect(
        this.position.x - 2,
        this.position.y - 2,
        this.size.x + 4,
        this.size.y + 4
      );
      ctx.stroke();
      ctx.setLineDash(this.#LINE_TYPE.LINE);
      ctx.closePath();
    }
  };

  /**
   *
   * @param {number} index
   */
  repostionVertex = (index) => {
    if (
      useToolStore.getState().current !== useToolStore.getState().TOOLS.SELECT
    )
      return;
    const vertex = this.vertexs[index];
    // Relative Pos
    vertex.x = (this.lastVertex[index].x * this.size.x) / this.lastSize.x;
    vertex.y = (this.lastVertex[index].y * this.size.y) / this.lastSize.y;
  };

  /**
   * @param {number} deltatime
   */
  steps = () => {
    if (this.lastSize.x !== this.size.x || this.lastSize.y !== this.size.y) {
      for (let i = 0; i < this.vertexs.length; i++) {
        this.repostionVertex(i);
      }
    }
  };
}
