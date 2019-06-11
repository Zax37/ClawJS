import { DEFAULTS } from '../../model/Defaults';
import { DynamicObject } from '../../object/DynamicObject';
import { MapDisplay } from '../../scenes/MapDisplay';

export class PowerupGlitter extends DynamicObject {
  constructor(scene: MapDisplay, mainLayer: Phaser.Tilemaps.DynamicTilemapLayer, object: { x: number, y: number, z?: number, image?: string }) {
    super(scene, mainLayer, {
      x: object.x,
      y: object.y,
      z: (object.z || DEFAULTS.POWERUP.z) + 1,
      logic: 'PowerupGlitter',
      texture: 'GAME',
      image: PowerupGlitter.getImageSet(object.image),
      animation: 'GAME_CYCLE100',
      frame: 1,
    }, undefined, true);
  }

  private static getImageSet(collectibleImageSet?: string) {
    switch (collectibleImageSet) {
      case 'LEVEL_GEM':
      case 'GAME_MAPPIECE':
        return 'GAME_GREENGLITTER';
      default:
        return 'GAME_GLITTER';
    }
  }
}
