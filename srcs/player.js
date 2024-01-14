import {
  minimap,
  C1WIDTH,
  C1HEIGHT,
  map,
  mapWidth,
  mapHeight,
  BLOCK_SIZE,
} from "./minimap.js";

//real position of player in Minimap
export let playerX = 0;
export let playerY = 0;
//map index of player
export let playerCoordinateX = 0;
export let playerCoordinateY = 0;

let playerAngle = 0;

export function playerInit() {
  playerX = Math.floor(C1WIDTH / 2) + Math.floor(BLOCK_SIZE / 2);
  playerY = Math.floor(C1HEIGHT / 2);
  playerCoordinateX = Math.floor(mapWidth / 2);
  playerCoordinateY = Math.floor(mapHeight / 2);
}

export function playerDraw() {
  minimap.fillStyle = "red";
  minimap.beginPath();
  minimap.arc(playerX, playerY, 3, 0, Math.PI * 2, true);
  minimap.fill();
}
