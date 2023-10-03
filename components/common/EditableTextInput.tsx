import React, { CSSProperties, ChangeEvent } from "react";
import { Html } from "react-konva-utils";

function getStyle(width: number, height: number) {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  const baseStyle = {
    width: `${width}px`,
    height: `${height}px`,
    border: "none",
    padding: "0px",
    margin: "0px",
    background: "none",
    outline: "none",
    resize: "none",
    colour: "black",
    fontSize: "24px",
    fontFamily: "sans-serif",
  };
  if (isFirefox) {
    return baseStyle;
  }
  return {
    ...baseStyle,
    margintop: "-4px",
  };
}

export function EditableTextInput({
  x,
  y,
  index,
  width,
  height,
  value,
  onChange,
  onKeyDown,
}: {
  x: number;
  y: number;
  index: number;
  width: number;
  height: number;
  value: string;
  onChange: (e: ChangeEvent) => void;
  onKeyDown: (e: any) => void;
}) {
  const style = getStyle(width, height);

  return (
    <Html groupProps={{ x, y }} divProps={{ style: { opacity: 1 } }}>
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={style as CSSProperties}
      />
    </Html>
  );
}
