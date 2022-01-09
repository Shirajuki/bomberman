import { GROUNDMAP, MAP } from '../constants';
import type Game from '../logic/game';

abstract class Map {
  game: Game;
  constructor(game: Game) {
    this.game = game;
  }
  public setup() {
    this.setupGround();
    this.setupTiles();
    this.setupItems();
  }
  protected setupGround() {
    return;
  }
  protected setupTiles() {
    return;
  }
  protected setupItems() {
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
    return GROUNDMAP;
  }
  protected getBlocks(): string {
    return MAP;
  }
  protected getMonsters(): string {
    return;
  }
}
export default Map;
