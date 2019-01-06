import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import { DEFAULTS } from '../model/Defaults';
import { ObjectCreationData } from '../model/ObjectData';
import DynamicObject from '../object/DynamicObject';
import MapDisplay from '../scenes/MapDisplay';

export default class AnimatedDecoration extends DynamicObject {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    let defaults = {};
    switch (object.logic) {
      default:
      case 'BehindAniCandy':
        defaults = DEFAULTS.BEHIND;
        break;
      case 'FrontAniCandy':
        defaults = DEFAULTS.FRONT;
        break;
    }
    super(scene, mainLayer, object, defaults, true);
  }
}
