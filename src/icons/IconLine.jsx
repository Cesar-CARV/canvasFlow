import React from "react";
import IconBase from "./IconBase";

export default function IconLine({ width, height, lineWidth }) {
  return (
    <IconBase width={width} height={height} lineWidth={lineWidth}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M18 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M7.5 16.5l9 -9" />
    </IconBase>
  );
}
