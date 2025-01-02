import React from "react";
import IconBase from "./IconBase";

export default function IconArrow({ width, height, lineWidth }) {
  return (
    <IconBase width={width} height={height} lineWidth={lineWidth}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12l14 0" />
      <path d="M15 16l4 -4" />
      <path d="M15 8l4 4" />
    </IconBase>
  );
}
