import { playerX, playerY, playerAngle } from "./player.js";
import { minimap, C1WIDTH, C1HEIGHT } from "./minimap.js";

export const rightCanvas = document.getElementById("gameplay");
export const gameplay = rightCanvas.getContext("2d");
