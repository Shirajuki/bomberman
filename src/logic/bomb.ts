import Entity from './entity';
import type Player from './player';
import { $entities, $players } from '../state';
import { TILE_SIZE } from '../constants';
import Explosion from './explosion';
import Box from './box';

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
  createExplosion(effects: Explosion[], x: number, y: number, walled, pos: string) {
    for (const b of $entities[0]) {
      if (b instanceof Box && this.absoluteCollision(b, x, y, -1, -1)) {
        walled[pos] = true;
        b.destroyed = true;
        break;
      }
    }
    effects.push(new Explosion(x, y, TILE_SIZE, TILE_SIZE, 'blue', this.owner));
  }
  explode(effects: Explosion[], map: string[][]) {
    const walled = { up: false, left: false, down: false, right: false };
    const TZ = TILE_SIZE;
    effects.push(new Explosion(this.posx * TZ, this.posy * TZ, TZ, TZ, 'blue', this.owner));
    for (let i = 1; i <= this.power; i++) {
      const spawnpos = {
        up: Math.max(this.posy - i, 0),
        left: Math.max(this.posx - i, 0),
        down: Math.max(this.posy + i, 0),
        right: Math.max(this.posx + i, 0),
      };
      // Check for tiling
      if (!walled.right && map[this.posy][spawnpos.right] === '1') walled.right = true;
      else if (!walled.right) this.createExplosion(effects, spawnpos.right * TZ, this.posy * TZ, walled, 'right');
      if (!walled.left && map[this.posy][spawnpos.left] === '1') walled.left = true;
      else if (!walled.left) this.createExplosion(effects, spawnpos.left * TZ, this.posy * TZ, walled, 'left');
      if (!walled.up && map[spawnpos.up][this.posx] === '1') walled.up = true;
      else if (!walled.up) this.createExplosion(effects, this.posx * TZ, spawnpos.up * TZ, walled, 'up');
      if (!walled.down && map[spawnpos.down][this.posx] === '1') walled.down = true;
      else if (!walled.down) this.createExplosion(effects, this.posx * TZ, spawnpos.down * TZ, walled, 'down');
    }
  }
  isOnTop(player: Player) {
    return this.spawnedOnPlayers.some((pname) => pname === player.name);
  }
}
export default Bomb;
