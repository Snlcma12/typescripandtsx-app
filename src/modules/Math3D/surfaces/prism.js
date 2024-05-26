import Surfaces from "./Surfaces";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

Surfaces.prototype.prism =
    ({
         point = new Point(0, 0, 0),
         n = 3,
         size = 7.5,
         height = 15,
         scale = 1,
         color = '#888888'
    }) => {
        size = Math.abs(size) * scale;
        height = Math.abs(height) * scale;
        const x = point.x;
        const y = point.y;
        const z = point.z;

        const points = [];
        const edges = [];
        const polygons = [];
        const top_poly = [];
        const low_poly = [];

        // Создание точек
        for (let i = 0; i < 2 * n; i++) {
            const angle = (2 * Math.PI / n) * i;
            const px = x + size * Math.cos(angle);
            const pz = z + size * Math.sin(angle);
            points.push(new Point(px, y+height/2, pz));
            points.push(new Point(px, y - height/2, pz));
            top_poly.push(i * 2);
            low_poly.push(i * 2 + 1);
        }

        polygons.push(new Polygon(top_poly, color));
        polygons.push(new Polygon(low_poly, color));

        // Создание рёбер
        for (let i = 0; i < 2 * n; i += 2) {
            edges.push(new Edge(i, (i + 2) % (2 * n)));
            edges.push(new Edge(i + 1, (i + 3) % (2 * n)));
            edges.push(new Edge(i, i + 1));
            polygons.push(new Polygon([i, i + 1, (i + 3) % (2 * n), (i + 2) % (2 * n)], color));
        }


        return new Surface(points, edges, polygons, point, true);
    };