export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
import scenes from './scenes';

export const config: GameConfig = {
  type: Phaser.AUTO,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  parent: 'game',
  scene: scenes,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  }
};