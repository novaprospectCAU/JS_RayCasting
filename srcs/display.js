import {
  rightCanvas,
  gameplay,
  C2WIDTH,
  C2HEIGHT,
  C2BLOCKWIDTH,
  WALLHEIGHT,
  C2RAYS,
} from "./raycast.js";

// ============ 상수 정의 ============
const GUN_SIZE = 200;
const GUN_RECOIL_DURATION = 15;
const GUN_RECOIL_MULTIPLIER = 5;

// ============ 이미지 리소스 ============
const lampImg = new Image();
lampImg.src = "./../assets/lamp.png";

// 총 이미지 배열 (더 간결한 초기화)
const GUN_IMAGE_SOURCES = [
  "./../assets/ak.png",
  "./../assets/ak2.png",
  "./../assets/ak3.png",
  "./../assets/ak.png", // 마지막 프레임은 첫 번째와 동일
];
const gunImgArr = GUN_IMAGE_SOURCES.map((src) => {
  const img = new Image();
  img.src = src;
  return img;
});

// ============ 상태 ============
let gunFireFlag = false;
let gunFireTick = 0;

/**
 * 색상 혼합 효과 (셰이더용)
 */
export function colorMix(number, RGB) {
  const halfRays = C2RAYS / 2;
  if (number === halfRays) return;

  if (number < halfRays) {
    const diff = 2 * (halfRays - number);
    RGB[0] -= diff;
    RGB[1] += diff;
    RGB[2] += diff;
  }
  // number > halfRays 케이스는 현재 미구현
}

/**
 * 램프 그리기
 */
export function lampDraw() {
  gameplay.drawImage(lampImg, (C2WIDTH * 1.3) / 4 + 10, 0, GUN_SIZE, GUN_SIZE);
}

/**
 * 총 그리기 (발사 애니메이션 포함)
 */
export function gunDraw() {
  if (gunFireFlag) {
    drawGunFiring();
  } else {
    // 기본 상태
    gameplay.drawImage(gunImgArr[0], C2WIDTH / 2, 0, GUN_SIZE, GUN_SIZE);
  }
}

/**
 * 총 발사 애니메이션 처리
 */
function drawGunFiring() {
  if (gunFireTick === 0) {
    gunFireTick = GUN_RECOIL_DURATION;
  }

  // 반동 계산 (1 또는 3일 때는 1로 통일)
  let recoilFrame = Math.ceil(gunFireTick / 5);
  if (recoilFrame === 1 || recoilFrame === 3) {
    recoilFrame = 1;
  }

  const recoilOffset = recoilFrame * GUN_RECOIL_MULTIPLIER;

  gameplay.drawImage(
    gunImgArr[Math.ceil(gunFireTick / 5)],
    C2WIDTH / 2 + recoilOffset,
    recoilOffset,
    GUN_SIZE,
    GUN_SIZE
  );

  gunFireTick--;
  if (gunFireTick === 0) {
    gunFireFlag = false;
  }
}

/**
 * 발사 상태 토글
 */
export function toggleFlag() {
  gunFireFlag = !gunFireFlag;
}
