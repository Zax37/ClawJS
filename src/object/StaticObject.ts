import { ObjectCreationData } from '../model/ObjectData';
import Booty from '../scenes/Booty';
import MapDisplay from '../scenes/MapDisplay';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import GameHUD from '../scenes/GameHUD';

function applyDefaults(object: ObjectCreationData, defaults: {}) {
  for (const key in defaults) {
    if (defaults.hasOwnProperty(key) && !object.hasOwnProperty(key)) {
      object[key] = defaults[key];
    }
  }
}


export default class StaticObject extends Phaser.GameObjects.Image {
  constructor(scene: MapDisplay | GameHUD | Booty, mainLayer: DynamicTilemapLayer | null, object: ObjectCreationData, defaults?: {}) {
    if (defaults) {
      applyDefaults(object, defaults);
    }

    super(scene, object.x, object.y, object.texture, object.image ? object.image + object.frame : undefined);
    this.depth = object.z;

    scene.sys.displayList.add(this);
  }
}
