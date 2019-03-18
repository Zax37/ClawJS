import { ObjectCreationData } from '../../model/ObjectData';
import { DynamicObject } from '../../object/DynamicObject';
import { MapDisplay } from '../../scenes/MapDisplay';

export class CursePowerup extends DynamicObject {
  constructor(scene: MapDisplay, mainLayer: Phaser.Tilemaps.DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    this.destroy();
  }
}
