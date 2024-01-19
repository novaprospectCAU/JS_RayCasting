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

import { raycastDraw, rightCanvas } from "./raycast.js";

import { quadrantCalculate, hypotenuseCalculate } from "./util.js";

import { toggleFlag } from "./display.js";

const PI = Math.PI.toFixed(8);

//real position of player in Minimap
export let playerX = 0;
export let playerY = 0;

export let playerAngle = PI * 0.5;

export let handMoving = false;
export let onHand = 1;
export let futureOnHand = 1;
export let drawingTick = 0; //animation tick for drawing stuffs

export function playerInit() {
  playerX = Math.floor(C1WIDTH / 2) + Math.floor(BLOCK_SIZE / 2);
  playerY = Math.floor(C1HEIGHT / 2);
}

//draw player in the minimap as a red dot
export function playerDraw() {
  minimap.fillStyle = "red";
  minimap.beginPath();
  minimap.arc(playerX, playerY, 3, 0, Math.PI * 2, true);
  minimap.fill();
}

//draw player's direction in the minimap as a red line
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

//draw player's sight(light) in the minimap as green lines
export function lightDraw() {
  const lightStartX = playerX;
  const lightStartY = playerY;

  const HALF_SIGHT = (PI / 6).toFixed(8);
  //temp code - it will draw circle around the player
  // const laserLength = leftCanvas.width * leftCanvas.height; //DEFAULT_VALUE

  let number = 0;
  for (let rayAngle = -HALF_SIGHT; rayAngle <= HALF_SIGHT; rayAngle += 0.005) {
    //temp code - it will draw circle around the player
    // const obj = quadrantCalculate(playerAngle + rayAngle);
    // const rayX = obj.X;
    // const rayY = obj.Y;

    const obj = rayCollide(playerAngle + rayAngle);
    const rayX = obj.x;
    const rayY = obj.y;
    const rayLength = obj.length;

    raycastDraw(number, rayLength);
    number++;

    minimap.strokeStyle = "green";
    minimap.beginPath();
    minimap.moveTo(lightStartX, lightStartY);
    //temp code - it will draw circle around the player
    // minimap.lineTo(
    //   lightStartX + laserLength * rayX,
    //   lightStartY + laserLength * rayY
    // );
    minimap.lineTo(rayX, rayY);
    minimap.closePath();
    minimap.stroke();
  }
}

//check if the light collides with the wall
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
    } else if (m > 1000) {
      m = 1000;
    }
  } else if (m < 0) {
    if (m > -0.001) {
      m = -0.001;
    } else if (m < -1000) {
      m = -1000;
    }
  }
  //because of Y-axis's direction, m should muliplied by -1
  m = -m;
  const objVert = rayCollideVertical(angle, m);
  const objHori = rayCollideHorizontal(angle, m);
  const obj = objVert.length > objHori.length ? objHori : objVert;
  return obj;
}

//check if the light collides with a wall vertically
//we don't need to think about when the value of m is infinite.
function rayCollideVertical(angle, m) {
  //X = (Y - py) / m + px
  let X = 0;
  if (angle >= 0 && angle < PI / 2) {
    for (
      let yCollideHeight = Math.floor(playerY / BLOCK_SIZE) * BLOCK_SIZE;
      yCollideHeight > 0;
      yCollideHeight -= BLOCK_SIZE
    ) {
      X = (yCollideHeight - playerY) / m + playerX;
      if (
        map[
          (Math.floor(yCollideHeight / BLOCK_SIZE) - 1) * mapHorizontalBlocks +
            Math.floor(X / BLOCK_SIZE)
        ] === 0
      ) {
        return {
          x: X,
          y: yCollideHeight,
          length: hypotenuseCalculate(X - playerX, yCollideHeight - playerY),
        };
      }
    }
    X = (0 - playerY) / m + playerX;
    return {
      x: X,
      y: 0,
      length: hypotenuseCalculate(X - playerX, 0 - playerY),
    };
  } else if (angle < PI) {
    for (
      let yCollideHeight = Math.floor(playerY / BLOCK_SIZE) * BLOCK_SIZE;
      yCollideHeight > 0;
      yCollideHeight -= BLOCK_SIZE
    ) {
      X = (yCollideHeight - playerY) / m + playerX;
      if (
        map[
          (Math.floor(yCollideHeight / BLOCK_SIZE) - 1) * mapHorizontalBlocks +
            Math.floor(X / BLOCK_SIZE)
        ] === 0
      ) {
        return {
          x: X,
          y: yCollideHeight,
          length: hypotenuseCalculate(X - playerX, yCollideHeight - playerY),
        };
      }
    }
    X = (0 - playerY) / m + playerX;
    return {
      x: X,
      y: 0,
      length: hypotenuseCalculate(X - playerX, 0 - playerY),
    };
  } else if (angle < (PI * 3) / 2) {
    for (
      let yCollideHeight = Math.ceil(playerY / BLOCK_SIZE) * BLOCK_SIZE;
      yCollideHeight < C1HEIGHT;
      yCollideHeight += BLOCK_SIZE
    ) {
      X = (yCollideHeight - playerY) / m + playerX;
      if (
        map[
          Math.ceil(yCollideHeight / BLOCK_SIZE) * mapHorizontalBlocks +
            Math.floor(X / BLOCK_SIZE)
        ] === 0
      ) {
        return {
          x: X,
          y: yCollideHeight,
          length: hypotenuseCalculate(X - playerX, yCollideHeight - playerY),
        };
      }
    }
    X = (C1HEIGHT - playerY) / m + playerX;
    return {
      x: X,
      y: C1HEIGHT,
      length: hypotenuseCalculate(X - playerX, C1HEIGHT - playerY),
    };
  } else {
    for (
      let yCollideHeight = Math.ceil(playerY / BLOCK_SIZE) * BLOCK_SIZE;
      yCollideHeight < C1HEIGHT;
      yCollideHeight += BLOCK_SIZE
    ) {
      X = (yCollideHeight - playerY) / m + playerX;
      if (
        map[
          Math.ceil(yCollideHeight / BLOCK_SIZE) * mapHorizontalBlocks +
            Math.floor(X / BLOCK_SIZE)
        ] === 0
      ) {
        return {
          x: X,
          y: yCollideHeight,
          length: hypotenuseCalculate(X - playerX, yCollideHeight - playerY),
        };
      }
    }
    X = (C1HEIGHT - playerY) / m + playerX;
    return {
      x: X,
      y: C1HEIGHT,
      length: hypotenuseCalculate(X - playerX, C1HEIGHT - playerY),
    };
  }
}

