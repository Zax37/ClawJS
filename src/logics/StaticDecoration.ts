import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import { DEFAULTS } from '../model/Defaults';
import StaticObject from '../object/StaticObject';
import MapDisplay from '../scenes/MapDisplay';

export default class StaticDecoration extends StaticObject {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    let defaults = {};
    switch (object.logic) {
      case 'FrontCandy':
        defaults = DEFAULTS.FRONT;
        break;
      case 'BehindCandy':
        defaults = DEFAULTS.BEHIND;
        break;
      default:
        break;
    }

    super(scene, mainLayer, object, defaults);
  }
}