import ElevatorLike from "./abstract/ElevatorLike";
import MapDisplay from "../scenes/MapDisplay";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class SteppingStone extends ElevatorLike {
  private animation: string;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object);
    let levelData = scene.getLevelData();
    this.body.setSize(levelData.SteppingStoneDefRect.width, levelData.SteppingStoneDefRect.height);
    this.body.setOffset(this.displayOriginX + levelData.SteppingStoneDefRect.left, this.displayOriginY + levelData.SteppingStoneDefRect.top);

    if (scene.game.animationManager.request(object.texture, object.image)) {
      this.animation = object.texture + object.image;
    }
  }
}