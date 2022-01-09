import Box from '../logic/box';
import { GROUNDMAP, MAP, TILE_SIZE } from '../constants';
import type Game from '../logic/game';
import Map from './maps';
import Tile from '../logic/tile';
import type Entity from '../logic/entity';

class SnowMap extends Map {
  constructor(game: Game) {
    super(game);
  }
  protected setupGround() {
    const ground: Entity[] = [];
    const groundMap = this.getBaseFloor()
      .split('\n')
      .map((m) => m.split(''));
    const TZ = 64;
    for (let y = 0; y < groundMap.length; y++) {
      for (let x = 0; x < groundMap[y].length; x++) {
        const tile = groundMap[y][x];
        if (tile === '0') {
          ground.push(new Tile(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, TZ * 0, TZ * 4));
        } else if (tile === '2') {
          ground.push(new Tile(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, TZ * 1, TZ * 4));
        } else if (tile === '3') {
          ground.push(new Tile(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, TZ * 2, TZ * 4));
        }
      }
    }
    setTimeout(() => {
      for (const gr of ground) {
        gr.draw(this.game.bgctx);
      }
    }, 1000);
  }
  protected setupTiles() {
    this.game.map = this.getBlocks()
      .split('\n')
      .map((m) => m.split(''));
    const TZ = 64;
    for (let y = 0; y < this.game.map.length; y++) {
      for (let x = 0; x < this.game.map[y].length; x++) {
        const tile = this.game.map[y][x];
        if (tile === '1') {
          this.game.entities.push(new Tile(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, TZ * 0, TZ * 0));
        } else if (tile === '3') {
          this.game.entities.push(new Tile(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, TZ * 5, TZ * 4));
        } else if (tile === '2') {
          this.game.entities.push(new Box(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, TZ * 8, TZ * 4));
          this.game.map[y][x] = '0';
        }
      }
    }
  }
  protected getBaseFloor(): string {
    return GROUNDMAP;
  }
  protected getBlocks(): string {
    return MAP;
  }
}
export default SnowMap;
