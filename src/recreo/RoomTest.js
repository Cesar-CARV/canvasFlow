import { Room, ObjectNode, Vector2, UIButton } from "recreo";

class Player extends ObjectNode {
  constructor(GAME, x, y, w, h) {
    super(GAME, x, y, w, h);
    this.velocity = new Vector2(0, 0);
  }

  draw = (ctx) => {
    ctx.fillStyle = "#d57";
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
  };

  steps = (deltaTime) => {
    // velocidad horizontal
    this.velocity.x =
      (this._GAME.input.GetKeyPress("d") - this._GAME.input.GetKeyPress("a")) *
      400 *
      deltaTime;
    // velocidad vertical
    this.velocity.y =
      (this._GAME.input.GetKeyPress("s") - this._GAME.input.GetKeyPress("w")) *
      400 *
      deltaTime;

    // mover
    this.position = this.position.Sum(this.velocity);
  };
}

class PauseButton extends UIButton {
  constructor(GAME, x, y) {
    super(GAME, x, y, 100, 50, "PAUSE");
  }

  onClick = () => {
    if (this._GAME.gamePaused) {
      this._GAME.playGame();
      this.text = "PAUSE";
    } else {
      this._GAME.pauseGame();
      this.text = "PLAY";
    }
  };
}

class RoomTest extends Room {
  constructor(GAME) {
    super(GAME);

    const player = new Player(this._GAME, 0, 0, 50, 50);

    const button = new PauseButton(this._GAME, this._GAME.viewport.x - 110, 10);

    this.addInstance(player, false, "player");
    this.addInstance(button, true, "button");
  }
}

export default RoomTest;
