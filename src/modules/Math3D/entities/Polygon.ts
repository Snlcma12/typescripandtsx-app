class Polygon {
    points: number[][];
    color: { r: number, g: number, b: number };
    distance: number | null;
    lumen: number | null;
    center: number[] | null;
    norm: number[] | null;
    index: number | null;
    R: number | null;
    visibility: boolean;

    constructor(points: number[][] = [], color: string = '#444444') {
        this.points = points;
        this.color = this.hexToRgb(color);
        this.distance = null;
        this.lumen = null;
        this.center = null;
        this.norm = null;
        this.index = null;
        this.R = null;
        this.visibility = true;
    }

    hexToRgb(hex: string): { r: number, g: number, b: number } {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 0, b: 0 };
    }

    rgbToHex(r: number, g: number, b: number): string {
        return `rgb(${r}, ${g}, ${b})`;
    }
}

export default Polygon;