import { ObjectCreationData } from '../model/ObjectData';
import DynamicObject from '../object/DynamicObject';
import MapDisplay from '../scenes/MapDisplay';
import CaptainClaw from './CaptainClaw';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class Checkpoint extends DynamicObject {
  body: Phaser.Physics.Arcade.Body;
  private logic: string;
  private checked = false;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object, { z: 3998 });

    scene.physics.add.existing(this);
    scene.physics.add.overlap(this, scene.claw, this.check.bind(this, scene.claw));

    this.body.immovable = true;
    this.body.allowGravity = false;
    this.body.setSize(this.body.width + 12, this.body.height + 12, true);

    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);

    this.logic = object.logic!;
    this.on('animationcomplete', this.animComplete, this);
  }

  protected check(claw: CaptainClaw) {
    if (!this.checked) {
      claw.setSpawn(this.x, this.y);
      this.play(this.logic === 'Checkpoint' ? 'CheckpointRise' : 'SuperCheckpointRise');
      this.checked = true;
      this.scene.game.soundsManager.playSound('GAME_FLAGRISE');
    }
  }

  private animComplete() {
    this.play(this.logic === 'Checkpoint' ? 'CheckpointWave' : 'SuperCheckpointWave');
    this.scene.game.soundsManager.playSound('GAME_FLAGWAVE');
  }
}
