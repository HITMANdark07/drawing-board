import { CanvasContext } from "@/context/CanvasContext";
import React, { useContext } from "react";
import { PiEraser, PiPencilCircleDuotone, PiTextTBold } from "react-icons/pi";

const COLORS = [
  "#DF4B26",
  "#33FF57",
  "#3366FF",
  "#FF33FF",
  "#FFFF33",
  "#33FFFF",
  "#FF3366",
  "#33FFCC",
  "#CC33FF",
  "#99FF33",
];

function Toolbox({ children }: { children: JSX.Element }) {
  const {
    setState,
    draw: { setTool, setStroke, stroke, setStrokeWidth },
  } = useContext(CanvasContext);
  return (
    <div className="absolute flex flex-col items-center bg-white right-4 top-4 min-w-8  rounded-md shadow-xl min-h-[90%]">
      <div
        className="rounded-lg  w-10 h-10 m-3"
        style={{ background: stroke }}
      ></div>
      <div className="grid grid-cols-2 gap-2">
        {COLORS.map((color) => (
          <div
            key={color}
            className={"border-2 rounded-full"}
            style={{
              borderColor: stroke === color ? stroke : `#FFFFFF`,
            }}
          >
            <div
              style={{ background: color }}
              className={`w-4 h-4 rounded-full m-[0.5px]  shadow-md cursor-pointer ${
                stroke === color && `border border-white`
              }`}
              onClick={() => {
                setStroke(color);
                setState("draw");
                setTool("pen");
                setStrokeWidth(5);
              }}
            />
          </div>
        ))}
      </div>
      <div className=" mt-3 w-full flex flex-row justify-center">
        <PiPencilCircleDuotone
          onClick={() => {
            setState("draw");
            setTool("pen");
            setStrokeWidth(5);
          }}
          size={40}
          color={stroke}
        />
      </div>
      <div className=" mt-3 w-full flex flex-row justify-center">
        <PiEraser
          size={40}
          onClick={() => {
            setState("draw");
            setTool("eraser");
            setStrokeWidth(25);
          }}
        />
      </div>
      <div className="pt-3 w-full flex flex-row justify-center">
        <div
          onClick={() => {
            setState("text");
          }}
          className="rounded-lg p-2 bg-blue-500"
        >
          <div className="border-2  border-gray-200 ">
            <PiTextTBold size={25} color="#FFFFFF" />
          </div>
        </div>
      </div>
      <div className="h-full w-full flex flex-col mt-3 items-center">
        {children}
      </div>
    </div>
  );
}

export default Toolbox;
