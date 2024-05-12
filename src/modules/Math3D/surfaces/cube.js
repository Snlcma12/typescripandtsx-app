import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";
import Surface from "../entities/Surface";


class Cube extends Surface {
    constructor({ center = new Point(0, 0, 0), size = 1, color = '#888888' }) {
        super();

        const halfSize = size / 2;
        const x = center.x;
        const y = center.y;
        const z = center.z;

        const points = [
            new Point(x - halfSize, y - halfSize, z + halfSize), // 0
            new Point(x + halfSize, y - halfSize, z + halfSize), // 1
            new Point(x - halfSize, y + halfSize, z + halfSize), // 2
            new Point(x + halfSize, y + halfSize, z + halfSize), // 3
            new Point(x - halfSize, y - halfSize, z - halfSize), // 4
            new Point(x + halfSize, y - halfSize, z - halfSize), // 5
            new Point(x - halfSize, y + halfSize, z - halfSize), // 6
            new Point(x + halfSize, y + halfSize, z - halfSize)  // 7
        ];

        const edges = [
            new Edge(0, 1), new Edge(1, 3), new Edge(3, 2), new Edge(2, 0),
            new Edge(4, 5), new Edge(5, 7), new Edge(7, 6), new Edge(6, 4),
            new Edge(0, 4), new Edge(1, 5), new Edge(2, 6), new Edge(3, 7)
        ];

        const polygons = [
            new Polygon([0, 1, 3, 2]),
            new Polygon([0, 1, 5, 4]),
            new Polygon([0, 2, 6, 4]),
            new Polygon([1, 3, 7, 5]),
            new Polygon([2, 3, 7, 6]),
            new Polygon([4, 5, 7, 6])
        ];

        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.center = center;
        this.color = color;
    }
}

export default Cube;
