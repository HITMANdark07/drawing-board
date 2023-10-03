"use client";
import CanvasProvider from "@/context/CanvasContext";
import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("../components/global/Canvas"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="bg-white h-full">
      <div className="flex flex-row my-4 w-full justify-center">
        <div className="font-semibold text-2xl">Drawing Board</div>
      </div>
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    </div>
  );
}
