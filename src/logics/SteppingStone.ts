import ElevatorLike from "./abstract/ElevatorLike";
import MapDisplay from "../scenes/MapDisplay";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class SteppingStone extends ElevatorLike {
  private image: string;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object);
    let levelData = scene.getLevelData();
    this.body.setSize(levelData.SteppingStoneDefRect.width, levelData.SteppingStoneDefRect.height);
    this.body.setOffset(levelData.SteppingStoneDefRect.offsetX, levelData.SteppingStoneDefRect.offsetY);

    if (scene.game.animationManager.request(object.texture, object.image)) {
      this.image = object.image;
    }
  }
}