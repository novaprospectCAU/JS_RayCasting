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

const lampImg = new Image();
lampImg.src = "./../assets/lamp.png";

export function colorMix(number, RGB) {
  if (number === C2RAYS / 2) return;
  if (number < C2RAYS / 2) {
    RGB[0] -= 2 * (C2RAYS / 2 - number);
    RGB[1] += 2 * (C2RAYS / 2 - number);
    RGB[2] += 2 * (C2RAYS / 2 - number);
  } else {
  }
}

export async function lampDraw(animationNumber) {
  //12 animation tick per one animation cycle

  const angle1 = PI / 60;
  const angle2 = PI / 30;
  const angle3 = PI / 20;

  gameplay.drawImage(lampImg, (C2WIDTH * 1.3) / 4 + 10, 0, 200, 200);
}
