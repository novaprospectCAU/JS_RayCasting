import {
  rightCanvas,
  gameplay,
  C2WIDTH,
  C2HEIGHT,
  C2BLOCKWIDTH,
  WALLHEIGHT,
  C2RAYS,
} from "./raycast.js";

const PI = Math.PI.toFixed(8);

export function colorMix(number, RGB) {
  if (number === C2RAYS / 2) return;
  if (number < C2RAYS / 2) {
    RGB[0] -= 2 * (C2RAYS / 2 - number);
    RGB[1] += 2 * (C2RAYS / 2 - number);
    RGB[2] += 2 * (C2RAYS / 2 - number);
  } else {
  }
}
