import Entity from './entity';
import Player from './player';
import { MAP, TILE_SIZE } from '../constants';
import type Bomb from './bomb';
import type Explosion from './explosion';
import { $entities, $players, $bombs, $effects } from '../state';

class Game {
  state = 0;
  player: Player;
  entities: Entity[] = [];
  players: Player[] = [];
  bombs: Bomb[] = [];
  effects: Explosion[] = [];
  map: string[];
  // Framerate independence using timestamps
  dt = 1; // initial value to 1
  constructor() {
    this.state = 0;
    this.player = new Player(36, 36, TILE_SIZE, TILE_SIZE, 'red');
    this.players.push(this.player);
    this.loadMap(MAP);

    // Set global game states
    $entities[0] = this.entities;
    $players[0] = this.players;
    $bombs[0] = this.bombs;
    $effects[0] = this.effects;
  }
  loadMap(map) {
    map = map.split('\n');
    this.map = map;
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tile = map[y][x];
        if (tile === '1') {
          const t = new Entity(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, 'green');
          this.entities.push(t);
        }
      }
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    // Entities & tiles loop
    for (let i = this.entities.length - 1; i >= 0; i--) {
      this.entities[i].draw(ctx);
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
