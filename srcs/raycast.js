import { wallHeightCalculate } from "./util.js";

// 셰이더 (선택사항)
import { colorMix } from "./display.js";

// ============ 캔버스 설정 ============
export const rightCanvas = document.getElementById("gameplay");
export const gameplay = rightCanvas.getContext("2d");

export const C2WIDTH = rightCanvas.width;
export const C2HEIGHT = rightCanvas.height;
export const WALLHEIGHT = (rightCanvas.height * 3) / 4;

// 광선 설정
export const C2RAYS = 210;
export const C2BLOCKWIDTH = C2WIDTH / (C2RAYS - 1);

// 색상 설정
const FLOOR_COLOR = "rgb(0, 0, 0)";
const CEILING_COLOR = "rgb(64, 64, 64)";
const BASE_WALL_COLOR = 255; // 빨간색 기준

/**
 * 배경 (바닥 + 천장) 그리기
 */
export function gameplayBackgroundDraw() {
  const halfHeight = C2HEIGHT / 2;

  gameplay.fillStyle = FLOOR_COLOR;
  gameplay.fillRect(0, halfHeight, C2WIDTH, halfHeight);

  gameplay.fillStyle = CEILING_COLOR;
  gameplay.fillRect(0, 0, C2WIDTH, halfHeight);
}

/**
 * 광선 기반 벽 그리기
 */
export function raycastDraw(rayIndex, distance) {
  const height = wallHeightCalculate(WALLHEIGHT, distance);
  const color = calculateWallColor(rayIndex, distance);

  // 셰이더 적용 (선택사항)
  // colorMix(rayIndex, color);

  gameplay.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  gameplay.fillRect(
    C2WIDTH - rayIndex * C2BLOCKWIDTH,
    C2HEIGHT / 2 - height,
    C2BLOCKWIDTH,
    height * 2
  );
}

/**
 * 거리와 광선 인덱스에 따른 벽 색상 계산
 */
function calculateWallColor(rayIndex, distance) {
  const color = [BASE_WALL_COLOR, 0, 0]; // [R, G, B]
  const halfRays = C2RAYS / 2;

  // 거리에 따른 어두워짐
  if (distance < 255) {
    color[0] -= distance * 2;
  } else {
    // 너무 멀면 완전히 어둡게
    return [0, 0, 0];
  }

  // 램프(화면 중앙) 기준 조명 효과
  if (rayIndex > halfRays) {
    color[0] -= Math.floor((rayIndex - halfRays) * 1.8);
  } else {
    color[0] += Math.floor((halfRays - rayIndex) * 1.2);
  }

  // 색상 값 클램핑 (0-255)
  color[0] = Math.max(0, Math.min(255, color[0]));

  return color;
}
