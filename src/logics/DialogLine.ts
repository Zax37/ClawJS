import DynamicObject from '../object/DynamicObject';
import MapDisplay from '../scenes/MapDisplay';
import { ObjectCreationData } from '../model/ObjectData';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class DialogLine extends DynamicObject {


  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object, {});

  }
}