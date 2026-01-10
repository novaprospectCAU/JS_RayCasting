import { minimapInit, minimapDraw, leftCanvas, minimap } from "./minimap.js";
import {
  playerInit,
  playerDraw,
  laserDraw,
  lightDraw,
  cleanupPlayerEvents,
} from "./player.js";
import { rightCanvas, gameplay, gameplayBackgroundDraw } from "./raycast.js";
import { lampDraw, gunDraw } from "./display.js";

// 게임 초기화
minimapInit();
playerInit();

let animationNumber = 0;
let animationFrameId = null;

function gameLoop() {
  // 캔버스 초기화
  minimap.clearRect(0, 0, leftCanvas.width, leftCanvas.height);
  gameplay.clearRect(0, 0, rightCanvas.width, rightCanvas.height);

  // 렌더링
  minimapDraw();
  gameplayBackgroundDraw();
  playerDraw();
  lightDraw();
  laserDraw();
  gunDraw(animationNumber);

  // 다음 프레임 요청 (requestAnimationFrame이 브라우저 최적화됨)
  animationFrameId = requestAnimationFrame(gameLoop);
}

// 게임 시작
gameLoop();

// 페이지 언로드 시 정리 (React 전환 시 유용)
window.addEventListener("beforeunload", () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  cleanupPlayerEvents();
});
