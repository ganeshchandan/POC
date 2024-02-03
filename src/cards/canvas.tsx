import { useEffect, useRef } from "react";
import { TSide } from ".";

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
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.bezierCurveTo(x2, y2, x3, y3, x4, y4);
    ctx.lineTo(x4, y4);
    ctx.lineTo(x5, y5);
    ctx.lineTo(x1, y1);
    ctx.fillStyle = nextColor;
    ctx.fill("nonzero");
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
}

const Canvas = ({ side, backgroundColor, nextColor, arcWidth }: ICanvas) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current && clearTimeout(timerRef.current);
    const width = window.innerWidth;
    let halfWidth = width / 2;
    const quterWidth = halfWidth / 2;
    const height = window.innerHeight;
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx) {
      // ctx.clear(true);
      // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
    if (side === "both") {
      bothSideCanvas(width, height, 0, nextColor);
    } else if (side === "reverse_both") {
      bothSideReverseCanvas(
        halfWidth,
        height,
        quterWidth,
        "rgba(0, 0, 0, 0.3)",
        (halfWidth * 0.55) / 100
      );
    } else if (side !== "none") {
      oneSideCanvas(side, halfWidth, 350, 0, height, nextColor);
    }
  }, [side]);

  const oneSideCanvas = (
    side: TSide,
    width: number,
    arcWidth: number,
    curveWidth: number,
    height: number,
    nextColor: string
  ) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      let x3 = 0;
      let x2 = 0;
      let stopDraw = false;
      const curvePosition = curveWidth * 0.7;
      ctx.clearRect(0, 0, 3000, 3000);
      if (side === "left") {
        x2 = width - curveWidth;
        x3 = x2 - curvePosition;
        stopDraw = x3 <= width - arcWidth;
      } else {
        x2 = width + curveWidth;
        x3 = x2 + curvePosition;
        stopDraw = x3 >= width + arcWidth;
        nextColor = "rgba(0, 0, 0, 0.3)";
      }

      arcDraw(
        ctx,
        [width, 0],
        [x2, 0],
        [x3, height / 2],
        [x2, height],
        [width, height],
        nextColor
      );

      if (!stopDraw) {
        clearTimeout(timerRef.current);
        const timer = setTimeout(
          () =>
            oneSideCanvas(
              side,
              width,
              arcWidth,
              curveWidth + 1,
              height,
              nextColor
            ),
          0
        );
        timerRef.current = timer;
      }
    }
  };

  const bothSideCanvas = (
    width: number,
    height: number,
    count: number,
    nextColor: string
  ) => {
    const ctx = canvasRef.current?.getContext("2d");
    const halfWidth = width / 2;
    if (ctx) {
      let drawWidth = 15 * count;
      const arcWidth = (15 * count * count) / 100;
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
        clearTimeout(timerRef.current);
        const timer = setTimeout(
          () => bothSideCanvas(width, height, count + 1, nextColor),
          0
        );
        timerRef.current = timer;
      } else {
        // ctx.reset();
      }
    }
  };

  const bothSideReverseCanvas = (
    halfWidth: number,
    y3: number,
    quterWidth: number,
    nextColor: string,
    singlePostion: number
  ) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 3000, 3000);
      if (quterWidth <= 0) {
        return;
      }
      const y1 = 0;
      const y2 = y3 / 2;
      let count = quterWidth / 15;
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

      clearTimeout(timerRef.current);
      const timer = setTimeout(
        () =>
          bothSideReverseCanvas(
            halfWidth,
            y3,
            quterWidth - singlePostion,
            nextColor,
            singlePostion
          ),
        0
      );
      timerRef.current = timer;
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
