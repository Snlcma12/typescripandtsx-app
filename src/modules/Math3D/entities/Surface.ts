import Point from "./Point";

interface Animation {
    method: string;
    value: number;
    center: Point;
}

class Surface {
    points: Point[];
    edges: any[];
    polygons: any[];
    center: Point;
    bulge: boolean;
    animations: Animation[];

    constructor(points: Point[] = [], edges: any[] = [], polygons: any[] = [], center: Point = new Point(), bulge: boolean = true) {
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

    addAnimation(method: string, value: number, center: Point): void {
        this.animations.push({ method, value, center });
    }

    doAnimation(math3D: any): void {
        this.animations.forEach(animation => {
            const T1 = math3D.getMoveT(-animation.center.x, -animation.center.y, -animation.center.z);
            const T2 = math3D[animation.method](animation.value);
            const T3 = math3D.getMoveT(animation.center.x, animation.center.y, animation.center.z)
            const matrix = math3D.getTransform(T1, T2, T3);
            math3D.transformPoint(this.center, matrix);
            this.points.forEach(point => math3D.transformPoint(point, matrix));
        });
    }
}

export default Surface;