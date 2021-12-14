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
  logic(ctx: CanvasRenderingContext2D, entities: Entity[], dt: number, map: string[]) {
    this.draw(ctx);
    // Movements
    this.force.dx = 0;
    this.force.dy = 0;
    const speed = 5;
    if (this.movement.up) this.force.dy -= speed;
    else if (this.movement.down) this.force.dy += speed;
    else if (this.movement.left) this.force.dx -= speed;
    else if (this.movement.right) this.force.dx += speed;
    this.move(entities, dt, map);
  }
  move(entities: Entity[], dt: number, map: string[]) {
    this.x += this.force.dx * dt;
    let hit_list = this.collisions(entities);
    for (const tile of hit_list) {
      if (this.force.dx > 0) {
        this.x = tile.x - this.width;
        this.slide(map, 1, 0);
      } else if (this.force.dx < 0) {
        this.x = tile.x + this.width;
        this.slide(map, -1, 0);
      }
    }
    this.y += this.force.dy * dt;
    hit_list = this.collisions(entities);
    for (const tile of hit_list) {
      if (this.force.dy > 0) {
        this.y = tile.y - this.height;
        this.slide(map, 0, 1);
      } else if (this.force.dy < 0) {
        this.y = tile.y + tile.height;
        this.slide(map, 0, -1);
      }
    }
  }
  slide(map: string[], padx: number, pady: number) {
    const x = Math.round(this.x / 32);
    const y = Math.round(this.y / 32);
    if (map[y + pady][x + padx] === '0') {
      if (pady !== 0) this.x = x * 32;
      else if (padx !== 0) this.y = y * 32;
    }
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
