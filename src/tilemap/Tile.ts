import LayerData = Phaser.Tilemaps.LayerData;
import LayerDataProperties from "./LayerDataProperties";
import TileAttributes from "./TileAttributes";
import CaptainClaw from "../logics/CaptainClaw";

export default class Tile extends Phaser.Tilemaps.Tile {
  constructor(layerData: LayerData, tileIndex: integer, x: integer, y: integer, width: integer, height: integer, tileAttributes: TileAttributes) {
    super(layerData, tileIndex, x, y, width, height, width, height);

    if (tileAttributes && (tileAttributes.atrib === 3 || tileAttributes.inside === 3)) {
      this.setCollisionCallback(function (paramA: CaptainClaw, paramB: Tile) {
        if (paramA instanceof CaptainClaw && paramA.inputs.UP) {
          paramA.setX(paramB.getCenterX());
          paramA.setVelocityY(-200);
        }
      }, this);
    }

    if (tileAttributes && (tileAttributes.inside === 1 || tileAttributes.inside === 2)) {
      //super(layerData, tileIndex, x, y, tileAttributes.x2 - tileAttributes.x1, tileAttributes.y2 - tileAttributes.y1, width, height);



      if (tileAttributes.inside === 2) {
        /*this.collideLeft = false;
        this.collideRight = false;
        this.collideDown = false;
        this.faceLeft = false;
        this.faceRight = false;
        this.faceBottom = false;*/
      }
    } else {

    }

    const properties = layerData.properties as LayerDataProperties;

    if (tileIndex === properties.fillTileIndex) {
      this.tint = properties.fillColor;
    }
  }
}