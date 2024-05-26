import Surfaces from "./Surfaces";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

Surfaces.prototype.ellipsoid =
    ({
         point = new Point(0, 0, 0),
         radiusX = 5,
         radiusY = 6,
         radiusZ = 7,
         scale = 1,
         color = '#888888',
         segments = 10
    }) => {

        radiusX = Math.abs(radiusX) * scale;
        radiusY = Math.abs(radiusY) * scale;
        radiusZ = Math.abs(radiusZ) * scale;

        const points = [];
        const edges = [];
        const polygons = [];

        for (let i = 0; i <= segments; i++) {
            const phi = (i / segments) * Math.PI;
            const y = point.y - radiusY * Math.cos(phi);

            for (let j = 0; j <= segments; j++) {
                const theta = (j / segments) * (2 * Math.PI);
                const x = point.x - radiusX * Math.sin(phi) * Math.cos(theta);
                const z = point.z - radiusZ * Math.sin(phi) * Math.sin(theta);
                points.push(new Point(x, y, z));
            }
        }

        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                const p1 = i * (segments + 1) + j;
                const p2 = p1 + 1;
                const p3 = (i + 1) * (segments + 1) + j;
                const p4 = p3 + 1;

                edges.push(new Edge(p1, p2));
                edges.push(new Edge(p2, p4));
                edges.push(new Edge(p4, p3));
                edges.push(new Edge(p3, p1));
                polygons.push(new Polygon([p1, p2, p4, p3], color));
            }
        }

        return new Surface(points, edges, polygons, point, true);
    }