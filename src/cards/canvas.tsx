import { useEffect, useRef } from "react";
import { TSide } from ".";
import { getAnimationStep } from "../utils";
import { LEFT_SIDE, RIGHT_SIDE } from "./constant";

const arcDraw = (
  ctx: CanvasRenderingContext2D,
  [x1, y1]: number[],
  [x2, y2]: number[],
  [x3, y3]: number[],
  [x4, y4]: number[],
  [x5, y5]: number[],
  nextColor: string
) => {
  if (ctx) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.bezierCurveTo(x2, y2, x3, y3, x4, y4);
    ctx.lineTo(x4, y4);
    ctx.lineTo(x5, y5);
    ctx.lineTo(x1, y1);
    ctx.fillStyle = nextColor;
    ctx.fill("nonzero");
    ctx.closePath();
  }
};

const fullCanvasDraw = (
  ctx: CanvasRenderingContext2D,
  [x1, y1]: number[],
  [x2, y2]: number[],
  [x3, y3]: number[],
  [x4, y4]: number[],
  [x5, y5]: number[],
  [x6, y6]: number[],
  nextColor: string
) => {
  if (ctx) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    ctx.lineTo(x4, y4);
    ctx.bezierCurveTo(x4, y4, x5, y5, x6, y6);
    ctx.lineTo(x1, y1);
    ctx.fillStyle = nextColor;
    ctx.fill("nonzero");
    ctx.closePath();
  }
};

interface ICanvas {
  side: TSide;
  backgroundColor: string;
  nextColor: string;
  arcWidth: number;
  updatePosition: (width: number, angleDirection: string) => void;
}

const Canvas = ({
  side,
  backgroundColor,
  nextColor,
  arcWidth,
  updatePosition,
}: ICanvas) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<{
    timer?: NodeJS.Timeout;
    width: number;
    startPosition: number;
    color: string;
  }>({
    startPosition: 0,
    width: 0,
    color: "rgba(0, 0, 0, 0.3)",
  });

  useEffect(() => {
    const width = window.innerWidth / 2;
    timerRef.current.width = width;
    timerRef.current.startPosition = width;
  }, []);

  useEffect(() => {
    clearTimeout(timerRef.current.timer);
    const width = window.innerWidth;
    let halfWidth = width / 2;
    const quterWidth = halfWidth / 2;
    const height = window.innerHeight;

    if (side === "both") {
      timerRef.current.width = timerRef.current.startPosition;

      bothSideCanvas(
        halfWidth,
        height,
        0,
        nextColor,
        getAnimationStep(halfWidth, 1.6)
      );
    } else if (side === "reverse_both") {
      timerRef.current.width = 0;
      bothSideReverseCanvas(
        halfWidth,
        height,
        quterWidth,
        "rgba(0, 0, 0, 0.3)",
        (halfWidth * 0.55) / 150,
        getAnimationStep(halfWidth, 0.86)
      );
    } else if (side !== "none") {
      const endPosition =
        timerRef.current.startPosition +
        (side === LEFT_SIDE ? -1 : 1) * arcWidth;
      const addOrDelete = timerRef.current.width < endPosition ? 1 : -1;

      oneSideCanvas(
        height,
        nextColor,
        addOrDelete,
        endPosition,
        side
        // timerRef.current.width,
        // arcWidth
      );
    }
  }, [side, arcWidth]);

  const oneSideCanvas = (
    height: number,
    nextColor: string,
    addOrDelete: number,
    endPosition: number,
    side: TSide
  ) => {
    if (side !== LEFT_SIDE && side !== RIGHT_SIDE) {
      return;
    }

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 3000, 3000);
      const width = timerRef.current.startPosition;
      const drwaingWidth = timerRef.current.width + 3 * addOrDelete;
      const curveWidth = width - drwaingWidth;
      let x3 = 0;
      let x2 = 0;
      const curvePosition = curveWidth * 0.7;
      ctx.clearRect(0, 0, 3000, 3000);

      x2 = width - curveWidth;
      x3 = x2 - curvePosition;

      if (
        (addOrDelete === -1 && x3 <= endPosition) ||
        (addOrDelete === 1 && x3 >= endPosition)
      ) {
        x3 = endPosition;
      }

      const canvasColor = x3 < width ? nextColor : "rgba(0, 0, 0, 0.3)";

      updatePosition(x3 - width, x3 < width ? LEFT_SIDE : RIGHT_SIDE);

      timerRef.current.width = drwaingWidth;

      arcDraw(
        ctx,
        [width, 0],
        [x2, 0],
        [x3, height / 2],
        [x2, height],
        [width, height],
        canvasColor
      );

      if (x3 !== endPosition) {
        clearTimeout(timerRef.current.timer);
        const timer = setTimeout(
          () =>
            oneSideCanvas(
              height,
              nextColor,
              addOrDelete,
              endPosition,
              side
              // width,
              // arcWidth
            ),
          0
        );
        timerRef.current.timer = timer;
      }
    }
  };

  const bothSideCanvas = (
    halfWidth: number,
    height: number,
    count: number,
    nextColor: string,
    step: number
  ) => {
    const ctx = canvasRef.current?.getContext("2d");
    // const halfWidth = width / 2;
    if (ctx) {
      let drawWidth = step * count;
      const arcWidth = (step * count * count) / 100;
      const x1 = halfWidth + drawWidth;
      const x4 = halfWidth - drawWidth;

      fullCanvasDraw(
        ctx,
        [x1, 0],
        [x1 + arcWidth, height / 2],
        [x1, height],
        [x4, height],
        [x4 - arcWidth, height / 2],
        [x4, 0],
        nextColor
      );
      if (x4 >= 0) {
        clearTimeout(timerRef.current.timer);
        const timer = setTimeout(
          () => bothSideCanvas(halfWidth, height, count + 1, nextColor, step),
          0
        );
        timerRef.current.timer = timer;
      } else {
        timerRef.current.width = timerRef.current.startPosition;
      }
    }
  };

  const bothSideReverseCanvas = (
    halfWidth: number,
    y3: number,
    quterWidth: number,
    nextColor: string,
    singlePostion: number,
    step: number
  ) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 3000, 3000);
      if (quterWidth <= 0) {
        timerRef.current.width = timerRef.current.startPosition;
        return;
      }
      const y1 = 0;
      const y2 = y3 / 2;
      let count = quterWidth / step;
      const arcWidth = (quterWidth * count) / 100;
      const drawWidth = quterWidth - arcWidth;
      const x2 = halfWidth + quterWidth;
      const x1 = halfWidth + drawWidth;
      const x4 = halfWidth - drawWidth;
      fullCanvasDraw(
        ctx,
        [x1, y1],
        [x2, y2],
        [x1, y3],
        [x4, y3],
        [x4 - arcWidth, y2],
        [x4, 0],
        nextColor
      );

      clearTimeout(timerRef.current.timer);
      const timer = setTimeout(
        () =>
          bothSideReverseCanvas(
            halfWidth,
            y3,
            quterWidth - singlePostion,
            nextColor,
            singlePostion,
            step
          ),
        0
      );
      timerRef.current.timer = timer;
    }
  };

  return (
    <canvas
      key={side}
      style={{ backgroundColor }}
      className="rateCanvas"
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
    ></canvas>
  );
};

export default Canvas;
