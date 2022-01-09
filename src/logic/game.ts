import type Entity from './entity';
import Player from './player';
import { TILE_SIZE } from '../constants';
import type Bomb from './bomb';
import type Explosion from './explosion';
import { $entities, $players, $bombs, $effects } from '../state';
import Box from './box';
import type Map from '../maps/maps';
import SnowMap from '../maps/snow';

class Game {
  state = 0;
  player: Player;
  entities: Entity[] = [];
  players: Player[] = [];
  bombs: Bomb[] = [];
  effects: Explosion[] = [];
  mapLogic: Map;
  map: string[][];
  // Framerate independence using timestamps
  dt = 1; // initial value to 1
  constructor() {
    this.state = 0;
    this.player = new Player(36, 36, TILE_SIZE, TILE_SIZE, 'red');
    this.players.push(this.player);
    this.loadMap();

    // Set global game states
    $entities[0] = this.entities;
    $players[0] = this.players;
    $bombs[0] = this.bombs;
    $effects[0] = this.effects;
  }
  loadMap() {
    this.mapLogic = new SnowMap(this);
    this.mapLogic.setup();
  }
  draw(ctx: CanvasRenderingContext2D) {
    // Entities & tiles loop
    for (let i = this.entities.length - 1; i >= 0; i--) {
      this.entities[i].draw(ctx);
      if (this.entities[i] instanceof Box && (this.entities[i] as Box).destroyed) this.entities.splice(i, 1);
    }
    // Bomb
    for (let i = this.bombs.length - 1; i >= 0; i--) {
      this.bombs[i].draw(ctx);
      if (this.bombs[i].detonated) {
        this.bombs[i].explode(this.effects, this.map);
        this.bombs.splice(i, 1);
      }
    }
    // Effects
    for (let i = this.effects.length - 1; i >= 0; i--) {
      this.effects[i].draw(ctx);
      if (this.effects[i].dissappear) {
        this.effects.splice(i, 1);
      }
    }
    this.player.logic(ctx, this.entities, this.dt, this.map);
  }
}
export default Game;
