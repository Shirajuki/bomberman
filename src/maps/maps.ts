import Box from '../logic/box';
import Entity from '../logic/entity';
import { MAP, TILE_SIZE } from '../constants';
import type Game from '../logic/game';

abstract class Map {
  game: Game;
  constructor(game: Game) {
    this.game = game;
  }
  public setup() {
    this.game.map = this.getBaseFloor()
      .split('\n')
      .map((m) => m.split(''));
    this.setupTiles();
    this.setupItems();
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
  public setupItems() {
    return;
  }
  public playerPosition(playerNumber: number) {
    if (playerNumber === 1) {
      return { x: 1, y: 1 };
    } else if (playerNumber === 2) {
      return { x: 1, y: 1 };
    } else if (playerNumber === 3) {
      return { x: 1, y: 1 };
    } else if (playerNumber === 4) {
      return { x: 1, y: 1 };
    }
  }
  protected getBaseFloor(): string {
    return MAP;
  }
  protected getBlocks(): string {
    return MAP;
  }
  protected getMonsters(): string {
    return;
  }
}
export default Map;
