import React, { useEffect, useState } from "react";
import Graph from '../../modules/Graph/Graph';
import UI2D from "./UI2D/UI2D";

import './Graph2D.css';

let graph: Graph | null = null;

const Graph2D: React.FC = () => {
    const [funcs, setFuncs] = useState<{ f: (x: number) => number; color: string; width: number; }[]>([]);
    const [canMove, setCanMove] = useState<boolean>(false);

    const WIN = {
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20
    };

    useEffect(() => {
        graph = new Graph({
            WIN: WIN,
            id: 'canvas',
            width: 500,
            height: 500,
            callbacks: {
                // @ts-ignore
                wheel: (event: WheelEvent) => wheelHandler(event),
                // @ts-ignore
                mousemove: (event: MouseEvent) => mousemoveHandler(event),
                mouseup: () => mouseupHandler(),
                // @ts-ignore
                mousedown: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => mousedownHandler(event),
                // @ts-ignore
                mouseout: () => mouseoutHandler()
            }
        });
        
        return () => {
            graph = null;
        }
    }, []);

    const wheelHandler = (event: WheelEvent) => { }
    const mouseupHandler = () => { }
    const mousedownHandler = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => { }
    const mousemoveHandler = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => { }
    const mouseoutHandler = () => { }

    const changeFunction = () => {
        renderFrame(funcs);
    }

    const printFunction = (f: (x: number) => number, color: string, strWidth: number, n: number = 200) => {
        console.log(f);

        let x = WIN.LEFT;
        const dx = WIN.WIDTH / n;
        while (x <= WIN.WIDTH + WIN.LEFT) {
            graph!.line(x, f(x), x + dx, f(x + dx), color, strWidth, Math.abs(f(x) - f(x + dx)) >= WIN.HEIGHT)
            x += dx;
        };
    };

    const renderFrame = (funcs: { f: (x: number) => number; color: string; width: number; }[]) => {
        funcs.forEach(func =>
            func && printFunction(func.f, func.color, func.width)
        );
        graph!.renderFrame();
    }

    return (
        <div className="beautyDiv">
            <div>
                <canvas id='canvas' width='300' height='300'></canvas>
            </div>
            <UI2D
            // @ts-ignore
                funcs={funcs}
                changeFunction={() => changeFunction()}
            />
        </div>
    );
}

export default Graph2D;
