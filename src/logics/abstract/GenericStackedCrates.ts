import GenericCrate from "./GenericCrate";
import MapDisplay from "../../scenes/MapDisplay";
import {ObjectData} from "../../model/ObjectData";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

class ChildCrate extends GenericCrate {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectData, defaults: any) {
    super(scene, mainLayer, object, defaults);

    this.depth = object.z!;
  }
}

export default class GenericStackedCrates extends GenericCrate {
  childCrates: ChildCrate[] = [];

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectData, defaults: any) {
    super(scene, mainLayer, object, defaults);

    for (let i = 1; i < this.rawContents.length; i++) {
      const childCrate = new ChildCrate(scene, mainLayer, {
        x: object.x,
        y: object.y! - 42,
        z: object.z! + i,
        frame: object.frame,
        image: object.image,
        texture: object.texture
      }, {});
      this.childCrates.push(childCrate);
    }
  }
}