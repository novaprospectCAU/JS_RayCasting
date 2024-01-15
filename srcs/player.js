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

export let playerAngle = PI * -0.2;

export let moveRight = false;
export let moveLeft = false;
export let moveUp = false;
export let moveDown = false;

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

export function lightDraw() {
  const lightStartX = playerX;
  const lightStartY = playerY;

  const HALF_SIGHT = (PI / 6).toFixed(8);
  //temp code
  const laserLength = 80;

  for (let rayAngle = -HALF_SIGHT; rayAngle <= HALF_SIGHT; rayAngle += 0.05) {
    const obj = quadrantCalculate(playerAngle + rayAngle);
    const rayX = obj.X;
    const rayY = obj.Y;
    minimap.strokeStyle = "green";
    minimap.beginPath();
    minimap.moveTo(lightStartX, lightStartY);
    minimap.lineTo(
      lightStartX + laserLength * rayX,
      lightStartY + laserLength * rayY
    );
    minimap.closePath();
    minimap.stroke();
  }
}

function rayCollide(angle) {}

function rayCollideVertical() {
  const numberOfBlocks = Math.floor(C1WIDTH / BLOCK_SIZE);
  const playerBlock = Math.floor(playerX / BLOCK_SIZE);
  for (let i = playerBlock + 1; i < numberOfBlocks; i++) {}
}

function rayCollideHorizontal() {
  const numberOfBlocks = Math.floor(C1HEIGHT / BLOCK_SIZE);
}

//입력만 받고 실제 움직임은 아직 구현하지 않았음
document.addEventListener("keydown", (e) => {
  if (e.key === 37 || e.key === "ArrowRight") {
    moveRight = true;
  } else if (e.key === 38 || e.key === "ArrowUp") {
    moveUp = true;
  } else if (e.key === 39 || e.key === "ArrowLeft") {
    moveLeft = true;
  } else if (e.key === 40 || e.key === "ArrowDown") {
    moveDown = true;
  } else {
  }
});
