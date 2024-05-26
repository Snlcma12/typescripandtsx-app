import Surfaces from './Surfaces';
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

Surfaces.prototype.cone =
    ({
         point = new Point(0, 0, 0),
         radius = 6,
         height = 15,
         scale = 1,
         color = '#888888',
         segments = 10
    }) => {
        radius = Math.abs(radius)*scale;
        height = Math.abs(height)*scale;
        segments = Math.abs(segments);

        const points = [];
        const edges = [];
        const polygons = [];


        const poly = [];
        // Create points for the base circle
        for (let i = 0; i < segments; i++) {
            const theta = (i / segments) * 2 * Math.PI;
            const x = point.x + radius * Math.cos(theta);
            const z = point.z + radius * Math.sin(theta);
            points.push(new Point(x, point.y - height / 2, z));
            poly.push(i);
        }

        polygons.push(new Polygon(poly, color));

        // Create the apex point
        const apexPoint = new Point(point.x, point.y + height / 2, point.z);
        points.push(apexPoint);

        // Connect points to form the base circle
        for (let i = 0; i < segments; i++) {
            edges.push(new Edge(i, (i + 1) % segments));
            polygons.push(new Polygon([i, (i + 1)%segments, segments], color));
        }

        // Connect points from the base to the apex to form the sides of the cone
        for (let i = 0; i < segments; i++) {
            edges.push(new Edge(i, segments));
        }

        return new Surface(
            points,
            edges,
            polygons,
            point,
            true
        );
    };
