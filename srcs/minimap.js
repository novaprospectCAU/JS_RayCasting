//this file is to draw left minimap side

export const leftCanvas = document.getElementById("minimap");
export const minimap = leftCanvas.getContext("2d");

export const C1WIDTH = leftCanvas.width; //real canvas width
export const C1HEIGHT = leftCanvas.height; //real canvas height

export let map = [];
export let mapHorizontalBlocks = 0; //가로 칸 수 - canvas horizontal blocks
export let mapVerticalBlocks = 0; //세로 칸 수 - canvas vertical blocks
export const BLOCK_SIZE = 10; //한칸의 길이 - real size(= width, height) of one block

//setting map array : 1 = white(empty field), 0 = black(wall)
export function minimapInit() {
  const h = Math.floor(C1HEIGHT / BLOCK_SIZE);
  const w = Math.floor(C1WIDTH / BLOCK_SIZE);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (y === 0 || y === h - 1 || x == 0 || x == w - 1) {
        map[y * w + x] = 0;
      } else if (y === Math.floor(h / 2) || x === Math.floor(w / 2)) {
        map[y * w + x] = 1;
      } else {
        map[y * w + x] = Math.floor(Math.random() + 0.5);
      }
    }
  }
  mapHorizontalBlocks = w;
  mapVerticalBlocks = h;
}

//draw left-side minimap randomly
export function minimapDraw() {
  minimap.fillStyle = "grey";
  minimap.fillRect(0, 0, C1WIDTH, C1HEIGHT);
  for (let y = 0; y < mapVerticalBlocks; y++) {
    for (let x = 0; x < mapHorizontalBlocks; x++) {
      if (map[y * mapHorizontalBlocks + x] === 1) {
        minimap.fillStyle = "white";
        minimap.fillRect(x * BLOCK_SIZE + 0.5, y * BLOCK_SIZE + 0.5, 9, 9);
      } else {
        minimap.fillStyle = "black";
        minimap.fillRect(x * BLOCK_SIZE + 0.5, y * BLOCK_SIZE + 0.5, 9, 9);
      }
    }
  }
}
