import {Complex} from '../types';
import RealCalculator from "./RealCalculator";
class ComplexCalculator extends RealCalculator {
    add(a, b) { return new Complex( super.add(a.re, b.re), super.add(a.im,b.im) ) }
    sub(a, b) { return new Complex( super.sub(a.re,b.re), super.sub(a.im,b.im) ) }
    mult(a, b) { return new Complex( a.re*b.re - a.im*b.im, a.re*b.im + b.re*a.im ) }
    inv(a) {
        const q = super.pow((a.re), 2) + super.pow((a.im), 2);
        return new Complex( a.re / q, -a.im / q )
    }
    div(a, b) {
        return this.mult( a, this.inv(b) )
    }
    pow(a, n) {
        let S = this.one();
        for (let i= 0; i < n; i++) {
            S = this.mult(S, a);
        }
        return S
    }
    prod(a, p) { return new Complex( super.prod(a.re, p), super.prod(a.im, p)) }
    zero() { return new Complex() }
    one() { return new Complex( super.one() ) }
}

export default ComplexCalculator;