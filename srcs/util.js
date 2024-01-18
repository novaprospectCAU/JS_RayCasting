const PI = Math.PI.toFixed(8);

export function quadrantCalculate(angle) {
  if (angle < 0) {
    angle += 2 * PI;
  }

  const realAngle = angle % (2 * PI);

  if (realAngle < PI / 2) {
    return quadrant1VectorCalculate(realAngle);
  } else if (realAngle < PI) {
    return quadrant2VectorCalculate(realAngle);
  } else if (realAngle < (3 * PI) / 2) {
    return quadrant3VectorCalculate(realAngle);
  } else {
    return quadrant4VectorCalculate(realAngle);
  }
}

//Canvas's y direction is reverse
function quadrant1VectorCalculate(angle) {
  return { X: Math.cos(angle), Y: -Math.sin(angle) };
}
function quadrant2VectorCalculate(angle) {
  return { X: Math.cos(angle), Y: -Math.sin(angle) };
}
function quadrant3VectorCalculate(angle) {
  return { X: Math.cos(angle), Y: -Math.sin(angle) };
}
function quadrant4VectorCalculate(angle) {
  return { X: Math.cos(angle), Y: -Math.sin(angle) };
}

//Calculate the length of ray (hypotenuse of triangle)
export function hypotenuseCalculate(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

export function wallHeightCalculate(original, distance) {
  return original / Math.sqrt(distance / 2);
}
