import Box from '../logic/box';
import Entity from '../logic/entity';
import { TILE_SIZE } from '../constants';
import type Game from '../logic/game';
import Map from './maps';

class SnowMap extends Map {
  constructor(game: Game) {
    super(game);
  }
  public setupTiles() {
    for (let y = 0; y < this.game.map.length; y++) {
      for (let x = 0; x < this.game.map[y].length; x++) {
        const tile = this.game.map[y][x];
        if (tile === '1') {
          const t = new Entity(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, 'green');
          this.game.entities.push(t);
        } else if (tile === '2') {
          const t = new Box(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, 'darkgreen');
          this.game.entities.push(t);
          this.game.map[y][x] = '0';
        }
      }
    }
  }
}
export default SnowMap;
