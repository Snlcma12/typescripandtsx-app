import Point from "./entities/Point";

class Math3D {
    constructor(WIN) {
        this.WIN = WIN;

        //уравнение плоскости в удобном виде
        this.plane = {
            worldCenter: new Point(),
            screenCenter: new Point(),
            camera: new Point()
        }

    }


    calcPlaneEquation(camera, screenCenter) {
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


    xs(point) {
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const x0 = this.WIN.CAMERA.x;
        return (point.x - x0) / (point.z - z0) * (zs - z0) + x0;
    }

    ys(point) {
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const y0 = this.WIN.CAMERA.y;
        return (point.y - y0) / (point.z - z0) * (zs - z0) + y0;
    }

    sin(a) {
        return Math.sin(a)
    }

    cos(a) {
        return Math.cos(a)
    }

    multMatrix(a, b) {
        const length = 4;
        const c = [
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

    multPoint(T, m) {
        const a = [0, 0, 0, 0];
        for (let i = 0; i < T.length; i++) {
            let b = 0;
            for (let j = 0; j < m.length; j++) {
                b += T[j][i] * m[j];
            }
            a[i] = b;
        }
        return a;
    }

    getTransform(...args) {
        return args.reduce((S, t) =>
                this.multMatrix(S, t),
                this.getOneT()
        );
    }

    transformPoint(point, T) {
        const array = this.multPoint(T, [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    getZoomMatrix(delta) {
        return [
            [delta, 0, 0, 0],
            [0, delta, 0, 0],
            [0, 0, delta, 0],
            [0, 0, 0, delta]
        ];
    }

    getOxRotateT(alpha) {
        return [
            [1, 0, 0, 0],
            [0, Math.cos(alpha), Math.sin(alpha), 0],
            [0, -Math.sin(alpha), Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
    }

    getOyRotateT(alpha) {
        return [
            [Math.cos(alpha), 0, -Math.sin(alpha), 0],
            [0, 1, 0, 0],
            [Math.sin(alpha), 0, Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
    }

    getOzRotateT(alpha) {
        return [
            [1, 0, 0, 0],
            [0, Math.cos(alpha), Math.sin(alpha), 0],
            [0, -Math.sin(alpha), Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
    }

    getMoveT({dx = 0, dy = 0, dz = 0}) {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [dx, dy, dz, 1]
        ];
    }

    getOneT() {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    findPolygonCenter(polygon, surface) {
        let x = 0, y = 0, z = 0;
        polygon.points.forEach(index => {
            x += surface.points[index].x;
            y += surface.points[index].y;
            z += surface.points[index].z;
        });
        x /= polygon.points.length;
        y /= polygon.points.length;
        z /= polygon.points.length;
        return {x, y, z};
    }

    calcDistance(surface, endPoint, name) {
        surface.polygons.forEach(polygon => {
            const {x, y, z} = this.findPolygonCenter(polygon, surface);
            polygon[name] = Math.sqrt(
                (endPoint.x - x) ** 2 +
                (endPoint.y - y) ** 2 +
                (endPoint.z - z) ** 2
            );
        });
    }

    sortByArtistAlgorithm(polygons) {
        polygons.sort((a, b) => (a.distance < b.distance) ? 1 : -1);
    }


    calcVisibility(surface, CAMERA) {
        const points = surface.points;
        surface.polygons.forEach(polygon => {
            const p0 = polygon.center;
            const p1 = points[polygon.points[1]];
            const p2 = points[polygon.points[2]];
            const a = this.getVector(p0, p1);
            const b = this.getVector(p0, p2);
            const normal = this.multVector(a, b);
            polygon.visibility = this.scalMultVector(normal, CAMERA) > 0;
        })

    }

    calcIllumination(distance, lumen) {
        const illumination = distance ? lumen / distance ** 2 : 1;
        return illumination > 1 ? 1 : illumination;
    }

    getVector(a, b) {
        return {
            x: b.x - a.x,
            y: b.y - a.y,
            z: b.z - a.z
        }
        // возвращаем не точку, потому что операция new тяжёлая, а этот методы мы будем использовать при рендере
    }

    multVector(a, b) {
        return {
            x: a.y * b.z - a.z * b.y,
            y: -a.x * b.z + a.z * b.x,
            z: a.x * b.y - a.y * b.x
        }
    }

    scalMultVector(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    moduleVector(a) {
        return Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
    }

    // считает центр каждого полигона в поверхности и записывает в его свойства
    calcCenter(surface) {
        surface.polygons.forEach(polygon => {
            let x = 0, y = 0, z = 0;
            polygon.points.forEach(index => {
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

    calcRadius(surface) {
        const points = surface.points;
        surface.polygons.forEach(polygon => {
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

    calcShadow(polygon, scene, LIGHT) {
        const result = {isShadow: false};
        const m1 = polygon.center;
        const r = polygon.R;
        const S = this.getVector(m1, LIGHT);
        scene.forEach((surface, index) => {
            if (polygon.index === index) return;
            surface.polygons.forEach(polygon2 => {
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