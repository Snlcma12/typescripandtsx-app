import React from "react";
import Math3D from "../../modules/Math3D/Math3D";
import Graph from "../../modules/Graph/Graph";
import Point from "../../modules/Math3D/entities/Point";
import Light from "../../modules/Math3D/entities/Light";
import Surfaces from "../../modules/Math3D/surfaces/Surfaces";

import Sphere from "../../modules/Math3D/surfaces/sphere";
import Cube from "../../modules/Math3D/surfaces/cube";
import Torus from "../../modules/Math3D/surfaces/torus";

import './Graph3D.css';

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

class Graph3D extends React.Component {
    constructor(props) {
        super(props);
        this.Graph3DRef = React.createRef();
        this.polygonsOnly = React.createRef();
        this.edgesOnly = React.createRef();
        this.pointOnly = React.createRef();
        this.graph3DViewShadowsRef = React.createRef();
        this.graph3DRotateLightRef = React.createRef();
        this.graph3DPlayAnimationRef = React.createRef();
        this.WIN = {
            LEFT: -5,
            BOTTOM: -5,
            WIDTH: 10,
            HEIGHT: 10,
            CENTER: new Point(0, 0, -40),
            CAMERA: new Point(0, 0, -50),
        };
        this.math3D = new Math3D(this.WIN);
        this.gradus = Math.PI / 180 / 4;
        this.zoomStep = 0.1;
        this.moveStep = 4;
        this.canMove = false;
        this.math3D = new Math3D(this.WIN);
        this.rotateXT = this.math3D.getOneT();
        this.rotateYT = this.math3D.getOneT();
        this.rotateZT = this.math3D.getOneT();
        this.scene = [];
        this.deltaPosT = [
            [1 + this.zoomStep, 0, 0, 0],
            [0, 1 + this.zoomStep, 0, 0],
            [0, 0, 1 + this.zoomStep, 0],
            [0, 0, 0, 1]
        ];
        this.deltaNegT = [
            [1 - this.zoomStep, 0, 0, 0],
            [0, 1 - this.zoomStep, 0, 0],
            [0, 0, 1 - this.zoomStep, 0],
            [0, 0, 0, 1]
        ];
        this.LIGHT = new Light(-30, 20, -30, 1500);
        this.surfaces = new Surfaces();
        // this.scene.push(this.surfaces.sphere({}));

    }

    addEventListeners() {
        document.getElementById("SelectSurface")
            .addEventListener("change", (event) => {
                this.updateScene(event.target.value);
            });
    }


    updateScene(selectedShape) {
        switch (selectedShape) {
            case "cube":
                this.scene = [new Cube({ color: '#ffff00' })];
                break;
            case "sphere":
                this.scene = [new Sphere({ color: '#ffff00' })];
                break;
            case "torus":
                this.scene = [new Torus({ color: '#ffff00' })];
                break;
            
            default:
                this.scene = [];
                break;
        }
    }


