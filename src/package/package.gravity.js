export default class Gravity {
    constructor() {
        this.gravity = 0.01;
        this.active = true;
    }

    setActive(active) {
        this.active = active;
        return this;
    }

    setGravity(g) {
        this.gravity = g;
        return this;
    }

    apply(vi, deltaTime) {
        return [
            (vi * deltaTime + (-this.gravity / 2) * (Math.pow(deltaTime, 2))),
            (vi + -this.gravity * deltaTime)
        ];
    }
}