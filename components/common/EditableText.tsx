import React from "react";
import { ResizableText } from "./ResizableTextInput";
import { EditableTextInput } from "./EditableTextInput";

const RETURN_KEY = 13;
const ESCAPE_KEY = 27;

export function EditableText({
  x,
  y,
  index,
  isEditing,
  isTransforming,
  onToggleEdit,
  onToggleTransform,
  onChange,
  onResize,
  text,
  width,
  height,
}: {
  x: number;
  y: number;
  index: number;
  isEditing: boolean;
  isTransforming: boolean;
  onToggleEdit: (e: any) => void;
  onToggleTransform: (e: any) => void;
  onChange: (e: string) => void;
  onResize: (width: number, height: number) => void;
  text: string;
  width: number;
  height: number;
}) {
  function handleEscapeKeys(e: any) {
    if ((e.keyCode === RETURN_KEY && !e.shiftKey) || e.keyCode === ESCAPE_KEY) {
      onToggleEdit(e);
    }
  }

  function handleTextChange(e: any) {
    onChange(e.currentTarget.value);
  }

  if (isEditing) {
    return (
      <EditableTextInput
        x={x}
        y={y}
        index={index}
        width={width}
        height={height}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleEscapeKeys}
      />
    );
  }
  return (
    <ResizableText
      x={x}
      y={y}
      index={index}
      value={text}
      isSelected={isTransforming}
      onClick={onToggleTransform}
      onDoubleClick={onToggleEdit}
      onResize={onResize}
      text={text}
      width={width}
    />
  );
}
