import Surfaces from "./Surfaces";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

Surfaces.prototype.axis =
    ({
         size = 10,
         step = 5
    }) => {
        size = Math.abs(size) * step / 2;
        const points = [];
        const edges = [];

        for (let i = -size; i <= size; i += 1) {
            for (let j = -size; j <= size; j += 1) {
                points.push(new Point(i * step, j * step, 0));
                points.push(new Point(0, i * step, j * step));
                points.push(new Point(j * step, 0, i * step));
            }
        }

        return new Surface(points, edges, []);
    }

