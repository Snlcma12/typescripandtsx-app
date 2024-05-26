import Surfaces from "./Surfaces";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

Surfaces.prototype.plane =
    ({
         point = new Point(0, 0, 0),
         size = 10,
         scale = 1,
         color = '#5c6598'
    }) => {
        const points = [];
        const edges = [];
        const polygons = [];

        size = Math.abs(size);

        for (let i = 0; i <= size; i++){
            for (let j = 0; j <= size; j++){
                points.push(new Point(i * scale + point.x - size/2, point.y, j * scale + point.z - size/2));
            }
        }

        for (let i = 0; i <= size; i++) {
            const p1 = i;
            const p2 = (i + 1)%size;
            const p3 = (i*size)%(size*size);
            const p4 = (i*size+1)%(size*size);
            edges.push(p1, p2);
        }

        return new Surface(
            points,
            edges,
            polygons,
            point,
            true
        )
    }