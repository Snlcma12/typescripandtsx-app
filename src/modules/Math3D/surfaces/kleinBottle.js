import Surfaces from "./Surfaces";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

// Объявление нового метода kleinBottle для объекта Surfaces.prototype
Surfaces.prototype.kleinBottle =
    ({
         point = new Point(0, 0, 0),
         scale = 1,
         deltaU = 0.2,  // Шаг изменения параметра u
         deltaV = 0.2,  // Шаг изменения параметра v
         color = '#888888'
    }) => {

        const points = [];
        const edges = [];
        const polygons = [];
        const uMax = Math.PI;  // Максимальное значение параметра u (по умолчанию Math.PI)
        const vMax = 2 * Math.PI;  // Максимальное значение параметра v (по умолчанию 2 * Math.PI)

        let majorSegments = 0;
        let minorSegments = 0;

        for (let u = 0; u <= uMax; u += deltaU) {
            for (let v = 0; v <= vMax; v += deltaV) {
                const x = (-(2 / 15) * Math.cos(u) * (3 * Math.cos(v)
                    - 30 * Math.sin(u) + 90 * (Math.pow(Math.cos(u), 4)) * Math.sin(u)
                    - 60 * (Math.pow(Math.cos(u), 6)) * Math.sin(u)
                    + 5 * Math.cos(u) * Math.cos(v) * Math.sin(u)))*scale*4;
                let y = (-(1 / 15) * Math.sin(u) * (3 * Math.cos(v)
                    - 3 * (Math.pow(Math.cos(u), 2)) * Math.cos(v)
                    - 48 * (Math.pow(Math.cos(u), 4)) * Math.cos(v)
                    + 48 * (Math.pow(Math.cos(u), 6)) * Math.cos(v)
                    - 60 * Math.sin(u) + 5 * Math.cos(u) * Math.cos(v) * Math.sin(u)
                    - 5 * (Math.pow(Math.cos(u), 3)) * Math.cos(v) * Math.sin(u)
                    - 80 * (Math.pow(Math.cos(u), 5)) * Math.cos(v) * Math.sin(u)
                    + 80 * (Math.pow(Math.cos(u), 7)) * Math.cos(v) * Math.sin(u)))*scale*4;

                const z = ((2 / 15) * (3 + 5 * Math.cos(u) * Math.sin(u)) * Math.sin(v))*scale*4;

                points.push(new Point(point.x + x, point.y + y-scale*2, point.z + z));
                minorSegments += 1;
            }
            majorSegments += 1;
        }
        minorSegments /= majorSegments;

        //Создание рёбер поверхности
        for (let i = 0; i < majorSegments - 1; i++) {
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

        for (let j = 0; j < minorSegments; j++) {
            const p1 = j;
            const p2 = j;
            const p3 = majorSegments * minorSegments - j - 1;
            //console.log(p3, majorSegments*minorSegments);
            const p4 = 0;

            //console.log(points.length, p1, p3);
            //edges.push(new Edge(p1, p2, '#0000ff'));

            edges.push(new Edge(p1, p3, '#ff0000'));
            //polygons.push(new Polygon([p1, p2, p4, p3], color));
        }


        return new Surface(points, edges, polygons, point, true);
    };
