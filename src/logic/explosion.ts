import Entity from './entity';
import { $bombs } from '../state';

class Explosion extends Entity {
  owner: string;
  timer = 0;
  dissappear = false;
  constructor(x: number, y: number, width: number, height: number, color: string, owner: string) {
    super(x, y, width, height, color);
    this.owner = owner;
    this.timer = 50;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    for (const bomb of $bombs[0]) if (this.collision(bomb, -1, -1)) bomb.timer = 0;
    this.timer--;
    if (this.timer <= 0) this.dissappear = true;
  }
}
export default Explosion;
