import { useEffect, useRef } from "react";
import { TSide } from ".";

const arcDraw = (ctx: CanvasRenderingContext2D, 
    [x1, y1] : number[],
    [x2, y2] : number[],
    [x3, y3] : number[],
    [x4, y4] : number[],
    [x5, y5] : number[],
    nextColor: string
    ) => {
    if(ctx){
       ctx.moveTo(x1 , y1);
       ctx.lineTo(x2 , y2);
       ctx.bezierCurveTo(x2, y2, 
                         x3, y3, 
                         x4, y4);
       ctx.lineTo(x4 , y4);
       ctx.lineTo(x5 , y5);
       ctx.lineTo(x1 , y1);
       ctx.fillStyle = nextColor;
       ctx.fill("nonzero");
   }
}

const fullCanvasDraw = (ctx: CanvasRenderingContext2D, 
    [x1, y1] : number[],
    [x2, y2] : number[],
    [x3, y3] : number[],
    [x4, y4] : number[],
    [x5, y5] : number[],
    [x6, y6] : number[],
    nextColor: string
    ) => {
    if(ctx){
       ctx.moveTo(x1 , y1);
       ctx.bezierCurveTo(x1, y1, 
        x2, y2, 
        x3, y3);
       ctx.lineTo(x4 , y4);
       ctx.bezierCurveTo(x4, y4, 
        x5, y5, 
        x6, y6);
       ctx.lineTo(x1 , y1);
       ctx.fillStyle = nextColor;
       ctx.fill("nonzero");
   }
}

interface ICanvas{
    side : TSide;
    backgroundColor : string;
    nextColor : string;
}

const Canvas = ({
    side,
    backgroundColor,
    nextColor
} : ICanvas) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const timerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        timerRef.current && clearTimeout(timerRef.current)
        const width = window.innerWidth;
        let halfWidth = width /4 ;
        const height = window.innerHeight ;
        const ctx = canvasRef.current?.getContext("2d");
        
        if(ctx){
            // ctx.clear(true);
            // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        }
        if(side === "both"){
            bothSideCanvas(width,height,0, nextColor);
        }else if(side !== "none"){
            oneSideCanvas(side, width /2 , Math.ceil(halfWidth / 5) , height, 0, nextColor);
        }

    },[side]);

    const oneSideCanvas = (side : TSide,
        width : number, 
        halfWidth : number , 
        height : number,
        count : number,
        nextColor : string) => {
        const ctx = canvasRef.current?.getContext("2d");
        if(ctx){
            let curveWidth = 5*count;
    
            let x3 = curveWidth;
            const curvePosition = (5*count * count / 100)
            if(side === "left"){
                curveWidth = width - curveWidth;
                x3 = curveWidth - curvePosition;
            }else{
                curveWidth = width + curveWidth;
                x3 = curveWidth + curvePosition;
            }
    
            arcDraw(ctx, 
                [width , 0],
                [curveWidth , 0],
                [x3, height/2],
                [curveWidth , height],
                [width, height],
                nextColor
            );
        }
        

        if( count <= halfWidth){
            clearTimeout(timerRef.current);
            const timer = setTimeout(() => oneSideCanvas(side,width,halfWidth,height, count+1, nextColor), 0);
            timerRef.current = timer;
        }
   }

   const bothSideCanvas = (width : number, 
   height : number,
   count : number,
   nextColor : string) => {
        const ctx = canvasRef.current?.getContext("2d");
        const halfWidth = width /2;
        if(ctx){
                let drawWidth = 5*count;
                const arcWidth = (5*count * count / 100);
                const x1 = halfWidth+drawWidth;
                const x4 = halfWidth - drawWidth;

            fullCanvasDraw(ctx, 
                [x1 , 0],
                [x1+arcWidth , height/2],
                [x1, height],
                [x4 , height],
                [x4  -arcWidth , height/2],
                [x4, 0],
                nextColor
            );
            if( x4 >= 0){
                clearTimeout(timerRef.current);
                const timer = setTimeout(() => bothSideCanvas(width,height, count+1, nextColor), 10);
                timerRef.current = timer;
            }else{
                ctx.reset();
            }
        } 
    }
   
    return <canvas 
                key = {side}
                style={{backgroundColor }}
                className="rateCanvas"
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
            ></canvas>
}

export default Canvas;
