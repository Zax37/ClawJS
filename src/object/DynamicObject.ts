import { ObjectCreationData } from '../model/ObjectData';
import BootyScene from '../scenes/BootyScene';
import MapDisplay from '../scenes/MapDisplay';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import GameHUD from '../scenes/GameHUD';

function applyDefaults(object: {}, defaults: {}) {
  for (const key in defaults) {
    if (defaults.hasOwnProperty(key) && !object.hasOwnProperty(key)) {
      object[key] = defaults[key];
    }
  }
}

export default class DynamicObject extends Phaser.GameObjects.Sprite {
  protected animation: string;
  private s?: MapDisplay;

  constructor(scene: MapDisplay | GameHUD | BootyScene, mainLayer: DynamicTilemapLayer | null, object: ObjectCreationData, defaults?: {}, playDefaultAnimation?: boolean) {
    if (defaults) {
      applyDefaults(object, defaults);
    }

    super(scene, object.x, object.y, object.texture, object.image ? object.image + object.frame : undefined);
    this.depth = object.z;

    this.s = scene as MapDisplay;

    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);

    if (scene.game.animationManager.request(object.texture, object.image, object.animation)) {
      this.animation = object.texture + object.image;
      if (playDefaultAnimation) {
        this.playAnimation();
      }
    }
  }

  preUpdate(time: number, delta: number) {
    if (this.s && this.s.transitioning) return;
    super.preUpdate(time, delta);
  }

  playAnimation(animation?: string) {
    if (animation) {
      this.animation = animation;
    }
    this.play(this.animation);
  }
}
