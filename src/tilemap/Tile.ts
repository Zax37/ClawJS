import LayerData = Phaser.Tilemaps.LayerData;
import LayerDataProperties from "../model/LayerDataProperties";
import {TileAttributes, TileType} from "../model/TileAttributes";
import CaptainClaw from "../logics/CaptainClaw";

const ladders: { top: number, left: number, right: number, bottom: number }[] = [];

export default class Tile extends Phaser.Tilemaps.Tile {
  customCollision?: boolean;
  physics: { rect?: { top: number, left: number, right: number, bottom: number }, invert?: boolean };

  constructor(layerData: LayerData, tileIndex: integer, x: integer, y: integer, width: integer, height: integer, tileAttributes: TileAttributes) {
    super(layerData, tileIndex, x, y, width, height);

    if (tileAttributes) {
      if (tileAttributes.inside || tileAttributes.outside) {
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

        if (tileAttributes.inside === TileType.solid) {
          this.physics.rect!.left -= 1;
          this.physics.rect!.right += 1;
          this.customCollision = true;
          this.setCollisionCallback(function (claw: CaptainClaw, tile: Tile) {
            tile.setCollision(true, true, true, true, false);
            tile.collisionCallback = undefined;
          }, this);
        }

        if (tileAttributes.inside === TileType.ground) {
          this.physics.rect!.left -= 5;
          this.physics.rect!.right += 5;
          this.customCollision = true;
          this.setCollisionCallback(function (claw: CaptainClaw, tile: Tile) {
            tile.setCollision(false, false, true, false, false);
            tile.collisionCallback = undefined;
          }, this);
        }
      }

      if (tileAttributes.atrib === TileType.ground) {
        this.customCollision = true;
        this.setCollisionCallback(function (claw: CaptainClaw, tile: Tile) {
          tile.setCollision(false, false, true, false, false);
          tile.collisionCallback = undefined;
        }, this);
      }

      if (tileAttributes.atrib === TileType.climb || tileAttributes.inside === TileType.climb) {
        let found = false;
        let ladderTop = this.pixelY + (tileAttributes.y1 || 0);
        const ladderLeft = this.pixelX + (tileAttributes.x1 || 0);
        const ladderRightRelative = tileAttributes.x2 ? tileAttributes.x2 + 1 : this.width;
        const ladderBottomRelative = tileAttributes.y2 ? tileAttributes.y2 + 1 : this.height;
        const ladderRight = this.pixelX + ladderRightRelative;
        const ladderBottom = this.pixelY + ladderBottomRelative;

        for (const ladder of ladders) {
          if (ladder.bottom === ladderTop && ladder.left === ladderLeft && ladder.right === ladderRight) {
            found = true;
            ladder.bottom = this.pixelY + ladderBottomRelative;
            ladderTop = ladder.top;
            break;
          }
        }

        if (!found) {
          ladders.push({
            top: ladderTop,
            left: ladderLeft,
            right: ladderRight,
            bottom: ladderBottom
          });
        }

        if (this.physics.rect) {
          this.physics.rect!.left -= 7;
          this.physics.rect!.right += 7;
        }

        this.setCollisionCallback(function (claw: CaptainClaw, tile: Tile) {
          if (claw instanceof CaptainClaw) {
            claw.touchingLadder = true;

            const climbingTop = tile.pixelY + (tileAttributes.y1 || 0) + 1;

            if (claw.body.top >= climbingTop) {
              if (claw.inputs.UP && !claw.climbing && claw.x > ladderLeft && claw.x < ladderRight && claw.body.top < ladderBottom) {
                claw.startClimbing(tile.getCenterX());
                claw.climbingTop = ladderTop;
              }
            } else if (!found) { // this is a ladder top
              if (claw.inputs.DOWN && !claw.inputs.UP && claw.x > ladderLeft && claw.x < ladderRight
                && (claw.anims.currentAnim.key === 'ClawWalk' || claw.anims.currentAnim.key === 'ClawWalkCatnip' || claw.anims.currentAnim.key === 'ClawStand')) {
                claw.startClimbing(tile.getCenterX(), true);
                claw.climbingTop = ladderTop;
              }

              const dy = claw.body.deltaY();
              if (dy >= 0 && claw.body.bottom <= climbingTop + dy + 4) {
                tile.setCollision(false, false, true, false);
              } else {
                tile.setCollision(false, false, false, false);
              }
            }
          }
        }, this);
      }
    }

    const properties = layerData.properties as LayerDataProperties;

    if (tileIndex === properties.fillTileIndex) {
      this.tint = properties.fillColor;
    }
  }
}