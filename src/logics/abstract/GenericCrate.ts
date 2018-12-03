import GenericObjectWithDefaults from "./GenericObjectWithDefaults";
import MapDisplay from "../../scenes/MapDisplay";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import { ObjectData } from "../../model/ObjectData";

export default class GenericCrate extends GenericObjectWithDefaults {
  scene: MapDisplay;
  private image: string;
  protected rawContents: number[] = [];

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectData, defaults: any) {
    super(scene, mainLayer, object, defaults);
    this.scene = scene;
    this.image = object.image;

    if (scene.game.animationManager.request(object.texture, object.image)) {
      scene.sys.displayList.add(this);
      scene.sys.updateList.add(this);
    }

    if (object.powerup) {
      this.rawContents.push(object.powerup);
    }
    if (object.userRect1) {
      this.rawContents = this.rawContents.concat(object.userRect1);
    }
    if (object.userRect2) {
      this.rawContents = this.rawContents.concat(object.userRect2);
    }

    this.on('animationcomplete', this.animComplete, this);
  }

  protected break() {
    this.play(this.image);
  }

  private animComplete() {
    this.destroy();
  }
}