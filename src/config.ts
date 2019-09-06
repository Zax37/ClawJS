export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const GAMEPAD_INTERACTION_DELAY = 200;
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice';
import { BBCodeTextPlugin } from 'phaser3-rex-plugins';
import p from '../package.json';
import scenes from './scenes';

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
  plugins: {
    global: [
      NineSlicePlugin.DefaultCfg,
      {
        key: 'rexBBCodeTextPlugin',
        plugin: BBCodeTextPlugin,
        start: false
      },
    ],
  },
  input: {
    gamepad: true,
  }
};
