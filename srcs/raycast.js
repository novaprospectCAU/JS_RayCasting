import { playerX, playerY, playerAngle } from "./player.js";
import { minimap, C1WIDTH, C1HEIGHT } from "./minimap.js";
import { wallHeightCalculate } from "./util.js";

//shader - optional
import { colorMix } from "./display.js";

export const rightCanvas = document.getElementById("gameplay");
export const gameplay = rightCanvas.getContext("2d");

export const C2WIDTH = rightCanvas.width;
export const C2HEIGHT = rightCanvas.height;
export const WALLHEIGHT = (rightCanvas.height * 3) / 4;
export const C2BLOCKWIDTH = C2WIDTH / 209; // there are 210 rays
export const C2RAYS = 210;

export function gameplayBackgroundDraw() {
  //background
  gameplay.fillStyle = `rgb(48,48,48)`;
  gameplay.fillRect(0, C2HEIGHT / 2, C2WIDTH, C2HEIGHT / 2);
  gameplay.fillStyle = `rgb(128,128,128)`;
  gameplay.fillRect(0, 0, C2WIDTH, C2HEIGHT / 2);
}

export function raycastDraw(number, distance) {
  const height = wallHeightCalculate(WALLHEIGHT, distance);
  const RGB = raycastColor(number, distance);

  //You can change color / theme / shader under the comment
  // colorMix(number, RGB);

  gameplay.fillStyle = `rgb(${RGB[0]},${RGB[1]},${RGB[2]})`;
  gameplay.fillRect(
    C2WIDTH - number * C2BLOCKWIDTH,
    C2HEIGHT / 2 - height,
    C2BLOCKWIDTH,
    height * 2
  );
}

function raycastColor(number, distance) {
  let colorCode = [255, 0, 0];
  if (distance < 255) {
    colorCode[0] -= (distance * 3) / 4;
    colorCode[1] += distance / 4;
    colorCode[2] += distance / 4;
  } else {
    colorCode[0] = 64;
    colorCode[1] = 64;
    colorCode[2] = 64;
  }

  return colorCode;
}
