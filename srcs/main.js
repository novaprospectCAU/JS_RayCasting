import { minimapInit, minimapDraw } from "./minimap.js";
import { playerInit, playerDraw, laserDraw, lightDraw } from "./player.js";

const PI = Math.PI.toFixed(8);
const ANIMATION_TICK = 1 / 60;

const rightCanvas = document.getElementById("gameplay");
const gameplay = rightCanvas.getContext("2d");

const leftCanvas = document.getElementById("minimap");
const minimap = leftCanvas.getContext("2d");

minimapInit();
minimapDraw();

playerInit();
playerDraw();
laserDraw();
lightDraw();

function gameLoop() {
  minimap.clearRect(0, 0, leftCanvas.width, leftCanvas.height);
  gameplay.clearRect(0, 0, rightCanvas.width, rightCanvas.height);

  minimapDraw();
  playerDraw();
  lightDraw();
  laserDraw();

  setTimeout(gameLoop, ANIMATION_TICK);
}

gameLoop();
