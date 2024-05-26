import React, { useRef, useEffect } from "react";
import Math3D from "../../modules/Math3D/Math3D";
import useGraph from "../../modules/Graph/useGraph";
import Graph, { TWIN3D } from "../../modules/Graph/Graph";
import Point from "../../modules/Math3D/entities/Point";
import Light from "../../modules/Math3D/entities/Light";
import Sphere from "../../modules/Math3D/surfaces/sphere";
import Surface from "../../modules/Math3D/entities/Surface";
import Polygon, { EDistance } from "../../modules/Math3D/entities/Polygon";

import './Graph3D.css';







const Graph3D: React.FC = () => {
    const graph3DViewPointsRef = useRef<HTMLInputElement>(null);
    const graph3DViewEdgesRef = useRef<HTMLInputElement>(null);
    const graph3DViewPolygonsRef = useRef<HTMLInputElement>(null);
    const graph3DRotateLightRef = useRef<HTMLInputElement>(null);
    const graph3DPlayAnimationRef = useRef<HTMLInputElement>(null);
    const WIN: TWIN3D = {
        LEFT: -5,
        BOTTOM: -5,
        WIDTH: 10,
        HEIGHT: 10,
        CENTER: new Point(0, 0, -40),
        CAMERA: new Point(0, 0, -50),
    };
    let graph: Graph | null = null;
    const [getGraph, cancelGraph] = useGraph(renderScene);
    const math3D = new Math3D(WIN);
    const LIGHT = new Light(-30, 20, -30, 1500);
    let scene: Surface[] = [new Sphere({ color: '#ffff00' })];
    const gradus = Math.PI / 180 / 4;
    const zoomStep = 0.1;
    const moveStep = 4;
    let canMove = false;
    let mouseButton: number;
    let dx = 0;
    let dy = 0;
    let viewShadows = false;

    function wheelHandler(event: WheelEvent) {
        event.preventDefault();
        const delta = event.deltaY > 0 ? 1 + zoomStep : 1 - zoomStep;
        const T = math3D.zoom(delta);
        scene.forEach(surface => {
            surface.points.forEach(point => math3D.transform(point, T));
            math3D.transform(surface.center, T);
        });
    }

    function mouseupHandler() {
        canMove = false;
    }

    function mousedownHandler(event: MouseEvent) {
        event.preventDefault();
        canMove = true;
        mouseButton = event.button;
    }

    function mousemoveHandler(event: MouseEvent) {
        event.preventDefault();
        if (canMove) {
            switch (mouseButton) {
                case 0: {
                    let alphaY = 0, alphaX = 0;
                    if (dy !== event.offsetY) {
                        alphaX = (dy - event.offsetY) * gradus;
                    }
                    if (dx !== event.offsetX) {
                        alphaY = (dx - event.offsetX) * gradus;
                    }
                    const T1 = math3D.rotateOX(alphaX);
                    const T2 = math3D.rotateOY(alphaY);
                    const T = math3D.getTransform(T1, T2);
                    scene.forEach(surface => {
                        surface.points.forEach(point => math3D.transform(point, T));
                        math3D.transform(surface.center, T);
                    });
                    if (graph3DRotateLightRef?.current?.checked) {
                        math3D.transform(LIGHT, T);
                    }
                    break;
                }
                case 1: {
                    if (!graph) {
                        return;
                    }
                    const T = math3D.move(0, graph.sy(event.movementY) * moveStep);
                    scene.forEach(surface => {
                        surface.points.forEach(point => math3D.transform(point, T));
                        math3D.transform(surface.center, T);
                    });
                    if (graph3DRotateLightRef?.current?.checked) {
                        math3D.transform(LIGHT, T);
                    }
                    break;
                }
                case 2: {
                    if (!graph) {
                        return;
                    }
                    const T = math3D.move(graph.sx(event.movementX) * moveStep);
                    scene.forEach(surface => {
                        surface.points.forEach(point => math3D.transform(point, T));
                        math3D.transform(surface.center, T);
                    });
                    if (graph3DRotateLightRef?.current?.checked) {
                        math3D.transform(LIGHT, T);
                    }
                    break;
                }
            }
        }
        dy = event.offsetY;
        dx = event.offsetX;
    }

    function mouseoutHandler() {
        canMove = false;
    }

    function clearScene() {
        scene = [];
    }

    function renderScene(FPS = 0) {
        if (!graph) {
            return;
        }
        graph.clear();
        scene.forEach((surface) => {
            if (graph3DViewPolygonsRef?.current?.value) {
                const polygons: Polygon[] = [];
                scene.forEach((surface, index) => {
                    math3D.calcCenter(surface);
                    math3D.calcRadius(surface);
                    math3D.calcDistance(surface, WIN.CAMERA, EDistance.distance);
                    math3D.calcDistance(surface, LIGHT, EDistance.lumen);
                    if (surface.bulge)
                        math3D.calcVisibility(surface, WIN.CAMERA);
                    surface.polygons.forEach(polygon => {
                        polygon.index = index;
                        polygons.push(polygon);
                    })
                });
                math3D.sortByArtistAlgorithm(polygons);
                polygons.forEach(polygon => {
                    if (polygon.visibility) {
                        const points = polygon.points.map(index => new Point(
                            math3D.xs(scene[polygon.index].points[index]),
                            math3D.ys(scene[polygon.index].points[index])
                        ));
                        let { r, g, b } = polygon.color;
                        const { isShadow, dark } = (viewShadows) ?
                            math3D.calcShadow(polygon, scene, LIGHT) :
                            { isShadow: false, dark: 1 };
                        const lumen = math3D.calcIllumination(polygon.lumen,
                            LIGHT.lumen) * (isShadow && dark ? dark : 1);
                        r = Math.round(r * lumen);
                        g = Math.round(g * lumen);
                        b = Math.round(b * lumen);
                        graph && graph.polygon(points, polygon.rgbToHex(r, g, b));
                    }
                });
            }
            if (graph3DViewEdgesRef?.current?.checked) {
                surface.edges.forEach(edge => {
                    const point1 = surface.points[edge.p1];
                    const point2 = surface.points[edge.p2];
                    graph && graph.line(
                        math3D.xs(point1), math3D.ys(point1),
                        math3D.xs(point2), math3D.ys(point2)
                    );
                });
            }

            if (graph3DViewPointsRef?.current?.checked) {
                graph && graph.pointLite(math3D.xs(surface.center), math3D.ys(surface.center), 'red')
                surface.points.forEach(
                    point => graph && graph.pointLite(math3D.xs(point), math3D.ys(point))
                );
            }
            graph && graph.drawSun(math3D.xs(LIGHT), math3D.ys(LIGHT));
        });

        graph.text(`fps: ${FPS}`, WIN.LEFT, WIN.BOTTOM - 1, 'black', '25');
        graph.renderFrame();
    }

    useEffect(() => {
        graph = getGraph({
            id: 'Graph3D',
            WIN,
            width: 600,
            height: 600,
            callbacks: {
                wheel: wheelHandler,
                mousemove: mousemoveHandler,
                mouseup: mouseupHandler,
                mousedown: mousedownHandler,
                mouseout: mouseoutHandler,
            }
        });
        const interval = setInterval(() => {
            if (graph3DPlayAnimationRef?.current?.checked) {
                scene.forEach(surface => surface.doAnimation(math3D));
            }
        }, 20);

        return () => {
            cancelGraph();
            clearInterval(interval);
        }
    });

    return (<>
        <canvas id="Graph3D"></canvas>
        <div>
            <label>
                <input ref={graph3DViewPointsRef} type="checkbox" /> Отображать точки
            </label>
            <label>
                <input ref={graph3DViewEdgesRef} type="checkbox" /> Отображать ребра
            </label>
            <label>
                <input ref={graph3DViewPolygonsRef} type="checkbox" /> Отображать полигоны
            </label>
            <label>
                <input ref={graph3DRotateLightRef} type="checkbox" /> Вращать источник света
            </label>
            <label>
                <input ref={graph3DPlayAnimationRef} type="checkbox" /> Запуск анимации
            </label>
        </div>
    </>);
};

export default Graph3D;
