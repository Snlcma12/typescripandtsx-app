import Math3D, { ETransfrom } from "../Math3D";
import Edge from "./Edge";
import Point from "./Point";
import Polygon from "./Polygon";

type TAnimation = {
    method: ETransfrom; 
    value: number; 
    center: Point;
}

class Surface {
    points: Point[];
    edges: Edge[];
    polygons: Polygon[];
    center: Point;
    bulge: boolean;
    animations: TAnimation[];

    constructor(points = [], edges = [], polygons = [], center = new Point(), bulge = true) {
        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.center = center;
        this.bulge = bulge;
        this.animations = [];
    }

    clearAnimations(): void {
        this.animations = [];
    }

    addAnimation(method: ETransfrom, value: number, center: Point): void {
        this.animations.push({ method, value, center });
    }

    doAnimation(math3D: Math3D): void {
        this.animations.forEach(animation => {
            const T1 = math3D.move(-animation.center.x, -animation.center.y, -animation.center.z);
            const T2 = math3D[animation.method](animation.value);
            const T3 = math3D.move(animation.center.x, animation.center.y, animation.center.z)
            const matrix = math3D.getTransform(T1, T2, T3);
            math3D.transform(this.center, matrix);
            this.points.forEach(point => math3D.transform(point, matrix));
        });
    }
}

export default Surface;