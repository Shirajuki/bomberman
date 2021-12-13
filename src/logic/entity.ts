class Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  constructor(x: number, y: number, width: number, height: number, color: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
  }
  collision(other: Entity) {
    return !(
      this.y + this.height < other.y ||
      this.y > other.y + other.height ||
      this.x + this.width < other.x ||
      this.x > other.x + other.width
    );
  }
}
export default Entity;
