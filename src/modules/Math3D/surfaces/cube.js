import Surfaces from "./Surfaces";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

Surfaces.prototype.cube =
    ({
         point = new Point(0, 0, 0),
         size = 10,
         segments = 10,
         scale = 1,
         color = '#888888'
    }) => {

    const a = Math.abs(size) * Math.abs(scale)/Math.abs(segments);
    const x = point.x;
    const y = point.y;
    const z = point.z;

    const points = [
        new Point(x-a, y-a, z+a), //0
        new Point(x+a, y-a, z+a), //1
        new Point(x-a, y+a, z+a), //2
        new Point(x+a, y+a, z+a), //3
        new Point(x-a, y-a, z-a), //4
        new Point(x+a, y-a, z-a), //5
        new Point(x-a, y+a, z-a), //6
        new Point(x+a, y+a, z-a) //7
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
        new Polygon([0, 1, 3, 2], color),
        new Polygon([0, 2, 6, 4], color),
        new Polygon([0, 1, 5, 4], color),
        new Polygon([7, 3, 2, 6], color),
        new Polygon([7, 3, 1, 5], color),
        new Polygon([7, 6, 4, 5], color)
    ];


    return new Surface(
        points,
        edges,
        polygons,
        point,
        true
    );
}