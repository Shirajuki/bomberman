import Entity from './entity';

class Bomb extends Entity {
  owner: string;
  timer = 0;
  detonated = 0;
  constructor(x: number, y: number, width: number, height: number, color: string) {
    super(x, y, width, height, color);
    this.timer = 100;
    this.owner = 'bob';
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    this.timer == 0;
  }
}
export default Bomb;
