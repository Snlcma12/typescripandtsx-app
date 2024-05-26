import Point from "./Point";

export type TRGB = {
    r: number;
    g: number;
    b: number;
}

export enum EDistance {
    distance = 'distance',
    lumen = 'lumen',
}

class Polygon {
    points: number[];
    color: TRGB;
    [EDistance.distance]: number = 0;
    [EDistance.lumen]: number = 0;
    center = new Point();
    norm = new Point();
    index = 0;
    R = 0;
    visibility = true;

    constructor(points: number[] = [], color = '#444444') {
        this.points = points;
        this.color = this.hexToRgb(color);
    }

    hexToRgb(hex: string): TRGB {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 0, b: 0 };
    }

    rgbToHex(r: number, g: number, b: number): string {
        return `rgb(${r},${g},${b})`;
    }
}

export default Polygon;