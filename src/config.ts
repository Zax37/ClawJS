export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
import scenes from './scenes';

export const config: GameConfig = {
  title: 'ClawJS',
  url: 'http://clawjs.us.openode.io/',
  version: '1.0.2',
  disableContextMenu: true,
  fps: {
    min: 10,
    target: 60,
    panicMax: 120,
    deltaHistory: 10,
  },
  type: Phaser.AUTO,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  parent: 'game',
  scene: scenes,
};