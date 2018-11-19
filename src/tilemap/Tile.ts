import LayerData = Phaser.Tilemaps.LayerData;
import LayerDataProperties from "./LayerDataProperties";
import {TileAttributes, TileType} from "./TileAttributes";
import CaptainClaw from "../logics/CaptainClaw";

const ladders: { top: number, left: number, right: number, bottom: number }[] = [];

export default class Tile extends Phaser.Tilemaps.Tile {
  physics: { rect?: { top: number, left: number, right: number, bottom: number }, invert?: boolean };

  constructor(layerData: LayerData, tileIndex: integer, x: integer, y: integer, width: integer, height: integer, tileAttributes: TileAttributes) {
    super(layerData, tileIndex, x, y, width, height);

    if (tileAttributes && (tileAttributes.inside || tileAttributes.outside)) {
      if (tileAttributes.x2) {
        this.physics.rect = {
          left: tileAttributes.x1,
          top: tileAttributes.y1,
          right: tileAttributes.x2 + 1,
          bottom: tileAttributes.y2 + 1
        };

        if (tileAttributes.outside) {
          this.physics.invert = true;
        }
      }

      if (tileAttributes.inside === TileType.ground) {
        this.setCollision(false, false, true, false);
      }
    }

    if (tileAttributes && (tileAttributes.atrib === TileType.climb || tileAttributes.inside === TileType.climb)) {
      let found = false;
      const width = tileAttributes.x2 ? tileAttributes.x2 + 1 : this.width;
      const height = tileAttributes.y2 ? tileAttributes.y2 + 1 : this.height;
      for (const ladder of ladders) {
        if (ladder.bottom === this.pixelY && ladder.left === this.pixelX && ladder.right === this.pixelX + width) {
          found = true;
          ladder.bottom = this.pixelY + height;
          break;
        }
      }
      if (!found) {
        ladders.push({ top: this.pixelY, left: this.pixelX, right: this.pixelX + width, bottom: this.pixelY + height });
      }

      this.setCollisionCallback(function (claw: CaptainClaw, tile: Tile) {
        if (claw instanceof CaptainClaw) {
          claw.touchingLadder = true;

          const climbingTop = tile.pixelY + (tileAttributes.y1 || 0);

          if (claw.body.top >= climbingTop) {
            if (claw.inputs.UP && !claw.climbing) {
              claw.setX(tile.getCenterX());
              claw.startClimbing();
              claw.climbingTop = climbingTop;
            } else if (claw.climbing && climbingTop < claw.climbingTop) {
              claw.climbingTop = climbingTop;
            }
          } else {
            if (claw.inputs.DOWN && !claw.inputs.UP && (claw.anims.currentAnim.key === 'walk' || claw.anims.currentAnim.key === 'stand')) {
              claw.setX(tile.getCenterX());
              claw.startClimbing(true);
            }

            const dy = claw.body.deltaY();
            if (dy >= 0 && claw.body.bottom <= climbingTop + claw.body.deltaY() && !found) {
              tile.setCollision(false, false, true, false);
            } else {
              tile.setCollision(false, false, false, false);
            }
          }
        }
      }, this);
    }

    const properties = layerData.properties as LayerDataProperties;

    if (tileIndex === properties.fillTileIndex) {
      this.tint = properties.fillColor;
    }
  }
}