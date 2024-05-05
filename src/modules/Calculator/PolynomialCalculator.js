import {Polynomial, Member} from './types';
import Calculator from "./Calculator";

class PolynomialCalculator {
    Polynomial(members) {
        return new Polynomial(members);
    }

    getValue(str) {
        if (str.includes('^')) return this.getPolynomial(str);
        return str - 0;
    }

    getPolynomial(str) {
        if (str instanceof Array) return new Polynomial(str);
        if (str && typeof str == 'string') {
            str = str.replaceAll(' ', '').replaceAll('x', '').replaceAll('*', '')
                .replaceAll('(', '').replaceAll(')','');
            const arr = str.split('+');
            const members = [];
            arr.forEach( elem => {
                const arr1 = elem.split('^');
                members.push( new Member(arr1[0]-0, arr1[1]-0));
            })
            return new Polynomial(members);
        }
        return null;
    }

    add(a, b) {
        const calc = new Calculator;
        const members = [];
        a.poly.forEach( elemA => {
            const member = b.poly.find( elemB => elemB.power === elemA.power);
            if (member) {
                members.push(new Member(calc.add(elemA.value, member.value),
                    elemA.power));
            } else {
                members.push(new Member(elemA.value, elemA.power));
            }
        });
        b.poly.forEach(elemB => {
            if (!members.find(elem => elem.power === elemB.power)) {
                members.push(new Member(elemB.value, elemB.power));
            }
        })

        return new Polynomial(members);
    }

    sub(a, b) {
        const calc = new Calculator;
        const members = [];
        a.poly.forEach( elemA => {
            const member = b.poly.find( elemB => elemB.power === elemA.power);
            if (member) {
                members.push(new Member(calc.sub(elemA.value, member.value),
                    elemA.power));
            } else {
                members.push(new Member(elemA.value, elemA.power));
            }
        });
        b.poly.forEach(elemB => {
            if (!members.find(elem => elem.power === elemB.power)) {
                members.push(new Member(-elemB.value, elemB.power));
            }
        })

        return new Polynomial(members);
    }

    mult(a, b) {
        const calc = new Calculator();
        let polynomial = new Polynomial();
        a.poly.forEach(elemA => {
            const members = [];
            b.poly.forEach(elemB => {
                members.push( new Member(calc.mult(elemA.value, elemB.value), elemA.power + elemB.power));
            });
            polynomial = this.add(polynomial, new Polynomial(members));
        });
        return polynomial;
    }

    div(a, b) {return null}

    pow(a, p) {
        const calc = new Calculator();
        let S = this.one();
        for (let i = 0; i < p; i++) S = this.mult(S, a);
        return S;
    }

    prod(a, p) {
        const calc = new Calculator();
        const members = [];
        a.poly.forEach(elem => {
            members.push(new Member(calc.mult(elem.value, p) ,elem.power))
        });
        return new Polynomial(members);
    }

    zero(){
        return new Polynomial( [new Member()] );
    }

    one(){
        return new Polynomial( [new Member(1)] );
    }

}

export default PolynomialCalculator;