    componentDidMount() {
        this.graph = new Graph({
            id: 'Graph3D',
            WIN: this.WIN,
            width: 500,
            height: 500,
            callbacks: {
                wheel: (event) => this.wheelHandler(event),
                mousemove: (event) => this.mousemoveHandler(event),
                mouseup: () => this.mouseupHandler(),
                mousedown: (event) => this.mousedownHandler(event),
                mouseout: () => this.mouseoutHandler()
            }
        });
        this.interval = setInterval(() => {
            if (this.graph3DPlayAnimationRef.current.value) {
                this.scene.forEach(surface => surface.doAnimation(this.math3D));
            }
        }, 20);
        this.addEventListeners();
        let FPS = 0;
        let countFPS = 0;
        let timestamp = Date.now();
        this.renderLoop = () => {
            countFPS += 1;
            const currentTimestamp = Date.now();
            if (currentTimestamp - timestamp >= 1000) {
                FPS = countFPS;
                countFPS = 0;
                timestamp = currentTimestamp;
            }
            this.renderScene(FPS);
            window.requestAnimFrame(this.renderLoop);
        }
        this.renderLoop();
        document.querySelectorAll('.surfaceCustom').forEach(input => {
            input.addEventListener("input", (event) => {
                this[event.target.dataset.custom] = event.target.checked;
            });
        });
        document.getElementById("meshColor").addEventListener("input", (event) => {
            this.color = event.target.value;
            this.renderScene();
        });
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.renderLoop);
        clearInterval(this.interval);
        this.graph = null;
    }

    SolarSystem() {
        const earth = this.surfaces.sphere({ scale: 0.25, color: '#2d7516', point: new Point(15, 0, 0) });
        earth.addAnimation('getOyRotateT', 0.1);
    
        const moon = this.surfaces.cube({ scale: 0.1, point: new Point(20, 0, 0) });
        moon.addAnimation('getOxRotateT', 0.2);
        moon.addAnimation('getOyRotateT', 0.05);
    
        return [earth, moon];
    }

    wheelHandler(event) {
        event.preventDefault();
        let T = [];
        let delta = 0;
        if (event.wheelDelta > 0) {
            delta = 1 + this.zoomStep;
            T = this.deltaPosT;
        } else {
            delta = 1 - this.zoomStep;
            T = this.deltaNegT;
        }
        if (this.graph3DRotateLightRef.current.value) {
            this.LIGHT.lumen *= delta ** 2;
            this.math3D.transformPoint(this.LIGHT, T);
        }
        this.scene.forEach(surface => {
            surface.points.forEach(point => this.math3D.transformPoint(point, T));
            this.math3D.transformPoint(surface.center, T);
        });
    }


    mouseupHandler() {
        this.canMove = false;
    }

    mousedownHandler(event) {
        event.preventDefault();
        this.canMove = true;
        this.mouseButton = event.button;
    }

    mousemoveHandler(event) {
        event.preventDefault();
        if (this.canMove) {
            switch (this.mouseButton) {
                case 0:
                    let alphaY = 0, alphaX = 0;
                    if (this.dy !== event.offsetY) {
                        alphaX = (this.dy - event.offsetY) * this.gradus;
                    }
                    if (this.dx !== event.offsetX) {
                        alphaY = (this.dx - event.offsetX) * this.gradus;
                    }
                    this.rotateXT = this.math3D.getOxRotateT(alphaX);
                    this.rotateYT = this.math3D.getOyRotateT(alphaY);
                    this.scene.forEach(surface => {
                        surface.points.forEach(point => {
                            this.math3D.transformPoint(point, this.rotateXT);
                            this.math3D.transformPoint(point, this.rotateYT);
                        });
                        this.math3D.transformPoint(surface.center, this.rotateYT);
                        this.math3D.transformPoint(surface.center, this.rotateXT);
                    });
                    if (this.graph3DRotateLightRef.current.value) {
                        this.math3D.transformPoint(this.LIGHT, this.rotateYT);
                        this.math3D.transformPoint(this.LIGHT, this.rotateXT);
                    }

                    break;
                case 1:
                    const dy = this.graph.sy(event.movementY) * this.moveStep;
                    const T1 = this.math3D.getMoveT({ dy });
                    this.scene.forEach(surface => {
                        surface.points.forEach(point =>
                            this.math3D.transformPoint(point, T1));
                        this.math3D.transformPoint(surface.center, T1);
                    });
                    if (this.graph3DRotateLightRef.current.value) {
                        this.math3D.transformPoint(this.LIGHT, T1);
                    }
                    break;
                case 2:
                    const dx = this.graph.sx(event.movementX) * this.moveStep;
                    const T2 = this.math3D.getMoveT({ dx })
                    this.scene.forEach(surface => {
                        surface.points.forEach(point =>
                            this.math3D.transformPoint(point, T2));
                        this.math3D.transformPoint(surface.center, T2);
                    });
                    if (this.graph3DRotateLightRef.current.value) {
                        this.math3D.transformPoint(this.LIGHT, T2);
                    }
                    break;
            }
        }
        this.dy = event.offsetY;
        this.dx = event.offsetX;
    }

    mouseoutHandler() {
        this.canMove = false;
    }

    checkboxHandler(ref) {
        return !ref.current.checked;
    }

    clearScene() {
        this.scene = [];
    }

    renderScene(FPS = 0) {
        if (this.graph) {

            this.graph.clear();

            this.scene.forEach((surface) => {
                if (this.polygonsOnly) {
                    let polygons = [];
                    this.scene.forEach((surface, index) => {
                        this.math3D.calcCenter(surface);
                        this.math3D.calcRadius(surface);
                        this.math3D.calcDistance(surface, this.WIN.CAMERA, 'distance');
                        this.math3D.calcDistance(surface, this.LIGHT, 'lumen');
                        if (surface.bulge) this.math3D.calcVisibility(surface, this.WIN.CAMERA);
                        surface.polygons.forEach(polygon => {
                            polygon.index = index;
                            polygons.push(polygon);
                        })
                    });
                    this.math3D.sortByArtistAlgorithm(polygons);
                    polygons.forEach(polygon => {
                        if (polygon.visibility) {
                            const points = polygon.points.map(index => new Point(
                                this.math3D.xs(this.scene[polygon.index].points[index]),
                                this.math3D.ys(this.scene[polygon.index].points[index])
                            ));
                            let { r, g, b } = polygon.color;
                            const { isShadow, dark } = (this.viewShadows) ?
                                this.math3D.calcShadow(polygon, this.scene, this.LIGHT) :
                                { isShadow: false, dark: 1 };
                            const lumen = this.math3D.calcIllumination(polygon.lumen,
                                this.LIGHT.lumen) * (isShadow ? dark : 1);
                            r = Math.round(r * lumen);
                            g = Math.round(g * lumen);
                            b = Math.round(b * lumen);
                            this.graph.polygon(points, polygon.rgbToHex(r, g, b));
                        }
                    });
                }

                if (this.edgesOnly) {
                    surface.edges.forEach(edge => {
                        const point1 = surface.points[edge.p1];
                        const point2 = surface.points[edge.p2];
                        this.graph.line(
                            this.math3D.xs(point1), this.math3D.ys(point1),
                            this.math3D.xs(point2), this.math3D.ys(point2),
                            this.color
                        );
                    });
                }

                if (this.pointOnly) {
                    this.graph.point(this.math3D.xs(surface.center), this.math3D.ys(surface.center), 'red')
                    surface.points.forEach(
                        point => this.graph.point(this.math3D.xs(point), this.math3D.ys(point), point.color)
                    );
                }
            });

            this.graph.text(`fps: ${FPS}`, this.WIN.LEFT, this.WIN.BOTTOM - 1, 'black', 25);
            this.graph.renderFrame();
        }
    }

    render() {
        return (<>
            <canvas id="Graph3D"></canvas>
            <div className="controls-wrapper">
            <div>
                <button ref={this.Graph3DRef} onClick={() => this.clearScene()}>очистить</button>
                <div>
                <select id="SelectSurface">
                    <option value="cube">Куб</option>
                    <option value="sphere">Сфера</option>
                    <option value="torus">Торус</option>
                    </select>
                </div>
            </div>
            <div>
                <button ref={this.Graph3DRef} onClick={() => this.clearScene()}>очистить</button>
                <label>Рисовать тени</label>
                    <input type="checkbox" ref={this.graph3DRotateLightRef} className="surfaceCustom"
                        onClick={() => this.checkboxHandler(this.graph3DViewPointsRef)} />
                    <label>Вращать свет со сценой</label>
                    <input type="checkbox" ref={this.graph3DPlayAnimationRef} className="surfaceCustom"
                        onClick={() => this.checkboxHandler(this.graph3DViewPointsRef)} />
                    <label>анимации</label>
            </div>
            <div class="gp3d">
        <input class='surfaceCustom' data-custom='pointOnly' id="pointOnly" type="checkbox"  />
        <label for="pointOnly">Точки</label>
    </div>
    <div class="gp3d">
        <input class='surfaceCustom' data-custom='edgesOnly' id="edgesOnly" type="checkbox" />
        <label for="edgesOnly">Ребра</label>
    </div>
    <div class="gp3d">
        <input class='surfaceCustom' data-custom='polygonsOnly' id="polygonsOnly" type="checkbox" checked/>
        <label for="polygonsOnly">Полигоны</label>
    </div>
    <div class="gp3d">
        <input class='surfaceCustom' data-custom='color' type="color" id="meshColor" value="#e66465" />
        <label for="meshColor">Color</label>
    </div>
            </div>
        </>);
    }
}

export default Graph3D;