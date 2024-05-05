
class Vector {
    constructor(values = []) {
        this.values = [];
        values.forEach(elem => this.values.push(elem));
    }


    // vector --> (1; 2; 3)
    toString() {
        return `(${this.values.map( elem => elem.toString()).join('; ') })`;
    }
}

export default Vector;