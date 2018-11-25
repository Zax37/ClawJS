import Elevator from "./Elevator";
import MapDisplay from "../scenes/MapDisplay";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class StartElevator extends Elevator {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object);
    this.moving = false;
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
  }

  postUpdate() {
    if (this.objectStandingOnIt) {
      this.moving = true;
    }
    super.postUpdate();
  }
}