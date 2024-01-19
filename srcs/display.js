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

const gunImgArr = [];
gunImgArr[0] = new Image();
gunImgArr[0].src = "./../assets/ak.png";
gunImgArr[1] = new Image();
gunImgArr[1].src = "./../assets/ak2.png";
gunImgArr[2] = new Image();
gunImgArr[2].src = "./../assets/ak3.png";
gunImgArr[3] = new Image();
gunImgArr[3].src = "./../assets/ak.png";

export let gunFireFlag = false;
let gunFireTick = 0;

export function colorMix(number, RGB) {
  if (number === C2RAYS / 2) return;
  if (number < C2RAYS / 2) {
    RGB[0] -= 2 * (C2RAYS / 2 - number);
    RGB[1] += 2 * (C2RAYS / 2 - number);
    RGB[2] += 2 * (C2RAYS / 2 - number);
  } else {
  }
}

export function lampDraw(animationNumber) {
  //12 animation tick per one animation cycle

  const angle1 = PI / 60;
  const angle2 = PI / 30;
  const angle3 = PI / 20;

  gameplay.drawImage(lampImg, (C2WIDTH * 1.3) / 4 + 10, 0, 200, 200);
}

export function gunDraw(animationNumber) {
  if (gunFire(animationNumber) === "none") {
    gameplay.drawImage(gunImgArr[0], C2WIDTH / 2, 0, 200, 200);
  }
}

export function gunFire(animationNumber) {
  if (gunFireFlag) {
    if (gunFireTick === 0) {
      gunFireTick = 15;
    }
    let gunRecoilVal = Math.ceil(gunFireTick / 5);
    if (gunRecoilVal === 1 || gunRecoilVal === 3) {
      gunRecoilVal = 1;
    }
    gameplay.drawImage(
      gunImgArr[Math.ceil(gunFireTick / 5)],
      C2WIDTH / 2 + gunRecoilVal * 5,
      gunRecoilVal * 5,
      200,
      200
    );
    gunFireTick--;
    if (gunFireTick === 0) {
      gunFireFlag = false;
    }
    return "fire";
  }
  return "none";
}

export function toggleFlag() {
  gunFireFlag = !gunFireFlag;
}
