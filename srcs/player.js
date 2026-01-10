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

// ============ 상수 정의 ============
const PI = Math.PI;
const TWO_PI = PI * 2;

// 플레이어 설정
const PLAYER_MOVE_SPEED = 2;
const PLAYER_ROTATE_SPEED = PI / 30;
const COLLISION_CHECK_DISTANCE = 6;

// 시야 설정
const HALF_FOV = PI / 6; // 시야각의 절반 (30도)
const RAY_ANGLE_STEP = 0.005;

// ============ 플레이어 상태 ============
export let playerX = 0;
export let playerY = 0;
export let playerAngle = PI * 0.5;

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

/**
 * 플레이어 시야(광선)를 미니맵에 녹색 선으로 그림
 */
export function lightDraw() {
  const lightStartX = playerX;
  const lightStartY = playerY;

  let rayIndex = 0;
  for (
    let rayAngle = -HALF_FOV;
    rayAngle <= HALF_FOV;
    rayAngle += RAY_ANGLE_STEP
  ) {
    const hitResult = rayCollide(playerAngle + rayAngle);
    const { x: rayX, y: rayY, length: rayLength } = hitResult;

    raycastDraw(rayIndex, rayLength);
    rayIndex++;

    // 미니맵에 광선 그리기
    minimap.strokeStyle = "green";
    minimap.beginPath();
    minimap.moveTo(lightStartX, lightStartY);
    minimap.lineTo(rayX, rayY);
    minimap.closePath();
    minimap.stroke();
  }
}

/**
 * 광선이 벽과 충돌하는 지점을 계산
 */
function rayCollide(angle) {
  // 각도 정규화 (0 ~ 2PI)
  angle = ((angle % TWO_PI) + TWO_PI) % TWO_PI;
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

// ============ 입력 처리 ============

/**
 * 키보드 입력 핸들러
 */
function handleKeyDown(e) {
  switch (e.key) {
    case "ArrowRight":
      playerAngle -= PLAYER_ROTATE_SPEED;
      break;
    case "ArrowLeft":
      playerAngle += PLAYER_ROTATE_SPEED;
      break;
    case "ArrowUp":
      if (!playerCollide("up")) {
        playerX += Math.cos(playerAngle) * PLAYER_MOVE_SPEED;
        playerY -= Math.sin(playerAngle) * PLAYER_MOVE_SPEED;
      }
      break;
    case "ArrowDown":
      if (!playerCollide("down")) {
        playerX += Math.cos(playerAngle - PI) * PLAYER_MOVE_SPEED;
        playerY -= Math.sin(playerAngle - PI) * PLAYER_MOVE_SPEED;
      }
      break;
    case " ": // Space bar
      toggleFlag();
      break;
  }
}

/**
 * 마우스 클릭 핸들러
 */
function handleMouseDown() {
  toggleFlag();
}

// 이벤트 리스너 등록
document.addEventListener("keydown", handleKeyDown);
rightCanvas.addEventListener("mousedown", handleMouseDown);

/**
 * 이벤트 리스너 정리 함수 (React 전환 시 필요)
 */
export function cleanupPlayerEvents() {
  document.removeEventListener("keydown", handleKeyDown);
  rightCanvas.removeEventListener("mousedown", handleMouseDown);
}

/**
 * 플레이어가 벽과 충돌하는지 확인
 */
function playerCollide(direction) {
  const xCurrentBlock = Math.floor(playerX / BLOCK_SIZE);
  const yCurrentBlock = Math.floor(playerY / BLOCK_SIZE);

  // 이동 방향에 따른 벡터 계산
  const angle = direction === "up" ? playerAngle : playerAngle - PI;
  const xVector = Math.cos(angle) * COLLISION_CHECK_DISTANCE;
  const yVector = -Math.sin(angle) * COLLISION_CHECK_DISTANCE;

  // 예상 위치의 블록 좌표
  const xDirectionBlock = Math.floor((playerX + xVector) / BLOCK_SIZE);
  const yDirectionBlock = Math.floor((playerY + yVector) / BLOCK_SIZE);

  // 블록이 변경되면 충돌 검사
  if (xCurrentBlock !== xDirectionBlock || yCurrentBlock !== yDirectionBlock) {
    const mapIndex = yDirectionBlock * mapHorizontalBlocks + xDirectionBlock;
    if (map[mapIndex] === 0) {
      return true;
    }
  }

  return false;
}
