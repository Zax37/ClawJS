import MapDisplay from "../scenes/MapDisplay";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class Checkpoint extends Phaser.Physics.Arcade.Sprite {
  body: Phaser.Physics.Arcade.Body;
  private image: string;
  private logic: string;
  private checked = false;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, object.x, object.y, object.texture, object.image + object.frame);

    scene.physics.add.existing(this);
    scene.physics.add.overlap(this, scene.claw, this.check.bind(this));

    this.body.immovable = true;
    this.body.allowGravity = false;
    this.body.setSize(this.body.width + 12, this.body.height + 12, true);

    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);

    this.logic = object.logic;
    this.on('animationcomplete', this.animComplete, this);
  }

  protected check() {
    if (!this.checked) {
      this.scene.claw.setSpawn(this.x, this.y - 32);
      this.play(this.logic === 'Checkpoint' ? 'CheckpointRise' : 'SuperCheckpointRise');
      this.checked = true;
    }
  }

  private animComplete() {
    this.play(this.logic === 'Checkpoint' ? 'CheckpointWave' : 'SuperCheckpointWave');
  }
}