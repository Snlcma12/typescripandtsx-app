import Graph, { GraphProps } from "./Graph";

declare global {
    interface Window {
        requestAnimFrame: (
            callback: FrameRequestCallback
        ) => number;
        webkitRequestAnimationFrame: (
            callback: FrameRequestCallback
        ) => number;
        mozRequestAnimationFrame: (
            callback: FrameRequestCallback
        ) => number;
        oRequestAnimationFrame: (
            callback: FrameRequestCallback
        ) => number;
        msRequestAnimationFrame: (
            callback: FrameRequestCallback
        ) => number;
        cancelAnimationFrame: (
            handle: number
        ) => void;
    }
}

const useGraph = (renderScene: (FPS: number) => void): [(options: GraphProps) => Graph, () => void] => {
    let graph: Graph | null = null;
    let animationFrameId: number = 0;

    let FPS: number = 0;
    let countFPS: number = 0;
    let timestamp: number = Date.now();
    const renderLoop = (): void => {
        countFPS += 1;
        const currentTimestamp: number = Date.now();
        if (currentTimestamp - timestamp >= 1000) {
            FPS = countFPS;
            countFPS = 0;
            timestamp = currentTimestamp;
        }
        renderScene(FPS);
        animationFrameId = window.requestAnimFrame(renderLoop);
    }

    const getGraph = (options: GraphProps): Graph => {
        graph = new Graph(options);
        renderLoop();
        return graph;
    };

    const cancelGraph = (): void => {
        window.cancelAnimationFrame(animationFrameId);
        graph = null;
    };

    return [
        getGraph,
        cancelGraph
    ];
}

export default useGraph;
