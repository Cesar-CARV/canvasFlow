import React from "react";
import IconBase from "./IconBase";

export default function IconPen({ width, height, lineWidth }) {
  return (
    <IconBase width={width} height={height} lineWidth={lineWidth}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
      <path d="M13.5 6.5l4 4" />
    </IconBase>
  );
}
