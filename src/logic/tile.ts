import Entity from './entity';

class Tile extends Entity {
  tileX: number;
  tileY: number;
  constructor(x: number, y: number, width: number, height: number, tileX: number, tileY: number) {
    super(x, y, width, height, 'black');
    this.sprite.src = '/assets/gfx/tiles.png';
    this.tileX = tileX;
    this.tileY = tileY;
  }
  draw(ctx: CanvasRenderingContext2D) {
    if (this.sprite.complete)
      ctx.drawImage(this.sprite, this.tileX, this.tileY, 64, 64, this.x, this.y, this.width, this.height);
    else {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fill();
    }
  }
}
export default Tile;
