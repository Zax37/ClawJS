export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
import scenes from './scenes';
import p from '../package.json';

export const config: GameConfig = {
  title: p.title,
  url: p.url,
  version: p.version,
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