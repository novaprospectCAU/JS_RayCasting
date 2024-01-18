import {
  leftCanvas,
  minimap,
  C1WIDTH,
  C1HEIGHT,
  map,
  mapHorizontalBlocks,
  mapVerticalBlocks,
  BLOCK_SIZE,
} from "./minimap.js";

import { quadrantCalculate } from "./util.js";

const PI = Math.PI.toFixed(8);

//real position of player in Minimap
export let playerX = 0;
export let playerY = 0;

export let playerAngle = PI * 0.5;

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
  const laserLength = leftCanvas.width * leftCanvas.height; //DEFAULT_VALUE

  for (let rayAngle = -HALF_SIGHT; rayAngle <= HALF_SIGHT; rayAngle += 0.05) {
    const obj = quadrantCalculate(playerAngle + rayAngle);
    const rayX = obj.X;
    const rayY = obj.Y;

    // const obj = rayCollide(playerAngle + rayAngle);
    // const rayX = obj.x;
    // const rayY = obj.y;

    minimap.strokeStyle = "green";
    minimap.beginPath();
    minimap.moveTo(lightStartX, lightStartY);
    minimap.lineTo(
      lightStartX + laserLength * rayX,
      lightStartY + laserLength * rayY
    );
    // minimap.lineTo(rayX, rayY);
    minimap.closePath();
    minimap.stroke();
  }
}

function rayCollide(angle) {
  while (angle < 0) {
    angle += 2 * PI;
  }
  while (angle > 2 * PI) {
    angle %= 2 * PI;
  }
  if (angle === 2 * PI) {
    angle = 0;
  }
  let m = Math.tan(angle);
  if (m > 0) {
    if (m < 0.001) {
      m = 0.001;
      playerAngle = 0.001;
    } else if (m > 1000) {
      m = 1000;
      playerAngle = 1.56979633;
    }
  } else if (m < 0) {
    if (m > -0.001) {
      m = -0.001;
      playerAngle = -0.001;
    } else if (m < -1000) {
      m = -1000;
      playerAngle = -1.56979633;
    }
  }
  const objVert = rayCollideVertical(angle, m);
  // const objHori = rayCollideHorizontal(angle);
  // const obj = objVert.length > objHori.length ? objHori : objVert;
  return objVert;
}

function rayCollideVertical(angle, m) {
  //X = (Y - py) / m + px
  // if (angle >= 0 && angle < PI / 2) {
  // } else if (angle < )
}

function rayCollideHorizontal(angle, m) {
  //Y = m(X - pX) + pY
}

//입력받고 이동까지는 구현했으나 충돌은 구현하지 않았음
document.addEventListener("keydown", (e) => {
  let xMove = 0;
  let yMove = 0;

  if (e.key === 37 || e.key === "ArrowRight") {
    moveRight = true;
    playerAngle -= PI / 30;
  } else if (e.key === 38 || e.key === "ArrowUp") {
    moveUp = true;
    xMove = Math.cos(playerAngle) * 2;
    yMove = -Math.sin(playerAngle) * 2;
    playerX += xMove;
    playerY += yMove;
  } else if (e.key === 39 || e.key === "ArrowLeft") {
    moveLeft = true;
    playerAngle += PI / 30;
  } else if (e.key === 40 || e.key === "ArrowDown") {
    moveDown = true;
    xMove = Math.cos(playerAngle - PI) * 2;
    yMove = -Math.sin(playerAngle - PI) * 2;
    playerX += xMove;
    playerY += yMove;
  } else {
  }
});
