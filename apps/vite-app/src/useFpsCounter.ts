import { useRef, useState } from "react";

function useFpsCounter() {
  const lastFrameTimeStamp = useRef(performance.now());
  const [frames, setFrames] = useState<number[]>([]);

  const count = () => {
    const now = performance.now();
    const delta = now - lastFrameTimeStamp.current;
    lastFrameTimeStamp.current = now;
    const fps = (1 / delta) * 1000;

    setFrames((frames) => {
      const newFrames = [...frames, fps];
      if (newFrames.length > 100) {
        newFrames.shift();
      }
      return newFrames;
    });
  };

  return {
    count,
    avg: Math.round(
      frames.reduce((acc, curr) => acc + curr, 0) / frames.length
    ),
    min: Math.round(
      frames.reduce((acc, curr) => Math.min(acc, curr), +Infinity)
    ),
    max: Math.round(
      frames.reduce((acc, curr) => Math.max(acc, curr), -Infinity)
    ),
  };
}

export default useFpsCounter;
