const PI = Math.PI;
const TWO_PI = PI * 2;

/**
 * 각도를 정규화하고 해당 방향의 단위 벡터를 반환
 * Canvas의 Y축은 아래가 양수이므로 Y값을 반전
 */
export function quadrantCalculate(angle) {
  // 각도를 0 ~ 2PI 범위로 정규화
  let normalizedAngle = angle % TWO_PI;
  if (normalizedAngle < 0) {
    normalizedAngle += TWO_PI;
  }

  // Canvas의 Y축 방향이 반대이므로 sin 값을 반전
  return {
    X: Math.cos(normalizedAngle),
    Y: -Math.sin(normalizedAngle),
  };
}

/**
 * 빗변 길이 계산 (피타고라스 정리)
 * Math.hypot을 사용하면 더 간단하고 정확함
 */
export function hypotenuseCalculate(x, y) {
  return Math.hypot(x, y);
}

export function wallHeightCalculate(original, distance) {
  return original / Math.sqrt(distance / 2);
}
