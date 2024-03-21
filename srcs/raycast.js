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
  gameplay.fillStyle = `rgb(0,0,0)`; //floor
  gameplay.fillRect(0, C2HEIGHT / 2, C2WIDTH, C2HEIGHT / 2);
  gameplay.fillStyle = `rgb(64,64,64)`; //ceil
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

//select color of wall width distance and the angle(in number)
function raycastColor(number, distance, isEdge) {
  let colorCode = [255, 0, 0]; //[[R,G,B]]

  //color change by distance
  if (distance < 255) {
    colorCode[0] -= distance * 2;
  } else {
    colorCode[0] = 0;
    colorCode[1] = 0;
    colorCode[2] = 0;
  }
  //color change by lamp
  if (number > C2RAYS / 2) {
    colorCode[0] -= Math.floor((number - C2RAYS / 2) * 1.8);
  } else {
    colorCode[0] += Math.floor((C2RAYS / 2 - number) * 1.2);
  }
  return colorCode;
}
