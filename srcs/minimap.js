//this file is to draw left minimap side

export const leftCanvas = document.getElementById("minimap");
export const minimap = leftCanvas.getContext("2d");

export const C1WIDTH = leftCanvas.width;
export const C1HEIGHT = leftCanvas.height;

export let map = [];
export let mapWidth = 0;
export let mapHeight = 0;
export const BLOCK_SIZE = 30;

export function minimapInit() {
  const h = Math.floor(C1HEIGHT / BLOCK_SIZE);
  const w = Math.floor(C1WIDTH / BLOCK_SIZE);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (y === Math.floor(h / 2) || x === Math.floor(w / 2)) {
        map[y * w + x] = 1;
      } else {
        map[y * w + x] = Math.floor(Math.random() + 0.5);
      }
    }
  }
  mapWidth = w;
  mapHeight = h;
}

export function minimapDraw() {
  minimap.fillStyle = "grey";
  minimap.fillRect(0, 0, C1WIDTH, C1HEIGHT);
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (map[y * mapWidth + x] === 1) {
        minimap.fillStyle = "white";
        minimap.fillRect(x * BLOCK_SIZE + 0.5, y * BLOCK_SIZE + 0.5, 29, 29);
      } else {
        minimap.fillStyle = "black";
        minimap.fillRect(x * BLOCK_SIZE + 0.5, y * BLOCK_SIZE + 0.5, 29, 29);
      }
    }
  }
}
