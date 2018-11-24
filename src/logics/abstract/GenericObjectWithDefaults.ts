import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../../scenes/MapDisplay";

export default class GenericObjectWithDefaults extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any, defaults: any) {
    for(const key in defaults) {
      if (defaults.hasOwnProperty(key) && !object.hasOwnProperty(key)) {
        object[key] = defaults[key];
      }
    }
    super(scene, object.x, object.y, object.texture, object.image ? object.image + object.frame : undefined);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
  }
}