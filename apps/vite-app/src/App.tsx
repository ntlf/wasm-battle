import { useEffect, useMemo, useRef } from "react";
import { Button } from "ui-components";

import {
  RsObject as RsO,
  ObjectType as RsObjectType,
  Universe,
} from "wasm-crate";
import useFpsCounter from "./useFpsCounter";

const SIZE = 20;
const TEAM_SIZE = 25;

const WIDTH = 540;
const HEIGHT = 960;

type ObjectType = keyof typeof RsObjectType;

interface RsObject extends Omit<RsO, "t" | "free"> {
  t: ObjectType;
}

const types: ObjectType[] = [
  ...Array(TEAM_SIZE).fill("Rock"),
  ...Array(TEAM_SIZE).fill("Paper"),
  ...Array(TEAM_SIZE).fill("Scissors"),
].sort(() => Math.random() - 0.5);

const objects: RsObject[] = types.map((t) => ({
  t,
  x: Math.round(Math.random() * (WIDTH - 40) + 20),
  y: Math.round(Math.random() * (HEIGHT - 40) + 20),
  move_x: 0,
  move_y: 0,
}));

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  let animationFrameId = useRef<number>();
  let universe = useMemo(() => Universe.new(WIDTH, HEIGHT, SIZE, objects), []);

  const fps = useFpsCounter();

  const drawEmoji = (context: CanvasRenderingContext2D, obj: RsObject) => {
    const { x, y, t } = obj;

    let emoji = "";
    if (t === "Rock") {
      emoji = "🪨";
    } else if (t === "Paper") {
      emoji = "📃";
    } else if (t === "Scissors") {
      emoji = "✂️";
    }

    context.beginPath();

    context.font = `${SIZE}px system-ui`;
    context.fillText(emoji, x - SIZE / 2, y + SIZE / 2);

    context.closePath();
  };

  const drawBackground = (context: CanvasRenderingContext2D) => {
    context.beginPath();
    context.strokeStyle = "#f3f4f6";

    for (let i = 0; i <= Math.floor(WIDTH / SIZE); i++) {
      context.moveTo(i * SIZE, 0);
      context.lineTo(i * SIZE, HEIGHT);
    }
    for (let j = 0; j <= Math.floor(HEIGHT / SIZE); j++) {
      context.moveTo(0, j * SIZE);
      context.lineTo(WIDTH, j * SIZE);
    }

    context.stroke();
    context.closePath();
  };

  const draw = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    drawBackground(context);

    const objects: RsObject[] = universe.objects();

    objects.forEach((obj) => {
      drawEmoji(context, obj);
    });

    fps.count();
  };

  const render = (loop = false) => {
    const context = canvas?.current?.getContext("2d");

    if (context) {
      universe.tick();
      draw(context);
    }

    if (loop) {
      animationFrameId.current = requestAnimationFrame(() => render(true));
    }
  };

  const toggleLife = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = undefined;
    } else {
      render(true);
    }
  };

  useEffect(() => {
    const context = canvas?.current?.getContext("2d");

    if (context) {
      draw(context);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="relative py-2">
      <div className="top-0 left-0 absolute p-2 space-y-2">
        <div className="text-xs font-mono">
          <div>Avg: {fps.avg}</div>
          <div>Min: {fps.min}</div>
          <div>Max: {fps.max}</div>
        </div>

        <div className="space-y-2 mt-4">
          <Button variant="primary" size="xs" onClick={() => toggleLife()}>
            Start / Stop
          </Button>
          <br />
          <Button variant="secondary" size="xs" onClick={() => render()}>
            Step
          </Button>
          <br />
          <Button
            variant="white"
            size="xs"
            onClick={() => window.location.reload()}
          >
            Reset
          </Button>
        </div>
      </div>

      <canvas
        ref={canvas}
        width={WIDTH}
        height={HEIGHT}
        className="border mx-auto"
      />
    </div>
  );
}

export default App;
