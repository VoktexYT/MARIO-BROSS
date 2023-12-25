import * as PIXI from 'pixi.js';

import { world_scene, map, world, CODE } from './world/world.create.scene';
import { player_scene, player } from './player/player.create.scene';
import { menu_scene } from './menu/menu.create.scene';
import { Event, Execute } from './package/package.keyboard';
import Gravity from './package/package.gravity';
import Goomba from './enemies/goomba';


// APPLICATION
const APP = new PIXI.Application({
    width: 768,
    height: 600,
    antialias: true,
    transparent: false,
    resolution: 1,
    backgroundColor: "#5080ff"
});

document.body.appendChild(APP.view);

APP.stage.addChild(world_scene, player_scene, menu_scene);


// OBJECT
const GRAVITY = new Gravity()
    .setGravity(0.001)
    .setActive(false);

const EVENT = new Event(APP);

const goomba = new Goomba(world_scene);
world_scene.addChild(goomba.sprite);

// const rectangle = new PIXI.Graphics();
//     rectangle.beginFill(0xFF0000); // Fill color (red in this example)
//     rectangle.drawRect(-player.sprite.width/2, 0, player.sprite.width/2, player.sprite.height/2); // x, y, width, height
//     rectangle.endFill();

// APP.stage.addChild(rectangle);


// POSITION
let lastPlayerYPos = player.sprite.y;

const worldSceneRight = () => world_scene.x + world_scene.width;

const playerRight = () => player.sprite.x + player.sprite.width / 2;
const playerLeft = () => player.sprite.x - player.sprite.width / 2;

const isPlayerMiddleScreenRight = () => playerRight() >= APP.screen.width / 2;
const isPlayerMiddleScreenLeft = () => playerLeft() <= APP.screen.width / 2;

const getPlayerFeetGridPosition = (offsetX, offsetY) => {
    const gridX = Math.floor((player.positionMap.x + offsetX) / 48);
    const gridY = Math.floor((player.positionMap.y + offsetY) / 48);
    return { gridX, gridY };
};


// DEFAULT VAR
let walk_dirr = {right: false, left: false};
let jump = false;
let time = 0;
let vi = 0.01;
let onFloor = false;

const no_collide_code = new Set([
    CODE.air.code,
    CODE.herb_left.code,
    CODE.herb_middle.code,
    CODE.herb_right.code,
    CODE.cloud_left.code,
    CODE.cloud_middle.code,
    CODE.cloud_right.code,
    CODE.cloud_bottom_left.code,
    CODE.cloud_bottom_middle.code,
    CODE.cloud_bottom_right.code
]);

const jump_config = () => {
    if (onFloor) {
        GRAVITY.setActive(true)
        time = 350;
        vi = 0.2;
        jump = true;
    }
}

const fall_config = () => {
    GRAVITY.setActive(true)
    time = 50;
    vi = 0;
    jump = false;
}


// KEYBOARD EVENTS
new Execute()
    .setKeyName("ArrowUp")
    .setLoopingFunction(false)
    .setDownEvent(jump_config, false)
    .build()

new Execute()
    .setKeyName("ArrowRight")
    .setLoopingFunction(true)
    .setUpEvent(() => {walk_dirr.right = false}, false)
    .setDownEvent(
        () => {
            walk_dirr.right = true;
            player.flipRight();

            if (!player.sprite.playing) {
                player.sprite.textures = player.child_walk_animation;
                player.sprite.gotoAndPlay(0);
            }
            
            const pos = getPlayerFeetGridPosition(player.sprite.width/2, player.sprite.height/2+10)
            const pos2 = getPlayerFeetGridPosition(player.sprite.width/2, -player.sprite.height/2+10)

            if (no_collide_code.has(map[pos['gridY']+2][pos['gridX']].code) && 
                no_collide_code.has(map[pos2['gridY']+2][pos2['gridX']].code)) {

                if (isPlayerMiddleScreenRight() && (world_scene.x <= 0 && worldSceneRight() >= APP.screen.width)) {
                    world_scene.x -= player.velocity;
                    player.positionMap.x += player.velocity;
                } else if (playerRight() + player.velocity < APP.screen.width) {
                    player.moveRight()
                }
            }
        }, true
    )
    .build();

