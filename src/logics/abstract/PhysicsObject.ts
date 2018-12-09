import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../../scenes/MapDisplay";
import Tile from "../../tilemap/Tile";

export default class PhysicsObject extends Phaser.Physics.Arcade.Sprite {
  body: Phaser.Physics.Arcade.Body;
  isOnElevator: boolean = false;
  isBlockedTop: boolean = false;

  constructor(protected scene: MapDisplay, protected mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, object.x, object.y, object.texture, object.image ? object.image + object.frame : undefined);

    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);
    scene.physics.add.existing(this, false);
    scene.physics.add.collider(this, mainLayer);

    this.mainLayer = mainLayer;
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
  }

  alignToGround() {
    let tiles = this.mainLayer.getTilesWithin(Math.floor(this.body.left / this.mainLayer.tilemap.tileWidth),
      Math.floor(this.body.top / this.mainLayer.tilemap.tileHeight), 2, 5);

    for (const i in tiles) {
      const tile: Tile = tiles[i];
      const top = tile.physics.rect ? tile.pixelY + tile.physics.rect.top : tile.pixelY;
      if (top >= this.body.y) {
        const left = tile.physics.rect ? tile.pixelX + tile.physics.rect.left : tile.pixelX;
        const right = tile.physics.rect ? tile.pixelX + tile.physics.rect.right + 1 : tile.pixelX + tile.width;

        if ((tile.collides || tile.customCollision) && !(right < this.body.left || left > this.body.right)) {
          this.y += (top - this.y - this.body.halfHeight);
          break;
        }
      }
    }
  }
}