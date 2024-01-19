import { minimapInit, minimapDraw, leftCanvas, minimap } from "./minimap.js";
import { playerInit, playerDraw, laserDraw, lightDraw } from "./player.js";
import { rightCanvas, gameplay, gameplayBackgroundDraw } from "./raycast.js";
import { lampDraw, gunDraw } from "./display.js";

const PI = Math.PI.toFixed(8);
const ANIMATION_TICK = 1 / 60;

minimapInit();
playerInit();

let animationNumber = 0;
function gameLoop() {
  minimap.clearRect(0, 0, leftCanvas.width, leftCanvas.height);
  gameplay.clearRect(0, 0, rightCanvas.width, rightCanvas.height);

  minimapDraw();
  gameplayBackgroundDraw();
  playerDraw();
  lightDraw();
  laserDraw();
  // lampDraw(animationNumber);

  gunDraw(animationNumber);

  // animationNumber++;
  // animationNumber = animationNumber > 120 ? 0 : animationNumber;

  setTimeout(gameLoop, ANIMATION_TICK);
}

gameLoop();