//check if the light collides with a wall horizontally
//we have to manage the case when the value of m is 0.
function rayCollideHorizontal(angle, m) {
  //Y = m(X - pX) + pY
  let Y = 0;
  //we have to handle the case when the m is 0.
  if (angle === 0) {
    for (
      let xCollideWidth = Math.ceil(playerX / BLOCK_SIZE) * BLOCK_SIZE;
      xCollideWidth < C1WIDTH;
      xCollideWidth += BLOCK_SIZE
    ) {
      Y = playerY;
      if (
        map[
          Math.floor(Y / BLOCK_SIZE) * mapHorizontalBlocks +
            Math.ceil(xCollideWidth / BLOCK_SIZE)
        ] === 0
      ) {
        return {
          x: xCollideWidth,
          y: Y,
          length: xCollideWidth - playerX,
        };
      }
    }
    return {
      x: C1WIDTH,
      y: playerY,
      length: C1WIDTH - playerX,
    };
  }
  if (angle === PI) {
    for (
      let xCollideWidth = Math.floor(playerX / BLOCK_SIZE) * BLOCK_SIZE;
      xCollideWidth > 0;
      xCollideWidth -= BLOCK_SIZE
    ) {
      Y = playerY;
      if (
        map[
          Math.floor(Y / BLOCK_SIZE) * mapHorizontalBlocks +
            Math.floor(xCollideWidth / BLOCK_SIZE)
        ] === 0
      ) {
        return {
          x: xCollideWidth,
          y: Y,
          length: playerX - xCollideWidth,
        };
      }
    }
    return {
      x: 0,
      y: playerY,
      length: playerX,
    };
  }
  if (angle > 0 && angle < PI / 2) {
    for (
      let xCollideWidth = Math.ceil(playerX / BLOCK_SIZE) * BLOCK_SIZE;
      xCollideWidth < C1WIDTH;
      xCollideWidth += BLOCK_SIZE
    ) {
      Y = m * (xCollideWidth - playerX) + playerY;
      if (
        map[
          Math.floor(Y / BLOCK_SIZE) * mapHorizontalBlocks +
            Math.ceil(xCollideWidth / BLOCK_SIZE)
        ] === 0
      ) {
        return {
          x: xCollideWidth,
          y: Y,
          length: hypotenuseCalculate(xCollideWidth - playerX, Y - playerY),
        };
      }
    }
    Y = m * (C1WIDTH - playerX) + playerY;
    return {
      x: C1WIDTH,
      y: Y,
      length: hypotenuseCalculate(C1WIDTH - playerX, Y - playerY),
    };
  } else if (angle < PI) {
    for (
      let xCollideWidth = Math.floor(playerX / BLOCK_SIZE) * BLOCK_SIZE;
      xCollideWidth > 0;
      xCollideWidth -= BLOCK_SIZE
    ) {
      Y = m * (xCollideWidth - playerX) + playerY;
      if (
        map[
          Math.floor(Y / BLOCK_SIZE) * mapHorizontalBlocks +
            Math.floor(xCollideWidth / BLOCK_SIZE) -
            1
        ] === 0
      ) {
        return {
          x: xCollideWidth,
          y: Y,
          length: hypotenuseCalculate(xCollideWidth - playerX, Y - playerY),
        };
      }
    }
    Y = m * (0 - playerX) + playerY;
    return {
      x: 0,
      y: Y,
      length: hypotenuseCalculate(0 - playerX, Y - playerY),
    };
  } else if (angle < (PI * 3) / 2) {
    for (
      let xCollideWidth = Math.floor(playerX / BLOCK_SIZE) * BLOCK_SIZE;
      xCollideWidth > 0;
      xCollideWidth -= BLOCK_SIZE
    ) {
      Y = m * (xCollideWidth - playerX) + playerY;
      if (
        map[
          Math.floor(Y / BLOCK_SIZE) * mapHorizontalBlocks +
            Math.floor(xCollideWidth / BLOCK_SIZE) -
            1
        ] === 0
      ) {
        return {
          x: xCollideWidth,
          y: Y,
          length: hypotenuseCalculate(xCollideWidth - playerX, Y - playerY),
        };
      }
    }
    Y = m * (0 - playerX) + playerY;
    return {
      x: 0,
      y: Y,
      length: hypotenuseCalculate(0 - playerX, Y - playerY),
    };
  } else {
    for (
      let xCollideWidth = Math.ceil(playerX / BLOCK_SIZE) * BLOCK_SIZE;
      xCollideWidth < C1WIDTH;
      xCollideWidth += BLOCK_SIZE
    ) {
      Y = m * (xCollideWidth - playerX) + playerY;
      if (
        map[
          Math.floor(Y / BLOCK_SIZE) * mapHorizontalBlocks +
            Math.ceil(xCollideWidth / BLOCK_SIZE)
        ] === 0
      ) {
        return {
          x: xCollideWidth,
          y: Y,
          length: hypotenuseCalculate(xCollideWidth - playerX, Y - playerY),
        };
      }
    }
    Y = m * (C1WIDTH - playerX) + playerY;
    return {
      x: C1WIDTH,
      y: Y,
      length: hypotenuseCalculate(C1WIDTH - playerX, Y - playerY),
    };
  }
}