new Execute()
    .setKeyName("ArrowLeft")
    .setLoopingFunction(true)
    .setUpEvent(() => {walk_dirr.left = false}, false)
    .setDownEvent(
        () => {
            walk_dirr.left = true
            player.flipLeft();

            if (!player.sprite.playing && !jump) {
                player.sprite.textures = player.child_walk_animation;
                player.sprite.gotoAndPlay(0);
            }

            const pos = getPlayerFeetGridPosition(-player.sprite.width/2, -player.sprite.height/2)
            const pos2 = getPlayerFeetGridPosition(-player.sprite.width/2, player.sprite.height/2+10)
            
            if (pos['gridX'] > 0 &&
                no_collide_code.has(map[pos['gridY']+2][pos['gridX']].code) &&
                no_collide_code.has(map[pos2['gridY']+2][pos2['gridX']].code)) {

                    if (isPlayerMiddleScreenLeft() && world_scene.x < 0) {
                        world_scene.x += player.velocity;
                        player.positionMap.x -= player.velocity;

                    } else if (playerLeft() - player.velocity > 0) {
                        player.moveLeft()
                    }
            }
        }, true
    )
    .build();


// GAME LOOP
APP.ticker.add(() => {
    
    // goomba.update();
    // rectangle.x = player.sprite.x;
    // rectangle.y = player.sprite.y;

    console.log(
        goomba.sprite.x + world_scene.x,
        goomba.sprite.y + world_scene.y
    );

    EVENT.update();
    const pos = getPlayerFeetGridPosition(0, player.sprite.height-5)
    const inSky = no_collide_code.has(map[pos.gridY + 2][pos.gridX].code);

    if (inSky && !jump) {
        GRAVITY.setActive(true);
        const grav = GRAVITY.apply(vi, time)[0];
        player.sprite.y -= grav;
        player.positionMap.y -= grav;
    }

    if (jump) {
        lastPlayerYPos = player.sprite.y;

        GRAVITY.setActive(true);

        const grav = GRAVITY.apply(vi, time)[0];
        player.sprite.y -= grav;
        player.positionMap.y -= grav;

        if (lastPlayerYPos < player.sprite.y) {
            jump = false;
        }

        const pos2 = getPlayerFeetGridPosition(0, player.sprite.height/2)
        const sprite_on_top = map[pos2['gridY']+1][pos2['gridX']];

        switch (sprite_on_top.code) {
            case CODE.brick.code:
                fall_config()
                sprite_on_top.sprite.y -= 20;

                setTimeout(() => {
                    world_scene.removeChild(sprite_on_top.sprite);
                    sprite_on_top.code = CODE.air.code;
                }, 200);

                break;
                

            case CODE.lucky_block_on.code:
                fall_config()
    
                sprite_on_top.sprite.y -= 20;

                setTimeout(() => {
                    sprite_on_top.sprite.y += 20
                }, 200)

                sprite_on_top.sprite.texture = CODE.lucky_block_off.sprite;
                
                break;
        }
    }

    if (inSky) {
        onFloor = false;
        player.sprite.textures = player.child_jump_animation;
    }

    if (!jump && !inSky) {
        if (!walk_dirr.left && !walk_dirr.right) {
            player.sprite.textures = player.child_iddle_animation;
        }
        fall_config()
        onFloor = true;
    }

    time += GRAVITY.active;

    // const goombaLeft = goomba.sprite.x - goomba.sprite.width / 2;
    // const goombaRight = goomba.sprite.x + goomba.sprite.width / 2;
    // const goombaTop = goomba.sprite.y - goomba.sprite.height / 2;
    // const goombaBottom = goomba.sprite.y + goomba.sprite.height / 2;

    // console.log((player.sprite.x+player.sprite.width/2), goombaLeft)

    // if (
    //     (player.sprite.x+player.sprite.width/2) > goombaLeft &&
    //     (player.sprite.y+player.sprite.height/2) > goombaTop &&
    //     (player.sprite.x-player.sprite.width/2) < goombaRight&&
    //     (player.sprite.y-player.sprite.height/2) < goombaBottom
    // ) {
    //     player.sprite.textures = player.child_death_animation;
    // }
})
