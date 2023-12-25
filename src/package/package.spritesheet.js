import * as PIXI from 'pixi.js';


export default class Spritesheet {
    constructor() {
        this.PATH = "";
        this.CONTEXT = {width: 0, height: 0};
        this.SIZE = [];
    }

    setSheetSize(width, height) {
        this.SIZE = [width, height];
        return this;
    }

    setPath(path) {
        this.PATH = path;
        return this;
    }

    setSize(width, height) {
        this.CONTEXT.width = width;
        this.CONTEXT.height = height;
        return this;
    }

    generateList(form) {
        return form.trim().split(".")
            .flatMap(char => {
                if (char.includes(":")) {
                    const [min, max] = char.split(":");
                    return Array.from({ length: Number(max) - Number(min) + 1 }, (_, index) => (Number(min) + index));
                } else {
                    return Number(char);
                }
            });
    }

    build(frames) {
        frames = this.generateList(frames)

        const texture = PIXI.Texture.from(this.PATH);
        let sprites = [];
        let idx = 0;

        for (let y = 0; y < this.SIZE[1] / this.CONTEXT.height; y++) {
            for (let x = 0; x < this.SIZE[0] / this.CONTEXT.width; x++) {
                const posX = x * this.CONTEXT.width;
                const posY = y * this.CONTEXT.height;
                const width = this.CONTEXT.width;
                const height = this.CONTEXT.height;

                const sourceRect = new PIXI.Rectangle(posX, posY, width, height);
        
                const new_texture = new PIXI.Texture(texture, sourceRect);
                if (frames.includes(idx)) {
                    sprites.push(new_texture);
                }
                idx++;
            }
        }

        return sprites;
    }
}