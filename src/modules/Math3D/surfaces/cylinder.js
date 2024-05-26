import Surfaces from "./Surfaces";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

Surfaces.prototype.cylinder =
    ({
         point = new Point(0, 0, 0),
         radius = 5,
         height = 10,
         scale = 1,
         color = '#888888',
         segments = 10
     }) => {
        radius = Math.abs(radius)*scale;
        height = Math.abs(height)* scale;

        const points = [];
        const edges = [];
        const polygons = [];
        // const top_poly = [];
        // const low_poly = [];
        // Create points for the top and bottom circles
        for (let i = 0; i < segments; i++) {
            const theta = (i / segments) * 2 * Math.PI;
            const x = point.x + radius * Math.cos(theta);
            const z = point.z + radius * Math.sin(theta);

            // верхнее кольцо
            points.push(new Point(x, point.y + height/2, z));
            // top_poly.push(i * 2);

            // Bottom circle point
            points.push(new Point(x, point.y - height/2, z));
            // low_poly.push(i * 2 + 1);
        }

        // polygons.push(new Polygon(top_poly, color));
        // polygons.push(new Polygon(low_poly, color));

        for (let i = 0; i < segments; i++) {
            // Connect points to form top and bottom circles
            edges.push(new Edge(i * 2, (i * 2 + 2) % (segments * 2)));
            edges.push(new Edge(i * 2 + 1, (i * 2 + 3) % (segments * 2)));
            // Connect points to form the sides of the cylinder
            edges.push(new Edge(i * 2, (i * 2 + 1) % (segments * 2)));

            polygons.push(new Polygon([
                i * 2,
                (i * 2 + 2) % (segments * 2),
                (i * 2 + 3) % (segments * 2),
                i * 2 + 1
            ], color));
        }

        return new Surface(
            points,
            edges,
            polygons,
            point,
            false
        );
    }