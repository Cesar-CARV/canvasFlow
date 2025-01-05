import React from "react";
import IconBase from "./IconBase";

export default function IconCircle({ width, height, lineWidth }) {
  return (
    <IconBase width={width} height={height} lineWidth={lineWidth}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    </IconBase>
  );
}
