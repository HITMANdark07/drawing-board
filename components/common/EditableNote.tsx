import React, { useState, useEffect, useContext } from "react";
import { Group } from "react-konva";
import { EditableText } from "./EditableText";
import { CanvasContext } from "@/context/CanvasContext";

function EditableNote({
  colour,
  x,
  y,
  index,
  selected,
}: {
  colour?: string;
  x: number;
  y: number;
  index: number;
  selected: boolean;
}) {
  const [text, setText] = useState<string>("Write Something Here");
  const [isEditing, setIsEditing] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const {
    text: { notes, setNotes },
    history,
    setHistory,
    historyStep,
    setHistoryStep,
  } = useContext(CanvasContext);

  const onTextChange = (str: string) => setText(str);

  useEffect(() => {
    if (!selected && isEditing) {
      setIsEditing(false);
    } else if (!selected && isTransforming) {
      setIsTransforming(false);
    }
  }, [selected, isEditing, isTransforming]);

  function toggleEdit() {
    setIsEditing(!isEditing);
  }

  function toggleTransforming() {
    setIsTransforming(!isTransforming);
  }

  useEffect(() => {
    let _notes = notes.slice();
    _notes[index] = {
      ..._notes[index],
      text: text,
    };
    setNotes(_notes);
    // eslint-disable-next-line
  }, [text, index]);
  return (
    <Group
      x={x}
      y={y}
      draggable
      onClick={(e) => {
        let _notes = notes.slice();
        _notes[index] = {
          ..._notes[index],
          selected: true,
        };
        setNotes(_notes);
        // adding to history
        let _history = history.slice(0, historyStep + 1);
        _history.push({ ..._notes[index], state: "text" });
        setHistoryStep(historyStep + 1);
        setHistory(_history);
      }}
      onDragEnd={(e) => {
        let _notes = notes.slice();
        _notes[index] = {
          ..._notes[index],
          x: e.target.x(),
          y: e.target.y(),
        };
        setNotes(_notes);
        //adding to history
        let _history = history.slice(0, historyStep + 1);
        _history.push({ ..._notes[index], state: "text" });
        setHistoryStep(historyStep + 1);
        setHistory(_history);
      }}
    >
      <EditableText
        x={20}
        y={40}
        index={index}
        text={text}
        width={width}
        height={height}
        onResize={(newWidth, newHeight) => {
          setWidth(newWidth);
          setHeight(newHeight);
        }}
        isEditing={isEditing}
        isTransforming={isTransforming}
        onToggleEdit={toggleEdit}
        onToggleTransform={toggleTransforming}
        onChange={onTextChange}
      />
    </Group>
  );
}

export default EditableNote;
