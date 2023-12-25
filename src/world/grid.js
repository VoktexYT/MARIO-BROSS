import * as PIXI from 'pixi.js';


export default class Grid {
    constructor() {
        this.MAP = [];
        this.MAP_WIDTH = 0;
        this.MAP_HEIGHT = 0;
        this.MAP_CODE = {};
        this.TILE_PROPS = {};
        this.UNIQUE_TILE_PROPS = [];
        this.MAP_POS = []

        this.IGNORE_CODE = [];
    }

    setMapScale(scale) {
        this.TILE_PROPS['scale'] = {
            'x': scale,
            'y': scale
        }
        return this;
    }

    setMapPosition(x, y) {
        this.MAP_POS[0] = x;
        this.MAP_POS[1] = y;
        return this;
    }

    setTileProperties(prop) {
        this.TILE_PROPS = prop;
        return this;
    }

    setUniqueTileProperty(code, prop) {
        this.UNIQUE_TILE_PROPS.push([code, prop]);
        return this;
    }

    setMapSize(width, height) {
        this.MAP_WIDTH = width;
        this.MAP_HEIGHT = height;
        return this;
    }

    setMapStruct(mapList) {
        this.MAP = mapList;
        return this;
    }

    setCode(code) {
        this.MAP_CODE = code;
        return this;
    }

    setIgnoreCode(code) {
        this.IGNORE_CODE.push(code)
        return this;
    }

    build(scene) {
        let struct = []
        let idx = 0;
        for (let y = 0; y < this.MAP_HEIGHT; y++) {
            struct.push([]);
            for (let x = 0; x < this.MAP_WIDTH; x++) {
                const CODE = this.MAP[idx];

                if (!this.IGNORE_CODE.includes(CODE)) {
                    const TEXTURE = this.MAP_CODE[CODE];
                    let SPRITE = PIXI.Sprite.from(TEXTURE);
                        Object.assign(SPRITE, {...SPRITE, ...this.TILE_PROPS})
                        SPRITE.x = x * SPRITE.width + this.MAP_POS[0];
                        SPRITE.y = y * SPRITE.height + this.MAP_POS[1];

                        this.UNIQUE_TILE_PROPS.forEach((tileProp) => {
                            if (CODE === tileProp[0]) {
                                Object.assign(SPRITE, {...SPRITE, ...tileProp[1]})
                            }
                        })
                        

                    struct[y].push({
                        sprite: SPRITE,
                        position: [x, y],
                        texture: TEXTURE,
                        code: CODE,
                        idx: idx
                    })
                    scene.addChild(SPRITE);
                } else {
                    struct[y].push({
                        sprite: "",
                        position: [x, y],
                        texture: "",
                        code: CODE,
                        idx: idx
                    });
                }
                
                idx++;
            }
        }

        return struct;
    }
}