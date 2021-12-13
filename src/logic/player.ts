import Entity from './entity';

class Player extends Entity {
  movement = { left: false, up: false, right: false, down: false };
  force = { dx: 0, dy: 0 };
  action = { bomb: false };
  constructor(x: number, y: number, width: number, height: number, color: string) {
    super(x, y, width, height, color);
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
  }
  logic(ctx: CanvasRenderingContext2D, entities: Entity[], dt: number) {
    this.draw(ctx);
    // Movements
    this.force.dx = 0;
    this.force.dy = 0;
    const speed = 4;
    if (this.movement.up) this.force.dy -= speed;
    else if (this.movement.down) this.force.dy += speed;
    else if (this.movement.left) this.force.dx -= speed;
    else if (this.movement.right) this.force.dx += speed;
    this.move(entities, dt);
  }
  move(entities: Entity[], dt: number) {
    const collision = { top: false, left: false, bottom: false, right: false };
    this.x += this.force.dx * dt;
    let hit_list = this.collisions(entities);
    for (const tile of hit_list) {
      if (this.force.dx > 0) {
        this.x = tile.x - this.width;
        collision.right = true;
      } else if (this.force.dx < 0) {
        this.x = tile.x + this.width;
        collision.left = true;
      }
    }
    this.y += this.force.dy * dt;
    hit_list = this.collisions(entities);
    for (const tile of hit_list) {
      if (this.force.dy > 0) {
        this.y = tile.y - this.height;
        collision.bottom = true;
      } else if (this.force.dy < 0) {
        this.y = tile.y + tile.height;
        collision.top = true;
      }
    }
    return collision;
  }
  collisions(entities: Entity[]) {
    const hit_list = [];
    for (let i = 0; i < entities.length; i++) {
      const tile = entities[i];
      if (this.collision(tile)) {
        hit_list.push(tile);
      }
    }
    return hit_list;
  }
  collision(entity: Entity) {
    return (
      this.x < entity.x + entity.width &&
      this.x + this.width > entity.x &&
      this.y < entity.y + entity.height &&
      this.y + entity.height > entity.y
    );
  }
}
export default Player;
