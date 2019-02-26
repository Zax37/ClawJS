import { DEFAULTS } from '../model/Defaults';
import DynamicObject from '../object/DynamicObject';
import MapDisplay from '../scenes/MapDisplay';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class PowerupGlitter extends DynamicObject {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: { x: number, y: number, z?: number }, green?: boolean) {
    super(scene, mainLayer, {
      x: object.x,
      y: object.y,
      z: (object.z || DEFAULTS.POWERUP.z) + 1,
      logic: 'PowerupGlitter',
      texture: 'GAME',
      image: green ? 'GAME_GREENGLITTER' : 'GAME_GLITTER',
      animation: 'GAME_CYCLE100',
      frame: 1,
    }, undefined, true);
  }
}
