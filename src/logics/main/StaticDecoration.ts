import { DEFAULTS } from '../../model/Defaults';
import { ObjectCreationData } from '../../model/ObjectData';
import { StaticObject } from '../../object/StaticObject';
import { MapDisplay } from '../../scenes/MapDisplay';

export class StaticDecoration extends StaticObject {
  constructor(scene: MapDisplay, mainLayer: Phaser.Tilemaps.DynamicTilemapLayer, object: ObjectCreationData) {
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
  }
}
