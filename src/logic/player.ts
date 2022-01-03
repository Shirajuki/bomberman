import Entity from './entity';
import { TILE_SIZE } from '../constants';
import Bomb from './bomb';
import { $bombs } from '../state';
import { lerp } from '../lib/utils';

class Player extends Entity {
  movement = { left: false, up: false, right: false, down: false };
  force = { dx: 0, dy: 0 };
  action = { bomb: false };
  stats = { power: 1, speed: 1 };
  speed = 3;
  name = 'Player';
  sprite = new Image();
  // TODO: Add typing
  animation = {
    padding: { x: 96, y: 96 },
    animations: {
      down: [1, 0, 2, 0],
      right: [4, 3, 5, 3],
      left: [7, 6, 8, 6],
      up: [10, 9, 11, 9],
      down_idle: [0],
      right_idle: [3],
      left_idle: [6],
      up_idle: [9],
    },
    animationName: 'down_idle',
    curFrame: 0,
    frameSpeed: 1,
    frameCurTimer: 0,
    frameDuration: 3,
    direction: 'down',
  };
  constructor(x: number, y: number, width: number, height: number, color: string) {
    super(x, y, width, height, color);
    this.sprite.src = '/assets/gfx/player.png';
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    if (this.sprite.complete)
      ctx.drawImage(
        this.sprite,
        this.animation.padding.x * this.animation.animations[this.animation.animationName][this.animation.curFrame],
        this.animation.padding.y * 0,
        90,
        90,
        this.x - 5,
        this.y - 12,
        this.width + 10,
        this.height + 12,
      );
  }
  logic(ctx: CanvasRenderingContext2D, entities: Entity[], dt: number, map: string[][]) {
    this.draw(ctx);
    // Movements
    this.force.dx = 0;
    this.force.dy = 0;
    if (this.movement.up) {
      this.force.dy -= this.speed;
      this.animation.direction = 'up';
      this.animation.animationName = 'up';
    } else if (this.movement.down) {
      this.force.dy += this.speed;
      this.animation.direction = 'down';
      this.animation.animationName = 'down';
    } else if (this.movement.left) {
      this.force.dx -= this.speed;
      this.animation.direction = 'left';
      this.animation.animationName = 'left';
    } else if (this.movement.right) {
      this.force.dx += this.speed;
      this.animation.direction = 'right';
      this.animation.animationName = 'right';
    } else {
      this.animation.animationName = `${this.animation.direction}_idle`;
    }
    this.move(entities, dt, map);
    this.animate();
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
  animate() {
    if (this.animation.frameCurTimer >= this.animation.frameDuration) {
      this.animation.frameCurTimer = 0;
      this.animation.curFrame++;
    } else this.animation.frameCurTimer += this.animation.frameSpeed;
    if (this.animation.curFrame >= this.animation.animations[this.animation.animationName].length)
      this.animation.curFrame = 0;
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
  // Corner fix
  slide(map: string[][], padx: number, pady: number) {
    const x = Math.round(this.x / TILE_SIZE);
    const y = Math.round(this.y / TILE_SIZE);
    if (map[y + pady][x + padx] === '0') {
      if (pady !== 0) {
        for (const bomb of $bombs[0])
          if (this.absoluteCollision(bomb, x * this.width, (y + pady) * this.height, -1, -1)) return;
        this.x = lerp(this.x, x * TILE_SIZE, 0.3);
      } else if (padx !== 0) {
        for (const bomb of $bombs[0])
          if (this.absoluteCollision(bomb, (x + padx) * this.width, y * this.height, -1, -1)) return;
        this.y = lerp(this.y, y * TILE_SIZE, 0.3);
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
      if (this.collision(entity, -1, -1)) hit_list.push(entity);
    }
    // Bomb collisions ERROR HERE
    for (let i = 0; i < $bombs[0].length; i++) {
      const bomb = $bombs[0][i];
      if (this.collision(bomb, -1, -1) && !bomb.isOnTop(this)) hit_list.push(bomb);
    }
    return hit_list;
  }
}
export default Player;
