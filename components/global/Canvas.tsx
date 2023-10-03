/* eslint-disable @next/next/no-img-element */
import { useContext, useRef, useState } from "react";
import { Stage, Layer, Circle, Text, Line, Image } from "react-konva";
import useImage from "use-image";
import EditableNote from "../common/EditableNote";
import { GrUndo, GrRedo } from "react-icons/gr";
import Toolbox from "../common/Toolbox";
import { CanvasContext } from "@/context/CanvasContext";

const URLImage = ({
  image,
}: {
  image: {
    index: number;
    x: number;
    y: number;
    src: string;
    onImageDragEnd: (e: any) => void;
    handleImageDragStart: (e: any) => void;
  };
}) => {
  const [img] = useImage(image.src);
  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
      draggable
      name={String(image.index)}
      onDragStart={image.handleImageDragStart}
      onDragEnd={image.onImageDragEnd}
      alt={new Date().getTime()}
      offsetX={img ? img.width / 2 : 0}
      offsetY={img ? img.height / 2 : 0}
    />
  );
};
function Canvas() {
  const stageRef = useRef<any>(null);
  const dragUrl = useRef<any>();

  const {
    state,
    setState,
    history,
    historyStep,
    setHistory,
    setHistoryStep,
    undo,
    redo,
    draw: { stroke, strokeWidth, tool, lines, setLines },
    text: { notes, setNotes },
    image: { images, setImages },
  } = useContext(CanvasContext);

  const isDrawing = useRef(false);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([
      ...lines,
      {
        tool,
        points: [pos.x, pos.y],
        strokeWidth: strokeWidth,
        stroke: stroke,
      },
    ]);
  };
  const handleMouseMove = (e: any) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    // adding to history
    let _lines = lines.slice();
    let _history = history.slice(0, historyStep + 1);
    _history.push({ ..._lines[_lines.length - 1], state: "draw" });
    setHistoryStep(historyStep + 1);
    setHistory(_history);
  };

  const handleImageDragStart = (e: any) => {
    const _images = images;
    const id = e.target.name();
    const items = _images.slice();
    const item = items.find((i) => i.index === id);
    if (!item) return;
    const index = items.indexOf(item);
    // remove from the list:
    items.splice(index, 1);
    // add to the top
    items.push(item);
    setImages(items);
  };
  const onImageDragEnd = (e: any) => {
    const _images = images;
    const id = e.target.name();
    const items = _images.slice();
    const item = items.find((i) => i.index == id);

    if (!item) return;
    const index = images.indexOf(item);
    // update item position

    items[index] = {
      ...item,
      x: e.target.x(),
      y: e.target.y(),
    };
    setImages(items);
    let _history = history.slice(0, historyStep + 1);
    _history.push({ ...items[index], state: "image" });
    setHistoryStep(historyStep + 1);
    setHistory(_history);
  };
  return (
    <>
      <div
        onDrop={(e) => {
          e.preventDefault();
          // register event position
          stageRef.current.setPointersPositions(e);
          // add image
          setImages(
            images.concat([
              {
                ...stageRef.current.getPointerPosition(),
                src: dragUrl.current,
                index: images.length,
              },
            ])
          );
        }}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col w-full h-full relative items-center justify-center"
      >
        <div
          style={{
            width: window.innerWidth * 0.9,
            height: window.innerHeight * 0.8,
          }}
          className="relative"
        >
          <Stage
            width={window.innerWidth * 0.7}
            height={window.innerHeight * 0.8}
            onMouseDown={(e) => {
              if (state === "draw") handleMouseDown(e);
            }}
            onMousemove={(e: any) => {
              if (state === "draw") handleMouseMove(e);
            }}
            onMouseup={() => {
              if (state === "draw") handleMouseUp();
            }}
            ref={stageRef}
            onClick={(e) => {
              if (state === "text") {
                const points = stageRef.current.getPointerPosition();
                const newNote = {
                  index: notes.length,
                  selected: true,
                  text: "Write Something Here",
                  x: points.x,
                  y: points.y,
                };
                setNotes((notes: any) => [...notes, newNote]);
                // adding to history
                let _history = history.slice(0, historyStep + 1);
                _history.push({ ...newNote, state: "text" });
                setHistoryStep(historyStep + 1);
                setHistory(_history);
                setState("image");
              } else {
                let _notes = notes.slice();
                _notes = _notes.map((note) => ({ ...note, selected: false }));
                if (Object.hasOwn(e.target.attrs, "text")) {
                  _notes[e.target.index] = {
                    ..._notes[e.target.index],
                    selected: true,
                  };
                  setNotes(_notes);
                  // adding to history
                  let _history = history.slice(0, historyStep + 1);
                  _history.push({ ..._notes[e.target.index], state: "text" });
                  setHistoryStep(historyStep + 1);
                  setHistory(_history);
                } else {
                  setNotes(_notes);
                }
              }
            }}
            className="shadow-2xl border-black border-2"
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.stroke}
                  strokeWidth={line.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === "eraser" ? "destination-out" : "source-over"
                  }
                />
              ))}
            </Layer>
            <Layer
              onMouseDown={() => {
                setState("image");
              }}
            >
              {images.map((image, idx) => {
                return (
                  <URLImage
                    image={{
                      ...image,
                      handleImageDragStart,
                      onImageDragEnd,
                      index: idx,
                    }}
                    key={idx}
                  />
                );
              })}
            </Layer>
            <Layer>
              {notes.map((note, idx) => (
                <EditableNote
                  x={note.x}
                  y={note.y}
                  index={idx}
                  selected={note.selected}
                  key={idx}
                />
              ))}
            </Layer>
          </Stage>
          <div className="flex absolute bottom-0 flex-row w-full gap-4 mt-4 justify-center ">
            <button
              onClick={undo}
              disabled={historyStep == 0}
              className="py-3 disabled:opacity-30  rounded-md font-semibold"
            >
              <GrUndo size={30} />
            </button>
            <button
              disabled={historyStep >= history.length}
              onClick={redo}
              className="py-3 disabled:opacity-30 rounded-md font-semibold"
            >
              <GrRedo size={30} />
            </button>
          </div>
          <Toolbox>
            <>
              <img
                alt="lion"
                src="https://konvajs.org/assets/lion.png"
                draggable="true"
                className="w-12 h-12"
                onDragStart={(e: any) => {
                  dragUrl.current = e.target.src;
                }}
              />
            </>
          </Toolbox>
        </div>
      </div>
    </>
  );
}

export default Canvas;
