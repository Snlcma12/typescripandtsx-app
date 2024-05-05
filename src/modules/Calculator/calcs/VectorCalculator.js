import {Vector} from '../types';
import RealCalculator from "./RealCalculator";

class VectorCalculator{
    constructor(calc = new RealCalculator()) {
        this.calc = calc;
    }


    div(a, b) {
        return null;
    }

    add(a, b) {
        return new Vector( a.values.map( (elem, i) => this.calc.add(elem,b.values[i])) );
    }

    sub(a, b) {
        return new Vector( a.values.map( (elem, i) => this.calc.sub(elem,b.values[i])) );
    }

    mult(a, b) {
        if (a.length != 3 || b.length != 3) return NaN;
        return new Vector([
            this.calc.sub( this.calc.mult( a.values[1], b.values[2] ), this.calc.mult( a.values[2], b.values[1] ) ),
            this.calc.sub( this.calc.mult( a.values[2], b.values[0] ), this.calc.mult( a.values[0], b.values[2] ) ),
            this.calc.sub( this.calc.mult( a.values[0], b.values[1] ), this.calc.mult( a.values[1], b.values[0] ) )
        ]);
    }

    pow(a, b) {
        return new Vector(a.values.map( elem => this.calc.pow(elem, b)));
    }


    prod(a, p) {
        return new Vector( a.values.map( (elem, i) => this.calc.prod(elem, p) ) );
    }

    zero(length) {
        const values = [];
        for (let i = 0; i < length; i++) {
            values.push(this.calc.zero());
        }
        return new Vector(values);
    }

    one(n) {
        const vector = this.zero(n);
        vector.values[0] = 1;
        return vector;
    }

    fill(length, num) {
        const values = [];
        for (let i = 0; i < length; i++) {
            values.push( num );
        }
        return new Vector(values);
    }

}
export default VectorCalculator;