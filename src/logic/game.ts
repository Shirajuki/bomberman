import Entity from './entity';
import Player from './player';
import { MAP, TILE_SIZE } from '../constants';
import type Bomb from './bomb';
import type Explosion from './explosion';
import { $entities, $players, $bombs, $effects } from '../state';
import Box from './box';

class Game {
  state = 0;
  player: Player;
  entities: Entity[] = [];
  players: Player[] = [];
  bombs: Bomb[] = [];
  effects: Explosion[] = [];
  map: string[][];
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
  loadMap(map: string) {
    this.map = map.split('\n').map((m) => m.split(''));
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const tile = this.map[y][x];
        if (tile === '1') {
          const t = new Entity(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, 'green');
          this.entities.push(t);
        } else if (tile === '2') {
          this.map[y][x] = '0';
          const t = new Box(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, 'darkgreen');
          this.entities.push(t);
        }
      }
    }
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
