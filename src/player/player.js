import * as PIXI from "pixi.js";
import Spritesheet from "../package/package.spritesheet";

export default class Player {
    constructor(scene) {
        this.scene = scene;
        //this.velocity = 20;
        this.velocity = 3;
        this.positionMap = { x: 180, y: 400 };
    
        this.create_texture();

        this.sprite = new PIXI.AnimatedSprite(this.child_walk_animation);
            this.sprite.x = this.positionMap.x;
            this.sprite.y = this.positionMap.y;
            this.sprite.animationSpeed = 0.3;
            this.sprite.loop = false;
            this.sprite.scale.set(0.4);
            this.sprite.anchor.set(0.5);
        this.scene.addChild(this.sprite);
        

        this.flipLeft = () => {
            if (this.sprite.scale.x > 0) {
                this.sprite.scale.x = -this.sprite.scale.x;
            }
        }

        this.moveLeft = () => {
            this.sprite.x -= this.velocity;
            this.positionMap.x -= this.velocity;
        }

        this.flipRight = () => {
            if (this.sprite.scale.x < 0) {
                this.sprite.scale.x = Math.abs(this.sprite.scale.x);
            }
        }

        this.moveRight = () => {
            this.sprite.x += this.velocity;
            this.positionMap.x += this.velocity;
        }
    }

    create_texture() {
        this.child_frame_textures = new Spritesheet()
            .setPath("static/player/player1.png")
            .setSize(160, 160)
            .setSheetSize(1120, 160)
            .build("0:6");
        
        this.child_iddle_animation = [
            this.child_frame_textures[0]
        ]

        this.child_walk_animation = [
            this.child_frame_textures[1],
            this.child_frame_textures[2],
            this.child_frame_textures[3],
        ]

        this.child_rotate_animation = [
            this.child_frame_textures[4]
        ]

        this.child_jump_animation = [
            this.child_frame_textures[5]
        ]

        this.child_death_animation = [
            this.child_frame_textures[6]
        ]
        

        this.transform_frame_textures = new Spritesheet()
            .setPath("static/player/player2.png")
            .setSize(160, 240)
            .setSheetSize(160, 240)
            .build("0");

        this.adult_frame_textures = new Spritesheet()
            .setPath("static/player/player3.png")
            .setSize(160, 320)
            .setSheetSize(1120, 320)
            .build("0:6");
    }
}
