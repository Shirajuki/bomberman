import Entity from './entity';

class Box extends Entity {
  constructor(x: number, y: number, width: number, height: number, color: string) {
    super(x, y, width, height, color);
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
  }
}
export default Box;
