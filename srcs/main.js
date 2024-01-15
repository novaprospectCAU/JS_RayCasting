import { minimapInit, minimapDraw } from "./minimap.js";
import { playerInit, playerDraw, laserDraw, lightDraw } from "./player.js";

const PI = Math.PI.toFixed(8);

const rightCanvas = document.getElementById("gameplay");
const gameplay = rightCanvas.getContext("2d");

minimapInit();
minimapDraw();

playerInit();
playerDraw();
laserDraw();
lightDraw();
