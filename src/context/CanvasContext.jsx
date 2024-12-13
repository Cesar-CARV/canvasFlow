import React, { createContext, useState, useEffect, useRef } from "react";
import { Game } from "recreo";
import RoomTest from "../recreo/RoomTest.js";

// Crea el contexto
const CanvasContext = createContext();

// Crea el proveedor del contexto
const CanvasProvider = ({ children }) => {
  const [GAME, setGAME] = useState(null);
  const [canvasId, setCanvasId] = useState(null);
  const [gameId, setGameId] = useState(null);
  const canvasRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (GAME || !canvasId || !gameId) return;
    // -------------------- GAME SETTINGS --------------------- //
    const $game = document.getElementById(gameId);
    const $gameCanvas = document.getElementById(canvasId);

    const _GAME = new Game($game, $gameCanvas);
    _GAME.debug = false;
    _GAME.setSizing("FILL");

    // -------------------- ROOMS --------------------- //
    _GAME.addRoom(RoomTest);
    _GAME.changeRoom("RoomTest");
    _GAME.startGame();
    setGAME(_GAME);
    canvasRef.current.focus();

    // Limpia el loop cuando el componente se desmonta
    return () => _GAME.stopGame();
  }, [canvasId, gameId]);

  return (
    <CanvasContext.Provider
      value={{
        GAME,
        canvasId,
        gameId,
        setCanvasId,
        setGameId,
        canvasRef,
        gameRef,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasProvider, CanvasContext };
