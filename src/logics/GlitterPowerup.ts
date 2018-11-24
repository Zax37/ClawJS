import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../scenes/MapDisplay";
import TreasurePowerup from "./TreasurePowerup";

export default class GlitterPowerup extends TreasurePowerup {
  private glitter: Phaser.GameObjects.Sprite;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object);

    this.glitter = scene.add.sprite(object.x, object.y, "GAME");
    if (scene.game.animationManager.request("GAME", "GAME_GLITTER")) {
      this.glitter.play("GAME_GLITTER");
    }
  }

  protected collect() {
    this.glitter.destroy();
    super.collect();
  }
}