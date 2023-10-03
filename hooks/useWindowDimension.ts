import { useEffect, useState } from "react";

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({ width: 300, height: 300 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    });
    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return { width: windowSize.width, height: windowSize.height };
}
