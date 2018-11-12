import LayerData = Phaser.Tilemaps.LayerData;
import LayerDataProperties from "./LayerDataProperties";

export default class Tile extends Phaser.Tilemaps.Tile {
  constructor(layerData: LayerData, tileIndex: integer, x: integer, y: integer, width: integer, height: integer) {
    super(layerData, tileIndex, x, y, width, height, width, height);

    const properties = layerData.properties as LayerDataProperties;

    if (tileIndex === properties.fillTileIndex) {
      this.tint = properties.fillColor;
    }
  }
}