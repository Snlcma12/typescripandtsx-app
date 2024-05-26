import Surfaces from "./Surfaces";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

Surfaces.prototype.pisinus =
    ({
         point = new Point(0, 0, 0),
         scale = 1,
         color = '#FCDABF',
         segments
    }) =>
    {
        const points = [];
        const edges = [];
        const polygons = [];

        const x = point.x;
        const y = point.y;
        const z = point.z;

        const pisinus = [];

        const surfaces =  new Surfaces();
        let i = 0;
        pisinus.push(surfaces.ellipsoid({
            point: new Point(x+5*scale, y-12*scale, z), radiusX: 5, radiusY: 6,radiusZ: 5, color, segments, scale}));
        pisinus.push(surfaces.ellipsoid({
            point: new Point(x-5*scale, y-12*scale, z), radiusX: 5, radiusY: 6,radiusZ: 5, color, segments, scale}));
        pisinus.push(surfaces.ellipsoid({
            point: new Point(x, y-9.5*scale, z), radiusX: 5, radiusY: 5,radiusZ: 4.5, color, segments ,scale}));
        pisinus.push(surfaces.ellipsoid({
            point: new Point(x, y+11.5*scale, z), radiusX: 5, radiusY: 6,radiusZ: 5, color:'#985367', segments, scale}));
        pisinus.push(surfaces.cylinder({
            point: new Point(x, y, z), radius: 4.5,height: 18, color, segments, scale}));

        pisinus.forEach(surface => {
            surface.points.forEach( point => points.push(new Point(point.x, point.y, point.z)))
            surface.edges.forEach( edge => {
                edge.p1 += i;
                edge.p2 += i;
                edges.push(edge);
            });
            surface.polygons.forEach( polygon => {
                for (let j = 0; j < polygon.points.length; j++) {
                    polygon.points[j] += i;
                }
                polygons.push(polygon);
            });
            i += surface.points.length;
        })

        return new Surface(
            points,
            edges,
            polygons,
            point,
            true
        )
    }