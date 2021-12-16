<script lang="ts">
  import { onMount } from 'svelte';
  import Game from '../logic/game';
  import { TILE_SIZE } from '../constants';
  let canvas: HTMLCanvasElement;
  const game = new Game();
  const player = game.player;
  let fps: number;
  (window as any).game = game;
  onMount(() => {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    canvas.width = 928;
    canvas.height = 517;
    ctx.imageSmoothingEnabled = false;
    let frame: number; // AnimationFrame cancel on unmount / exit
    let secondsPassed: number, oldTimeStamp: number;
    // Pad camera
    ctx.translate(-Math.floor(TILE_SIZE / 3), -Math.floor(TILE_SIZE / 3));

    const gameLoop = (timeStamp: number) => {
      frame = requestAnimationFrame(gameLoop);
      // Calculate the number of seconds passed since the last frame
      secondsPassed = (timeStamp - oldTimeStamp) * 0.001;
      oldTimeStamp = timeStamp;
      // Calculate fps
      fps = Math.round(1 / secondsPassed) || 60;
      game.dt = secondsPassed * 60 || 1;
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw the game
        game.draw(ctx);
      }
    };
    requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(frame);
    };
  });
  // Player movement
  document.onkeydown = (event) => {
    if (event.key === 'ArrowRight') player.movement.right = true;
    else if (event.key === 'ArrowUp') player.movement.up = true;
    else if (event.key === 'ArrowLeft') player.movement.left = true;
    else if (event.key === 'ArrowDown') player.movement.down = true;
    else if (event.key === ' ') player.action.bomb = true;
    // event.preventDefault();
  };
  document.onkeyup = (event) => {
    if (event.key === 'ArrowRight') player.movement.right = false;
    else if (event.key === 'ArrowUp') player.movement.up = false;
    else if (event.key === 'ArrowLeft') player.movement.left = false;
    else if (event.key === 'ArrowDown') player.movement.down = false;
    else if (event.key === ' ') player.action.bomb = false;
    event.preventDefault();
  };
</script>

<div class="game">
  <canvas bind:this={canvas} width={928} height={517} />
</div>

<style>
  div.game {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 924px;
    height: 520px;
    overflow: hidden;
  }
  canvas {
    background-color: #aaa;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
