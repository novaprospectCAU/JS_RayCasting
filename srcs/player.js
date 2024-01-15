import {
  minimap,
  C1WIDTH,
  C1HEIGHT,
  map,
  mapWidth,
  mapHeight,
  BLOCK_SIZE,
} from "./minimap.js";

import { quadrantCalculate } from "./util.js";

const PI = Math.PI.toFixed(8);

//real position of player in Minimap
export let playerX = 0;
export let playerY = 0;

export let playerAngle = (PI * 2) / 3;

export function playerInit() {
  playerX = Math.floor(C1WIDTH / 2) + Math.floor(BLOCK_SIZE / 2);
  playerY = Math.floor(C1HEIGHT / 2);
}

export function playerDraw() {
  minimap.fillStyle = "red";
  minimap.beginPath();
  minimap.arc(playerX, playerY, 3, 0, Math.PI * 2, true);
  minimap.fill();
}

export function laserDraw() {
  const laserStartX = playerX;
  const laserStartY = playerY;
  const laserLength = 20;

  const obj = quadrantCalculate(playerAngle);
  const laserX = obj.X;
  const laserY = obj.Y;
  minimap.strokeStyle = "red";
  minimap.beginPath();
  minimap.moveTo(laserStartX, laserStartY);
  minimap.lineTo(
    laserStartX + laserLength * laserX,
    laserStartY + laserLength * laserY
  );
  minimap.closePath();
  minimap.stroke();
}
