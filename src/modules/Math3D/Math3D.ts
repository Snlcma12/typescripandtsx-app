import { TWIN3D } from "../Graph/Graph";
import Point from "./entities/Point";


type TMatrix = number[][];
type TVector = number[];
type TPolygon = {
    points: number[];
    center?: Point;
    R?: number;
    distance?: number;
    visibility?: boolean;
    lumen?: number;
    [key: string]: any; 
}
type TSurface = {
    points: Point[];
    polygons: TPolygon[];
}
type TShadow = {
    isShadow: boolean;
    dark?: number;
}

export enum ETransfrom {
    zoom = 'zoom',
    move = 'move',
    rotateOX = 'rotateOX',
    rotateOY = 'rotateOY',
    rotateOZ = 'rotateOZ',
}

class Math3D {
    WIN: TWIN3D;
    calcRadius: any;

    constructor(WIN: TWIN3D) {
        this.WIN = WIN;
    }

    xs(point: Point): number {
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const x0 = this.WIN.CAMERA.x;
        return (point.x - x0) / (point.z - z0) * (zs - z0) + x0;
    }

    ys(point: Point): number {
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const y0 = this.WIN.CAMERA.y;
        return (point.y - y0) / (point.z - z0) * (zs - z0) + y0;
    }

    sin(a: number): number {
        return Math.sin(a)
    }

    cos(a: number): number {
        return Math.cos(a)
    }

    multMatrix(a: TMatrix, b: TMatrix): TMatrix {
        const length = 4;
        const c: TMatrix = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                let S = 0;
                for (let k = 0; k < length; k++) {
                    S += a[i][k] * b[k][j];
                }
                c[i][j] = S;
            }
        }
        return c;
    }

    multPoint(T: TMatrix, m: TVector): TVector {
        const a: TVector = [0, 0, 0, 0];
        for (let i = 0; i < T.length; i++) {
            let b = 0;
            for (let j = 0; j < m.length; j++) {
                b += T[j][i] * m[j];
            }
            a[i] = b;
        }
        return a;
    }

    getTransform(...args: TMatrix[]): TMatrix {
        return args.reduce((S, t) =>
            this.multMatrix(S, t),
            this.getOneT()
        );
    }

    transformPoint(point: Point, T: TMatrix): void {
        const array = this.multPoint(T, [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    

    

    

    

    [ETransfrom.zoom](delta: number): TMatrix {
        return [
            [delta, 0, 0, 0],
            [0, delta, 0, 0],
            [0, 0, delta, 0],
            [0, 0, 0, 1]
        ];
    }

    [ETransfrom.move](dx = 0, dy = 0, dz = 0): TMatrix {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [dx, dy, dz, 1]
        ];
    }

    [ETransfrom.rotateOX](alpha: number): TMatrix {
        return [
            [1, 0, 0, 0],
            [0, Math.cos(alpha), Math.sin(alpha), 0],
            [0, -Math.sin(alpha), Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
    }

    [ETransfrom.rotateOY](alpha: number): TMatrix {
        return [
            [Math.cos(alpha), 0, -Math.sin(alpha), 0],
            [0, 1, 0, 0],
            [Math.sin(alpha), 0, Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
    }

    [ETransfrom.rotateOZ](alpha: number): TMatrix {
        return [
            [1, 0, 0, 0],
            [0, Math.cos(alpha), Math.sin(alpha), 0],
            [0, -Math.sin(alpha), Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
    }

    getOneT(): TMatrix {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    transform(point: Point, T: TMatrix): void {
        const array = this.multPoint(T, [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }


    findPolygonCenter(polygon: TPolygon, surface: TSurface): { x: number, y: number, z: number } {
        let x = 0, y = 0, z = 0;
        polygon.points.forEach((index: number) => {
            x += surface.points[index].x;
            y += surface.points[index].y;
            z += surface.points[index].z;
        });
        x /= polygon.points.length;
        y /= polygon.points.length;
        z /= polygon.points.length;
        return { x, y, z };
    }

    calcDistance(surface: TSurface, endPoint: Point, name: string): void {
        surface.polygons.forEach((polygon: TPolygon) => {
            const { x, y, z } = this.findPolygonCenter(polygon, surface);
            polygon[name] = Math.sqrt(
                (endPoint.x - x) ** 2 +
                (endPoint.y - y) ** 2 +
                (endPoint.z - z) ** 2
            );
        });
    }

    sortByArtistAlgorithm(polygons: TPolygon[]): void {
        polygons.sort((a: TPolygon, b: TPolygon) => (a.distance! < b.distance!) ? 1 : -1);
    }

    calcVisibility(surface: TSurface, CAMERA: Point): void {
        const points = surface.points;
        surface.polygons.forEach((polygon: TPolygon) => {
            const p0 = polygon.center!;
            const p1 = points[polygon.points[1]];
            const p2 = points[polygon.points[2]];
            const a = this.getVector(p0, p1);
            const b = this.getVector(p0, p2);
            const normal = this.multVector(a, b);
            polygon.visibility = this.scalMultVector(normal, CAMERA) > 0;
        });
    }

    calcIllumination(distance: number, lumen: number): number {
        const illumination = distance ? lumen / distance ** 2 : 1;
        return illumination > 1 ? 1 : illumination;
    }

    getVector(a: Point, b: Point): { x: number, y: number, z: number } {
        return {
            x: b.x - a.x,
            y: b.y - a.y,
            z: b.z - a.z
        }
    }

    multVector(a: { x: number, y: number, z: number }, b: { x: number, y: number, z: number }): { x: number, y: number, z: number } {
        return {
            x: a.y * b.z - a.z * b.y,
            y: -a.x * b.z + a.z * b.x,
            z: a.x * b.y - a.y * b.x
        }
    }

    scalMultVector(a: { x: number, y: number, z: number }, b: { x: number, y: number, z: number }): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    moduleVector(a: { x: number, y: number, z: number }): number {
        return Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
    }

    calcCenter(surface: TSurface): void {
        surface.polygons.forEach((polygon: TPolygon) => {
            let x = 0, y = 0, z = 0;
            polygon.points.forEach((index: number) => {
                x += surface.points[index].x;
                y += surface.points[index].y;
                z += surface.points[index].z;
            });
            x /= polygon.points.length;
            y /= polygon.points.length;
            z /= polygon.points.length;
            polygon.center = new Point(x, y, z);
        });
    }

    calcShadow(polygon: TPolygon, subject: TSurface, light: Point, dark: number = 0, isShadow: boolean = false): TShadow {
        if (isShadow) {
            for (let i = 0; i < subject.polygons.length; i++) {
                if (subject.polygons[i].visibility) {
                    const T = subject.polygons[i];
                    for (let j = 0; j < T.points.length; j++) {
                        const A = subject.points[T.points[j]];
                        const B = light;
                        const C = polygon.center!;
                        if (this.checkInTriangle(A, B, C)) {
                            return { isShadow: true, dark };
                        }
                    }
                }
            }
        }
        return { isShadow: false };
    }
    
   

    checkInTriangle(A: Point, B: Point, C: Point): boolean {
        const AB = this.getVector(A, B);
        const AC = this.getVector(A, C);
        const BC = this.getVector(B, C);
        const n = this.multVector(AB, AC);
        const N = this.moduleVector(n);
        const PA = this.moduleVector(AB);
        const PB = this.moduleVector(BC);
        const PC = this.moduleVector(AC);
        const S = N / 2;
        const Sa = S / PA;
        const Sb = S / PB;
        const Sc = S / PC;
        return (Sa + Sb + Sc).toFixed(5) === S.toFixed(5);
    }
}

export default Math3D;
