import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import { DEFAULTS } from '../model/Defaults';
import StaticObject from '../object/StaticObject';
import MapDisplay from '../scenes/MapDisplay';
import { ObjectCreationData } from '../model/ObjectData';

export default class StaticDecoration extends StaticObject {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    let defaults = {};
    switch (object.logic) {
      case 'FrontCandy':
        defaults = DEFAULTS.FRONT;
        break;
      case 'BehindCandy':
        defaults = DEFAULTS.BEHIND;
        break;
      case 'GooCoverup':
        defaults = DEFAULTS.GOOCOVERUP;
        break;
      default:
        break;
    }

    super(scene, mainLayer, object, defaults);
    if (object.logic === 'GooCoverup') {
      console.log(this);
    }
  }
}
