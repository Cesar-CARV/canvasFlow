import { useId, useContext, useEffect } from "react";
import styles from "./Canvas.module.css";
import { CanvasContext } from "../../context/CanvasContext";

export default function Canvas() {
  const { GAME, canvasId, gameId, setCanvasId, setGameId, canvasRef, gameRef } =
    useContext(CanvasContext);
  const GAME_ID = useId();
  const CANVAS_ID = useId();

  useEffect(() => {
    setCanvasId(CANVAS_ID);
    setGameId(GAME_ID);
  }, []);

  return (
    <div className={styles["game-container"]}>
      <div id={GAME_ID} className={styles["game"]} ref={gameRef}>
        <canvas
          ref={canvasRef}
          tabIndex="1"
          id={CANVAS_ID}
          className={styles["game__display"]}
        ></canvas>
      </div>
    </div>
  );
}
