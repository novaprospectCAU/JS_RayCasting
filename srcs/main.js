import { minimapInit, minimapDraw, leftCanvas, minimap } from "./minimap.js";
import { playerInit, playerDraw, laserDraw, lightDraw } from "./player.js";
import { rightCanvas, gameplay } from "./raycast.js";

const PI = Math.PI.toFixed(8);
const ANIMATION_TICK = 1 / 60;

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
