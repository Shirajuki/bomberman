import Entity from './entity';
import { $players, $bombs } from '../state';

class Explosion extends Entity {
  owner: string;
  timer = 0;
  dissappear = false;
  animation = {
    padding: { x: 64, y: 64 },
    animations: {
      explosion: [0, 1, 2, 3],
    },
    animationName: 'explosion',
    curFrame: 0,
    frameSpeed: 1,
    frameCurTimer: 0,
    frameDuration: 12,
    lockedFrameY: 0,
  };
  constructor(x: number, y: number, width: number, height: number, color: string, owner: string, type: string) {
    super(x, y, width, height, color);
    this.owner = owner;
    this.timer = 50;
    this.sprite.src = '/assets/gfx/bomb.png';
    if (type === 'middle') {
      this.animation.lockedFrameY = 1;
    } else if (type === 'left' || type === 'right') {
      this.animation.lockedFrameY = 2;
    } else if (type === 'up' || type === 'down') {
      this.animation.lockedFrameY = 5;
    } else if (type === 'left_ending') {
      this.animation.lockedFrameY = 3;
    } else if (type === 'right_ending') {
      this.animation.lockedFrameY = 4;
    } else if (type === 'up_ending') {
      this.animation.lockedFrameY = 6;
    } else if (type === 'down_ending') {
      this.animation.lockedFrameY = 7;
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    for (const bomb of $bombs[0]) if (this.collision(bomb, -1, -1)) bomb.timer = 0;
    for (const player of $players[0]) if (this.collision(player, -1, -1)) player.hit();
    this.animate();
    this.timer--;
    if (this.timer <= 0) this.dissappear = true;
    if (this.sprite.complete)
      ctx.drawImage(
        this.sprite,
        this.animation.padding.x * this.animation.animations[this.animation.animationName][this.animation.curFrame],
        this.animation.padding.y * this.animation.lockedFrameY,
        64,
        64,
        this.x,
        this.y,
        this.width,
        this.height,
      );
    else {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fill();
    }
  }
  animate() {
    if (this.animation.frameCurTimer >= this.animation.frameDuration) {
      this.animation.frameCurTimer = 0;
      this.animation.curFrame++;
    } else this.animation.frameCurTimer += this.animation.frameSpeed;
    if (this.animation.curFrame >= this.animation.animations[this.animation.animationName].length) {
      this.animation.curFrame = 0;
      this.timer = 0;
      this.dissappear = true;
    }
  }
}
export default Explosion;
