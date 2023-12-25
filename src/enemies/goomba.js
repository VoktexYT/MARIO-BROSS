import * as PIXI from "pixi.js";
import Spritesheet from "../package/package.spritesheet";

export default class Goomba {
    constructor(scene) {
        this.scene = scene;
        this.velocity = 1;
        this.positionMap = { x: 300, y: 480 };
        // this.positionMap = { x: 300, y: 480 };
    
        this.create_texture();

        this.sprite = new PIXI.AnimatedSprite(this.walk_animation);
            this.sprite.x = this.positionMap.x;
            this.sprite.y = this.positionMap.y;
            this.sprite.animationSpeed = 0.1;
            this.sprite.loop = true;
            this.sprite.scale.set(0.229);
            this.sprite.anchor.set(0.5);
        this.scene.addChild(this.sprite);

        this.sprite.play()

        this.moveLeft = () => {
            this.sprite.x -= this.velocity;
            this.positionMap.x -= this.velocity;
        }

        this.moveUp = () => {
            this.sprite.y -= this.velocity;
            this.positionMap.y -= this.velocity;
        }

        this.moveDown = () => {
            this.sprite.y += this.velocity;
            this.positionMap.y += this.velocity;
        }


        this.moveRight = () => {
            this.sprite.x += this.velocity;
            this.positionMap.x += this.velocity;
        }

        this.switch_move_side = false;
        this.lastDate = new Date();
    }

    update() {
        if (new Date() - this.lastDate > 2000) {
            this.lastDate = new Date();
            this.switch_move_side = !this.switch_move_side;
        } 

        if (this.switch_move_side) {
            this.moveLeft();
            this.moveDown();
        } else {
            this.moveRight();
            this.moveUp();
        }
    }

    create_texture() {
        this.goombaAnims = new Spritesheet()
            .setPath("static/goomba.png")
            .setSize(210, 210)
            .setSheetSize(630, 210)
            .build("0:1");
        
        this.walk_animation = [
            this.goombaAnims[0],
            this.goombaAnims[1],
        ];

        this.death_animation = [
            this.goombaAnims[2]
        ];
    }
}
