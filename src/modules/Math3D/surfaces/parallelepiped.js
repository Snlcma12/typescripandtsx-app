import Surfaces from "./Surfaces";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

Surfaces.prototype.parallelepiped =
    ({
         point = new Point(0, 0, 0),
         sizeX = 5,
         sizeY = 10,
         sizeZ = 15,
         scale = 1,
         color = '#888888'
    }) => {

        const x = point.x;
        const y = point.y;
        const z = point.z;
        const a = Math.abs(sizeX)/2 * scale;
        const b = Math.abs(sizeY)/2 * scale;
        const c = Math.abs(sizeZ)/2 * scale;

        const points = [
            new Point(x-a, y-b, z+c), //0
            new Point(x+a, y-b, z+c), //1
            new Point(x-a, y+b, z+c), //2
            new Point(x+a, y+b, z+c), //3
            new Point(x-a, y-b, z-c), //4
            new Point(x+a, y-b, z-c), //5
            new Point(x-a, y+b, z-c), //6
            new Point(x+a, y+b, z-c) //7
        ];
        //       2------3
        //      /|     /|
        //     6------7 |
        //     | 0----|-1
        //     |/     |/
        //     4------5

        const edges = [
            new Edge(0, 1),
            new Edge(0, 2),
            new Edge(0, 4),
            new Edge(3, 1),
            new Edge(3, 2),
            new Edge(3, 7),
            new Edge(6, 2),
            new Edge(6, 4),
            new Edge(6, 7),
            new Edge(5, 4),
            new Edge(5, 1),
            new Edge(5, 7)
        ];

        const polygons = [
            new Polygon([0, 1, 3, 2]),
            new Polygon([0, 2, 6, 4]),
            new Polygon([0, 1, 5, 4]),
            new Polygon([7, 3, 2, 6]),
            new Polygon([7, 3, 1, 5]),
            new Polygon([7, 6, 4, 5])
        ];

        return new Surface(points, edges, polygons, point, true);
    }