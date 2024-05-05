class Matrix {
    constructor(values = [[]]) {
        this.values = [];
        values.forEach( (arr, i) => {
            this.values[i] = [];
            arr.forEach( elem => this.values[i].push(elem) );
        });
    }


    /*
       matrix
         |
         V
      1, 2, 3
      4, 5, 6
      7, 8, 9
    */
    toString() {
        return this.values.map(
            arr => arr.map( elem => elem.toString()).join(', ')
        ).join('\n');
    }
}

export default Matrix;