import { createContext, use, useState } from "react";

interface LineType {
  tool: "pen" | "eraser";
  stroke: string;
  strokeWidth: number;
  points: number[];
}
interface ImageType {
  x: number;
  y: number;
  src: string;
  index: number;
}
interface NoteType {
  x: number;
  y: number;
  index: number;
  selected: boolean;
  text: string;
}

type HistoryType =
  | {
      state: "draw";
      tool: "pen" | "eraser";
      stroke: string;
      strokeWidth: number;
      points: number[];
    }
  | {
      state: "image";
      x: number;
      y: number;
      src: string;
      index: number;
    }
  | {
      state: "text";
      x: number;
      y: number;
      index: number;
      selected: boolean;
      text: string;
    };

interface CanvasContextType {
  state: "draw" | "text" | "image";
  setState: (state: "draw" | "text" | "image") => void;
  history: HistoryType[];
  historyStep: number;
  setHistory: (history: any) => void;
  setHistoryStep: (step: any) => void;
  undo: () => void;
  redo: () => void;
  draw: {
    lines: LineType[];
    setLines: (line: any) => void;
    tool: "eraser" | "pen";
    stroke: string;
    strokeWidth: number;
    setTool: (tool: "eraser" | "pen") => void;
    setStroke: (stroke: string) => void;
    setStrokeWidth: (width: number) => void;
  };
  text: {
    notes: NoteType[];
    setNotes: (line: any) => void;
  };
  image: {
    images: ImageType[];
    setImages: (line: any) => void;
  };
}

export const CanvasContext = createContext<CanvasContextType>({
  state: "draw",
  setState: () => {},
  history: [],
  historyStep: 0,
  setHistory: (history: any) => {},
  setHistoryStep: (step: any) => {},
  undo: () => {},
  redo: () => {},
  draw: {
    lines: [],
    setLines: () => {},
    tool: "pen",
    stroke: "#DF4B26",
    strokeWidth: 5,
    setTool: () => {},
    setStroke: () => {},
    setStrokeWidth: () => {},
  },
  text: {
    notes: [],
    setNotes: () => {},
  },
  image: {
    images: [],
    setImages: () => {},
  },
});

function CanvasProvider({ children }: { children: JSX.Element }) {
  const [state, setState] = useState<"draw" | "text" | "image">("draw");
  const [tool, setTool] = useState<"eraser" | "pen">("pen");
  const [stroke, setStroke] = useState<string>("#DF4B26");
  const [strokeWidth, setStrokeWidth] = useState<number>(5);
  const [lines, setLines] = useState<LineType[]>([]);
  const [images, setImages] = useState<ImageType[]>([]);
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [history, setHistory] = useState<HistoryType[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(0);

  const undo = () => {
    if (historyStep === 0) {
      return;
    }
    const previous = history[historyStep - 1];
    switch (previous.state) {
      case "image":
        const _images = images.slice();
        _images[previous.index] = {
          ...previous,
        };
        setImages(_images);
        break;
      case "text":
        const _notes = notes.slice();
        _notes[previous.index] = {
          ...previous,
        };
        setNotes(_notes);
        break;
      case "draw":
        const _lines = lines.slice();
        _lines.pop();
        setLines(_lines);
        break;
      default:
        break;
    }
    setHistoryStep((step) => step - 1);
  };
  const redo = () => {
    if (historyStep === history.length) {
      return;
    }
    const next = history[historyStep];
    switch (next.state) {
      case "image":
        const _images = images.slice();
        _images[next.index] = {
          ...next,
        };
        setImages(_images);
        break;
      case "text":
        const _notes = notes.slice();
        _notes[next.index] = {
          ...next,
        };
        setNotes(_notes);
        break;
      case "draw":
        const _lines = lines.slice();
        _lines.push(next);
        setLines(_lines);
        break;
      default:
        break;
    }
    setHistoryStep((step) => step + 1);
  };

  return (
    <CanvasContext.Provider
      value={{
        state,
        setState,
        history,
        historyStep,
        setHistory,
        setHistoryStep,
        undo,
        redo,
        draw: {
          lines,
          setLines,
          tool,
          setTool,
          stroke,
          setStroke,
          strokeWidth,
          setStrokeWidth,
        },
        text: {
          notes,
          setNotes,
        },
        image: {
          images,
          setImages,
        },
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

export default CanvasProvider;
