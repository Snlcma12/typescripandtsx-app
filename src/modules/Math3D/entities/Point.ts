class Point {
    x: number;
    y: number;
    z: number;
    color: string;

    constructor(x: number = 0, y: number = 0, z: number = 0, color: string = '#000000') {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;
    }
}

export default Point;