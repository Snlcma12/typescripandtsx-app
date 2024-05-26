import React, { useEffect } from "react";
import Graph from '../../modules/Graph/Graph';
import UI2D from "./UI2D/UI2D";

import './Graph2D.css';

export type TF = (x: number) => number;

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

    const wheel = (event: WheelEvent) => { }
    const mouseup = () => { }
    const mousedown = (event: MouseEvent) => { }
    const mousemove = (event: MouseEvent) => { }
    const mouseout = () => { }

    const reRender = () => {
        renderFrame();
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

    const renderFrame = () => {
        if (!graph) {
            return;
        }
        graph.clear();
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
                reRender={reRender}
            />
        </div>
    );
}

export default Graph2D;