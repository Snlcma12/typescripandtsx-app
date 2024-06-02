import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";
import Surface from "../entities/Surface";

class EllipticalParaboloid extends Surface {
    constructor({
        a = 10, b = 5, count = 20, color = "lightgreen", x = 0, y = 0, z = 0
    } = {}) {
        super();
        const points = [];
        const edges = [];
        const polygons = [];
        const dt = a / count;
        const dp = (2 * Math.PI) / count;

        for (let i = 0; i <= count; i++) {
            for (let j = 0; j < count; j++) {
                points.push(new Point(
                    dt * i * Math.cos(j * dp) + x,
                    b * (dt * i) ** 2 + y,
                    dt * i * Math.sin(j * dp) + z
                ));
            }
        }

        for (let i = 0; i < points.length; i++) {
            if (i + 1 < points.length && (i + 1) % count !== 0) {
                edges.push(new Edge(i, i + 1));
            }
            if (points[i + count]) {
                edges.push(new Edge(i, i + count));
            }
            if ((i + 1) % count === 0 && points[i + count - count + 1]) {
                edges.push(new Edge(i, i + count - count + 1));
            }
        }

        for (let i = 0; i < points.length; i++) {
            if (points[i + count + 1] && (i + 1) % count !== 0) {
                polygons.push(new Polygon([i, i + 1, i + count + 1, i + count], color));
            }
            if ((i + 1) % count === 0 && points[i + count - count + 1] && points[i + count]) {
                polygons.push(new Polygon([i, i + count - count + 1, i + 1, i + count], color));
            }
        }

        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
    }
}

export default EllipticalParaboloid;
