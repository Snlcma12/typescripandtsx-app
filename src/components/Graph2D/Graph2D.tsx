import React, { useEffect } from "react";
import Graph from '../../modules/Graph/Graph';
import UI2D from "./UI2D/UI2D";


type TF = (x: number) => number;

export type TFunction = {
    f: TF;
    color: string;
    width: number;
};

const Graph2D: React.FC = () => {
    const WIN = {
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20
    }
    const funcs: TFunction[] = [];
    let canMove = false;
    let graph: Graph | null = null;

    

    const changeFunction = () => {
        renderFrame();
    }







    const ZOOM_STEP = 1; 

    const wheel = (event: WheelEvent): void => {
        const delta: number = (event.deltaY > 0) ? -ZOOM_STEP : ZOOM_STEP;
        if (WIN.WIDTH + delta > 0) {
            WIN.WIDTH += delta;
            WIN.HEIGHT += delta;
            WIN.LEFT -= delta / 2;
            WIN.BOTTOM -= delta / 2;
            renderFrame();
        }
    }
    
    const mouseup = () => {
        canMove = false;
    }
    
    const mouseout = () => {
        canMove = false;
    }
    
    const mousedown = () => {
        canMove = true;
    }
    
    const mousemove = (event: MouseEvent) => {
        if (canMove && graph) {
            WIN.LEFT -= graph.sx(event.movementX);
            WIN.BOTTOM -= graph.sy(event.movementY);
            renderFrame();
        }
    }

    const printFunction = (f: TF, color: string, strWidth: number, n = 200): void => {
        if (!graph) {
            return;
        }
        let x = WIN.LEFT;
        const dx = WIN.WIDTH / n;
        while (x <= WIN.WIDTH + WIN.LEFT) {
            graph.line(
                x,
                f(x),
                x + dx,
                f(x + dx),
                color,
                strWidth,
                Math.abs(f(x) - f(x + dx)) >= WIN.HEIGHT
            )
            x += dx;
        };
    };

    const coordOs = (): void => { 
        if (!graph) {
            return;
        }
        for (let i: number = 0; i <= WIN.WIDTH; i++) { 
            graph.line(i, WIN.BOTTOM, i, WIN.BOTTOM + WIN.HEIGHT, 'gray'); 
        }
        for (let i: number = 0; i <= WIN.HEIGHT; i++) { 
            graph.line(WIN.LEFT, i, WIN.LEFT + WIN.WIDTH, i, 'gray'); 
        }
        for (let i: number = 0; i >= WIN.LEFT; i--) { 
            graph.line(i, WIN.BOTTOM, i, WIN.BOTTOM + WIN.HEIGHT, 'gray'); 
        }
        for (let i: number = 0; i >= WIN.BOTTOM; i--) { 
            graph.line(WIN.LEFT, i, WIN.LEFT + WIN.WIDTH, i, 'gray'); 
        }
    
        graph.line(WIN.LEFT, 0, WIN.LEFT + WIN.WIDTH, 0, 'black');
        graph.line(0, WIN.BOTTOM, 0, WIN.HEIGHT + WIN.BOTTOM, 'black');
    }
    

    const renderFrame = () => {
        if (!graph) {
            return;
        }
        graph.clear();
        coordOs();
        funcs.forEach(func => printFunction(func.f, func.color, func.width));
        graph.renderFrame();
    }

    useEffect(() => {
        graph = new Graph({
            WIN,
            id: 'canvas',
            width: 500,
            height: 500,
            callbacks: {
                wheel,
                mousemove,
                mouseup,
                mousedown,
                mouseout,
            }
        });

        return () => {
            graph = null;
        }
    });

    return (
        <div className="beautyDiv">
            <div>
                <canvas id='canvas' width='300' height='300'></canvas>
            </div>
            <UI2D
                funcs={funcs}
                changeFunction={changeFunction}

            />
        </div>
    );
}

export default Graph2D;