// handMoving = false;
// onHand = 1;
// futureOnHand = 2;
// drawingTick = 0;
//입력받고 이동까지 구현
document.addEventListener("keydown", (e) => {
  let xMove = 0;
  let yMove = 0;

  if (e.key === 37 || e.key === "ArrowRight") {
    playerAngle -= PI / 30;
  } else if (e.key === 38 || e.key === "ArrowUp") {
    if (!playerCollide("up")) {
      xMove = Math.cos(playerAngle) * 2;
      yMove = -Math.sin(playerAngle) * 2;
      playerX += xMove;
      playerY += yMove;
    }
  } else if (e.key === 39 || e.key === "ArrowLeft") {
    playerAngle += PI / 30;
  } else if (e.key === 40 || e.key === "ArrowDown") {
    if (!playerCollide("down")) {
      xMove = Math.cos(playerAngle - PI) * 2;
      yMove = -Math.sin(playerAngle - PI) * 2;
      playerX += xMove;
      playerY += yMove;
    }
  } else if (e.key === 49 || e.key === "1") {
    if (!handMoving) {
      if (onHand === 2) {
        drawingTick = 100;
        futureOnHand = 1;
      }
    }
  } else if (e.key === 50 || e.key === "2") {
    if (!handMoving) {
      if (onHand === 1) {
        drawingTick = 100;
        futureOnHand = 2;
      }
    }
  } else if (e.key === "Space Bar" || e.key === " ") {
    toggleFlag();
  }
});

//check if the player is about to collide with a wall while moving
function playerCollide(direction) {
  //CurrentBlock : player's block
  const xCurrentBlock = Math.floor(playerX / BLOCK_SIZE);
  const yCurrentBlock = Math.floor(playerY / BLOCK_SIZE);

  let xVector = 0;
  let yVector = 0;
  if (direction === "up") {
    xVector = Math.cos(playerAngle) * 6;
    yVector = -Math.sin(playerAngle) * 6;
  } else {
    xVector = Math.cos(playerAngle - PI) * 6;
    yVector = -Math.sin(playerAngle - PI) * 6;
  }
  //DirectionBlock : future block
  const xDirectionBlock = Math.floor((playerX + xVector) / BLOCK_SIZE);
  const yDirectionBlock = Math.floor((playerY + yVector) / BLOCK_SIZE);
  //1. check if the x-direction block is a wall
  if (xCurrentBlock !== xDirectionBlock) {
    if (map[yDirectionBlock * mapHorizontalBlocks + xDirectionBlock] === 0) {
      return true;
    }
  }
  //2. check if the y-direction block is a wall
  if (yCurrentBlock !== yDirectionBlock) {
    if (map[yDirectionBlock * mapHorizontalBlocks + xDirectionBlock] === 0) {
      return true;
    }
  }
  //3. check if the (x, y)-direction block is a wall
  if (xCurrentBlock !== xDirectionBlock && yCurrentBlock !== yDirectionBlock) {
    if (map[yDirectionBlock * mapHorizontalBlocks + xDirectionBlock] === 0) {
      return true;
    }
  }
  return false;
}

rightCanvas.addEventListener("mousedown", (e) => {
  toggleFlag();
});
