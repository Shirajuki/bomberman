import Entity from './entity';
import type Player from './player';
import { $bombs, $entities, $players } from '../state';
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
  animation = {
    padding: { x: 64, y: 64 },
    animations: {
      bomb: [0, 1, 2, 3],
    },
    animationName: 'bomb',
    curFrame: 0,
    frameSpeed: 1,
    frameCurTimer: 0,
    frameDuration: 10,
  };
  walled = { up: false, left: false, down: false, right: false };
  constructor(x: number, y: number, width: number, height: number, color: string, power: number) {
    super(x, y, width, height, color);
    this.timer = 150;
    this.power = power;
    this.owner = 'bob';
    this.sprite.src = '/assets/gfx/bomb.png';

    // Spawned on top logics
    this.posx = Math.round(this.x / TILE_SIZE);
    this.posy = Math.round(this.y / TILE_SIZE);
    for (const p of $players[0]) {
      if (this.posx === Math.round(p.x / TILE_SIZE) && this.posy === Math.round(p.y / TILE_SIZE))
        this.spawnedOnPlayers.push(p.name);
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    // Detonation timer
    this.timer--;
    if (this.timer <= 0) this.detonated = true;
    // Remove player spawned on check
    for (let i = 0; i < $players[0].length; i++)
      if (!this.collision($players[0][i], -1, -1)) this.spawnedOnPlayers.splice(i, 1);
    // Draw bomb
    this.animate();
    if (this.sprite.complete)
      ctx.drawImage(
        this.sprite,
        this.animation.padding.x * this.animation.animations[this.animation.animationName][this.animation.curFrame],
        this.animation.padding.y * 0,
        64,
        64,
        this.x,
        this.y,
        this.width,
        this.height,
      );
  }
  animate() {
    if (this.animation.frameCurTimer >= this.animation.frameDuration) {
      this.animation.frameCurTimer = 0;
      this.animation.curFrame++;
    } else this.animation.frameCurTimer += this.animation.frameSpeed;
    if (this.animation.curFrame >= this.animation.animations[this.animation.animationName].length)
      this.animation.curFrame = 0;
  }
  createExplosion(effects: Explosion[], x: number, y: number, walled: any, pos: string, ending: boolean) {
    // Box detonation
    for (const box of $entities[0]) {
      if (box instanceof Box && this.absoluteCollision(box, x, y, -1, -1)) {
        walled[pos] = true;
        box.destroyed = true;
        break;
      }
    }
    // Trigger other bombs
    for (const bomb of $bombs[0])
      if (this.absoluteCollision(bomb, x, y, -1, -1)) {
        walled[pos] = true;
        if (pos === 'left') bomb.walled['right'] = true;
        else if (pos === 'right') bomb.walled['left'] = true;
        else if (pos === 'up') bomb.walled['down'] = true;
        else if (pos === 'down') bomb.walled['up'] = true;
        bomb.timer = 0;
        return;
      }
    // Ending explosion check
    if (ending || walled[pos]) pos += '_ending';
    effects.push(new Explosion(x, y, TILE_SIZE, TILE_SIZE, 'blue', this.owner, pos));
  }
  explode(effects: Explosion[], map: string[][]) {
    const walled = this.walled;
    const TZ = TILE_SIZE;
    const MY = map.length;
    const MX = map[0].length;
    // Create middle explosion
    effects.push(new Explosion(this.posx * TZ, this.posy * TZ, TZ, TZ, 'blue', this.owner, 'middle'));
    // Loop through 4 directions on each power iteration
    for (let i = 1; i <= this.power; i++) {
      const spawnpos = {
        up: Math.max(this.posy - i, 0),
        left: Math.max(this.posx - i, 0),
        down: Math.min(this.posy + i, MY),
        right: Math.min(this.posx + i, MX),
      };
      // Check for tiling on each direction
      if (!walled.right && map[this.posy][spawnpos.right] !== '0') walled.right = true;
      else if (!walled.right)
        this.createExplosion(
          effects,
          spawnpos.right * TZ,
          this.posy * TZ,
          walled,
          'right',
          i === this.power || map[this.posy][spawnpos.right + 1] !== '0',
        );
      if (!walled.left && map[this.posy][spawnpos.left] !== '0') walled.left = true;
      else if (!walled.left)
        this.createExplosion(
          effects,
          spawnpos.left * TZ,
          this.posy * TZ,
          walled,
          'left',
          i === this.power || map[this.posy][Math.max(spawnpos.left - 1, 0)] !== '0',
        );
      if (!walled.up && map[spawnpos.up][this.posx] !== '0') walled.up = true;
      else if (!walled.up)
        this.createExplosion(
          effects,
          this.posx * TZ,
          spawnpos.up * TZ,
          walled,
          'up',
          i === this.power || map[Math.max(spawnpos.up - 1, 0)][this.posx] !== '0',
        );
      if (!walled.down && map[spawnpos.down][this.posx] !== '0') walled.down = true;
      else if (!walled.down)
        this.createExplosion(
          effects,
          this.posx * TZ,
          spawnpos.down * TZ,
          walled,
          'down',
          i === this.power || map[spawnpos.down + 1][this.posx] !== '0',
        );
    }
  }
  isOnTop(player: Player) {
    return this.spawnedOnPlayers.some((pname) => pname === player.name);
  }
}
export default Bomb;
