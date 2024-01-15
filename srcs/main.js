import { minimapInit, minimapDraw } from "./minimap.js";
import { playerInit, playerDraw, laserDraw } from "./player.js";

export const PI = Math.PI.toFixed(8);

const rightCanvas = document.getElementById("gameplay");
const gameplay = rightCanvas.getContext("2d");

minimapInit();
minimapDraw();

playerInit();
playerDraw();
laserDraw();
