import Entity from './entity';
import type Player from './player';
import { $players } from '../state';
import { TILE_SIZE } from '../constants';

class Bomb extends Entity {
  owner: string;
  timer = 0;
  power = 1;
  detonated = false;
  spawnedOnPlayers: string[] = [];
  posx: number;
  posy: number;
  constructor(x: number, y: number, width: number, height: number, color: string, power: number) {
    super(x, y, width, height, color);
    this.timer = 100;
    this.power = power;
    this.owner = 'bob';

    // Spawned on top logics
    this.posx = Math.round(this.x / TILE_SIZE);
    this.posy = Math.round(this.y / TILE_SIZE);
    for (const p of $players[0]) {
      if (this.posx === Math.round(p.x / TILE_SIZE) && this.posy === Math.round(p.y / TILE_SIZE))
        this.spawnedOnPlayers.push(p.name);
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    this.timer--;
    if (this.timer <= 0) this.detonated = true;
    for (let i = 0; i < $players[0].length; i++) {
      const p = $players[0][i];
      if (!this.collision(p, -1, -1)) this.spawnedOnPlayers.splice(i, 1);
    }
  }
  isOnTop(player: Player) {
    return this.spawnedOnPlayers.some((pname) => pname === player.name);
  }
}
export default Bomb;
