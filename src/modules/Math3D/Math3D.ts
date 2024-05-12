import Point from "./entities/Point";
import Polygon from "./entities/Polygon";

type TMath3D = {
    WIN: TWIN3D;
};

interface TWIN3D {
    CENTER: Point;
    CAMERA: Point;
}

type TMatrix = number[][];
type TVector = number[];

type TShadow = {
    isShadow: boolean;
    dark?: number;
};

export enum ETransform {
    zoom = 'zoom',
    move = 'move',
    rotateOx = 'rotateOx',
    rotateOy = 'rotateOy',
    rotateOz = 'rotateOz',
}

class Math3D {
    private WIN: TWIN3D;
    private plane: {
        worldCenter: Point;
        screenCenter: Point;
        camera: Point;
    };

    constructor(WIN: TWIN3D) {
        this.WIN = WIN;
        this.plane = {
            worldCenter: new Point(),
            screenCenter: new Point(),
            camera: new Point()
        };
    }

    calcPlaneEquation(camera: Point, screenCenter: Point): void {
        const vector = new Point(
            screenCenter.x - camera.x,
            screenCenter.y - camera.y,
            screenCenter.z - camera.z
        );
        this.plane.worldCenter.x = vector.x;
        this.plane.worldCenter.y = vector.y;
        this.plane.worldCenter.z = vector.z;
        this.plane.screenCenter.x = screenCenter.x;
        this.plane.screenCenter.y = screenCenter.y;
        this.plane.screenCenter.z = screenCenter.z;
        this.plane.camera.x = camera.x;
        this.plane.camera.y = camera.y;
        this.plane.camera.z = camera.z;
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
        return Math.sin(a);
    }

    cos(a: number): number {
        return Math.cos(a);
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

    getZoomMatrix(delta: number): TMatrix {
        return [
            [delta, 0, 0, 0],
            [0, delta, 0, 0],
            [0, 0, delta, 0],
            [0, 0, 0, delta]
        ];
    }

    getOxRotateT(alpha: number): TMatrix {
        return [
            [1, 0, 0, 0],
            [0, Math.cos(alpha), Math.sin(alpha), 0],
            [0, -Math.sin(alpha), Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
    }

    getOyRotateT(alpha: number): TMatrix {
        return [
            [Math.cos(alpha), 0, -Math.sin(alpha), 0],
            [0, 1, 0, 0],
            [Math.sin(alpha), 0, Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
    }

    getOzRotateT(alpha: number): TMatrix {
        return [
            [Math.cos(alpha), Math.sin(alpha), 0, 0],
            [-Math.sin(alpha), Math.cos(alpha), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    getMoveT({ dx = 0, dy = 0, dz = 0 }: { dx?: number; dy?: number; dz?: number }): TMatrix {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [dx, dy, dz, 1]
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

    findPolygonCenter(polygon: Polygon, surface: { points: Point[] }): Point {
        let x = 0, y = 0, z = 0;
        polygon.points.forEach((index: number) => {
            x += surface.points[index].x;
            y += surface.points[index].y;
            z += surface.points[index].z;
        });
        x /= polygon.points.length;
        y /= polygon.points.length;
        z /= polygon.points.length;
        return new Point(x, y, z);
    }

    calcDistance(surface: { polygons: Polygon[] }, CAMERA: Point, name: string): void {
        surface.polygons.forEach((polygon: Polygon) => {
            const distance = this.distance(polygon.center, CAMERA);
            polygon[name] = Math.sqrt(
                distance.x ** 2 + distance.y ** 2 + distance.z ** 2
            );
        });
    }

    sortByArtistAlgorithm(polygons: Polygon[]): void {
        polygons.sort((a, b) => (a.distance! < b.distance!) ? 1 : -1);
    }

    calcVisibility(surface: { polygons: Polygon[] }, CAMERA: Point): void {
        const points = surface.points;
        surface.polygons.forEach((polygon: Polygon) => {
            const p0 = polygon.center;
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

    getVector(a: Point, b: Point): Point {
        return new Point(
            b.x - a.x,
            b.y - a.y,
            b.z - a.z
        );
    }

    multVector(a: Point, b: Point): Point {
        return new Point(
            a.y * b.z - a.z * b.y,
            -a.x * b.z + a.z * b.x,
            a.x * b.y - a.y * b.x
        );
    }

    scalMultVector(a: Point, b: Point): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    moduleVector(a: Point): number {
        return Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
    }

    calcCenter(surface: { polygons: Polygon[] }): void {
        surface.polygons.forEach((polygon: Polygon) => {
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

    calcRadius(surface: { polygons: Polygon[] }): void {
        const points = surface.points;
        surface.polygons.forEach((polygon: Polygon) => {
            const center = polygon.center;
            const p1 = points[polygon.points[0]];
            const p2 = points[polygon.points[1]];
            const p3 = points[polygon.points[2]];
            const p4 = points[polygon.points[3]];
            polygon.R = (this.moduleVector(this.getVector(center, p1))
                + this.moduleVector(this.getVector(center, p2))
                + this.moduleVector(this.getVector(center, p3))
                + this.moduleVector(this.getVector(center, p4)))
                / 4;
        });
    }

    calcShadow(polygon: Polygon, scene: { polygons: Polygon[] }[], LIGHT: Point): TShadow {
        const result: TShadow = { isShadow: false };
        const m1 = polygon.center;
        const r = polygon.R;
        const S = this.getVector(m1, LIGHT);
        scene.forEach((surface, index) => {
            if (polygon.index === index) return;
            surface.polygons.forEach((polygon2: Polygon) => {
                const m0 = polygon2.center;
                if (m1.x === m0.x && m1.y === m0.y && m1.z === m0.z) return;
                if (polygon2.lumen > polygon.lumen) return;
                const dark = this.moduleVector(
                    this.multVector(
                        this.getVector(m0, m1),
                        S
                    )
                ) / this.moduleVector(S);

                if (dark < r) {
                    result.isShadow = true;
                    result.dark = 0.7;
                }
            });
        });
        return result;
    }
}

export default Math3D;
