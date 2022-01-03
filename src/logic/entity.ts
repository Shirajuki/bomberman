class Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  sprite = new Image();
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
  collision(other: Entity, padx = 0, pady = 0) {
    return this.absoluteCollision(other, this.x, this.y, padx, pady);
  }
  absoluteCollision(other: Entity, x: number, y: number, padx = 0, pady = 0) {
    return !(
      y + this.height + pady < other.y ||
      y - pady > other.y + other.height ||
      x + this.width + padx < other.x ||
      x - padx > other.x + other.width
    );
  }
}
export default Entity;
