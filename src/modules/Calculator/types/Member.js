class Member {
    constructor(value=0, power=0) {
        this.value = value;
        this.power = power;
    }

    toString() {
        return this.value >= 0 ?
            this.power >= 0?
                `${this.value}*x^${this.power}`:
                `${this.value}*x^(${this.power})`:
            this.power > 0?
                `(${this.value})*x^${this.power}`:
                `(${this.value})*x^(${this.power})`;
    }

}

export default Member;