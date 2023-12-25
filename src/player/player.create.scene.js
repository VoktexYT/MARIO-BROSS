import * as PIXI from 'pixi.js';

import Player from './player';

export const player_scene = new PIXI.Container();

export const player = new Player(player_scene);

