import Surfaces from "./Surfaces";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

Surfaces.prototype.torus =
    ({
         point = new Point(0, 0, 0),
         majorRadius = 10,  // большой радиус (расстояние от центра тора до центра трубки)
         minorRadius = 4,   // малый радиус (радиус трубки)
         scale = 1,
         color = '#888888',
         majorSegments = 20, // количество сегментов вокруг большого круга
         minorSegments = 10 // количество сегментов вокруг малого круга
    }) => {

        majorRadius = Math.abs(majorRadius) * scale;
        minorRadius = Math.abs(minorRadius) * scale;

        const points = [];
        const edges = [];
        const polygons = [];

        for (let i = 0; i < majorSegments; i++) {
            for (let j = 0; j < minorSegments; j++) {
                const u = (i / majorSegments) * 2 * Math.PI;
                const v = (j / minorSegments) * 2 * Math.PI;
                const x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
                const z = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);
                const y = minorRadius * Math.sin(v);

                points.push(new Point(point.x + x, point.y + y, point.z + z));
            }
        }

        for (let i = 0; i < majorSegments; i++) {
            for (let j = 0; j < minorSegments; j++) {
                const p1 = i * minorSegments + j;
                const p2 = i * minorSegments + (j + 1) % minorSegments;
                const p3 = ((i + 1) % majorSegments) * minorSegments + j;
                const p4 = ((i + 1) % majorSegments) * minorSegments + (j + 1) % minorSegments;

                edges.push(new Edge(p1, p2));
                edges.push(new Edge(p1, p3));
                polygons.push(new Polygon([p1, p2, p4, p3], color));
            }
        }

        return new Surface(
            points,
            edges,
            polygons,
            point,
            true
        );
    }