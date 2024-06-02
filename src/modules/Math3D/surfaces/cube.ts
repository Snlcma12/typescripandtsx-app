import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";
import Surface from "../entities/Surface";

class Cube extends Surface {
    constructor({
        scale = 5.0
    } = {}) {
        super();
        const points = [
            new Point(1 * scale, 1 * scale, 1 * scale),
            new Point(1 * scale, -1 * scale, 1 * scale),
            new Point(-1 * scale, -1 * scale, 1 * scale),
            new Point(-1 * scale, 1 * scale, 1 * scale),
            new Point(1 * scale, 1 * scale, -1 * scale),
            new Point(1 * scale, -1 * scale, -1 * scale),
            new Point(-1 * scale, -1 * scale, -1 * scale),
            new Point(-1 * scale, 1 * scale, -1 * scale),
          ];
          const edges = [
            new Edge(0, 1),
            new Edge(1, 2),
            new Edge(2, 3),
            new Edge(3, 0),
            new Edge(0, 4),
            new Edge(1, 5),
            new Edge(2, 6),
            new Edge(3, 7),
            new Edge(4, 5),
            new Edge(5, 6),
            new Edge(6, 7),
            new Edge(7, 4),
          ];
          const polygons = [
            new Polygon([0, 1, 2, 3], "#808000"),
            new Polygon([0, 4, 5, 1], "#8A2BE2"),
            new Polygon([5, 1, 2, 6], "#FF7F50"),
            new Polygon([7, 3, 2, 6], "#228B22"),
            new Polygon([0, 3, 7, 4], "#191970"),
            new Polygon([7, 4, 5, 6], "#B8860B"),
          ];
        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
    }
}

export default Cube;
