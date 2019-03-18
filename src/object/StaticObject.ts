import { ObjectCreationData } from '../model/ObjectData';
import { BootyScene } from '../scenes/BootyScene';
import { GameHUD } from '../scenes/GameHUD';
import { MapDisplay } from '../scenes/MapDisplay';

function applyDefaults(object: ObjectCreationData, defaults: {}) {
  for (const key in defaults) {
    if (defaults.hasOwnProperty(key) && !object.hasOwnProperty(key)) {
      object[key] = defaults[key];
    }
  }
}


export class StaticObject extends Phaser.GameObjects.Image {
  constructor(scene: MapDisplay | GameHUD | BootyScene, mainLayer: Phaser.Tilemaps.DynamicTilemapLayer | null, object: ObjectCreationData, defaults?: {}) {
    if (defaults) {
      applyDefaults(object, defaults);
    }

    super(scene, object.x, object.y, object.texture, object.image ? object.image + object.frame : undefined);
    this.setDepth(object.z);

    scene.sys.displayList.add(this);
  }
}
