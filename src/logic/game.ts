import Entity from './entity';
import Player from './player';
const map = `11111111111111111111111111111
10000000000000000000000000001
10011110000000000000000000001
10000010000000000000000000001
10000010000000000000000000001
10001000000000000000000000001
10000000000000000000000000001
10000000000000000000000000001
10000010000000000000000000001
10000010000000000000000000001
10000010000000000000000000001
10000010111000000000000000001
10000000000000000000000000001
10000000000001100000000000001
10000000000000000000000000001
11111111111111111111111111111`;

class Game {
  state = 0;
  player: Player;
  entities: Entity[] = [];
  // Framerate independence using timestamps
  dt = 1; // initial value to 1
  constructor() {
    this.state = 0;
    this.player = new Player(100, 100, 32, 32, 'red');
    this.loadMap(map);
  }
  loadMap(map) {
    map = map.split('\n');
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tile = map[y][x];
        if (tile === '1') {
          const t = new Entity(x * 32, y * 32, 32, 32, 'green');
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
    this.player.logic(ctx, this.entities, this.dt);
  }
}
export default Game;
