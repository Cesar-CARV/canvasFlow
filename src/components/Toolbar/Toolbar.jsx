import React, { useContext } from "react";
import IconCursor from "../../icons/IconCursor";
import IconHand from "../../icons/IconHand";
import IconSquare from "../../icons/IconSquare";
import IconCircle from "../../icons/IconCircle";
import IconLine from "../../icons/IconLine";
import IconArrow from "../../icons/IconArrow";
import IconPen from "../../icons/IconPen";
import IconEraser from "../../icons/IconEraser";
import IconImage from "../../icons/IconImage";

import styles from "./Toolbar.module.css";

import useToolStore from "../../store/ToolStore";
import { CanvasContext } from "../../context/CanvasContext";
import useCanvasStore from "../../store/CanvasStore";

export default function Toolbar() {
  const { canvasRef } = useContext(CanvasContext);
  const currentTool = useToolStore((state) => state.current);
  const TOOLS = useToolStore((state) => state.TOOLS);
  const setTool = useToolStore((state) => state.setTool);
  const setShapesSelected = useCanvasStore((state) => state.setShapesSelected);

  /**
   *
   * @param {string} tool
   */
  const handleClick = (tool) => {
    const toolFormated = tool.toUpperCase();
    if (!Object.values(TOOLS).includes(toolFormated)) return;

    setTool(toolFormated);
    canvasRef.current.focus();
    setShapesSelected([]);
  };

  /**
   *
   * @param {string | "SELECT" | "PEN" | "HAND" | "ERASER" | "SQUARE" | "CIRCLE" | "ARROW" | "LINE" | "IMAGE" } tool
   */
  const handleTool = (tool) => {
    const toolFormated = tool.toUpperCase();

    return currentTool === toolFormated ? styles["btn-active"] : "";
  };

  return (
    <nav className={styles.toolbar}>
      <button
        onClick={() => handleClick("SELECT")}
        className={handleTool("SELECT")}
      >
        <IconCursor width={24} height={24}></IconCursor>
      </button>
      <button
        onClick={() => handleClick("HAND")}
        className={handleTool("HAND")}
      >
        <IconHand width={24} height={24}></IconHand>
      </button>
      <button
        onClick={() => handleClick("SQUARE")}
        className={handleTool("SQUARE")}
      >
        <IconSquare width={24} height={24}></IconSquare>
      </button>
      <button
        onClick={() => handleClick("CIRCLE")}
        className={handleTool("CIRCLE")}
      >
        <IconCircle width={24} height={24}></IconCircle>
      </button>
      <button
        onClick={() => handleClick("LINE")}
        className={handleTool("LINE")}
      >
        <IconLine width={24} height={24}></IconLine>
      </button>
      <button
        onClick={() => handleClick("ARROW")}
        className={handleTool("ARROW")}
      >
        <IconArrow width={24} height={24}></IconArrow>
      </button>
      <button onClick={() => handleClick("PEN")} className={handleTool("PEN")}>
        <IconPen width={24} height={24}></IconPen>
      </button>
      <button
        onClick={() => handleClick("ERASER")}
        className={handleTool("ERASER")}
      >
        <IconEraser width={24} height={24}></IconEraser>
      </button>
      <button
        onClick={() => handleClick("IMAGE")}
        className={handleTool("IMAGE")}
      >
        <IconImage width={24} height={24}></IconImage>
      </button>
    </nav>
  );
}
