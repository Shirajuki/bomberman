import Entity from './entity';
import { TILE_SIZE } from '../constants';
import Bomb from './bomb';
import { $bombs } from '../state';

class Player extends Entity {
  movement = { left: false, up: false, right: false, down: false };
  force = { dx: 0, dy: 0 };
  action = { bomb: false };
  stats = { power: 1, speed: 1 };
  speed = 3;
  name = 'Player';
  constructor(x: number, y: number, width: number, height: number, color: string) {
    super(x, y, width, height, color);
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
  }
  logic(ctx: CanvasRenderingContext2D, entities: Entity[], dt: number, map: string[][]) {
    this.draw(ctx);
    // Movements
    this.force.dx = 0;
    this.force.dy = 0;
    if (this.movement.up) this.force.dy -= this.speed;
    else if (this.movement.down) this.force.dy += this.speed;
    else if (this.movement.left) this.force.dx -= this.speed;
    else if (this.movement.right) this.force.dx += this.speed;
    this.move(entities, dt, map);

    // Bomb logic
    if (this.action.bomb) {
      this.action.bomb = false;
      const x = Math.round(this.x / TILE_SIZE) * TILE_SIZE;
      const y = Math.round(this.y / TILE_SIZE) * TILE_SIZE;
      for (const bomb of $bombs[0]) if (this.absoluteCollision(bomb, x, y, -1, -1)) return;
      console.log('bombing');
      const bomb = new Bomb(x, y, TILE_SIZE, TILE_SIZE, 'deeppink', this.stats.power);
      $bombs[0].push(bomb);
    }
  }
  move(entities: Entity[], dt: number, map: string[][]) {
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
  slide(map: string[][], padx: number, pady: number) {
    const x = Math.round(this.x / TILE_SIZE);
    const y = Math.round(this.y / TILE_SIZE);
    if (map[y + pady][x + padx] === '0') {
      if (pady !== 0) {
        for (const bomb of $bombs[0])
          if (this.absoluteCollision(bomb, x * this.width, (y + pady) * this.height, -1, -1)) return;
        this.x = x * TILE_SIZE;
      } else if (padx !== 0) {
        for (const bomb of $bombs[0])
          if (this.absoluteCollision(bomb, (x + padx) * this.width, y * this.height, -1, -1)) return;
        this.y = y * TILE_SIZE;
      }
    }
  }
  hit() {
    console.log('HIT!');
  }
  collisions(entities: Entity[]) {
    const hit_list = [];
    // Tile collisions
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      if (this.collision(entity)) hit_list.push(entity);
    }
    // Bomb collisions
    for (let i = 0; i < $bombs[0].length; i++) {
      const bomb = $bombs[0][i];
      if (this.collision(bomb) && !bomb.isOnTop(this)) hit_list.push(bomb);
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
