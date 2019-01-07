import MapDisplay from '../scenes/MapDisplay';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import { ObjectCreationData } from '../model/ObjectData';

export default class SoundTrigger extends Phaser.GameObjects.Zone {
  body: Phaser.Physics.Arcade.Body;

  activated = false;
  attempt = 0;
  clawDialog: boolean;
  times: number;
  sound: string;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, object.x, object.y);

    if (object.animation) {
      this.sound = object.animation;
    } else {
      this.destroy();
      return;
    }

    scene.physics.add.existing(this);
    this.body.allowGravity = false;

    this.times = object.smarts ? object.smarts : -1;
    this.clawDialog = object.logic!.startsWith('ClawDialog');

    const logic = this.clawDialog ? object.logic!.substr(10) : object.logic;

    switch (logic) {
      case 'TinySoundTrigger':
        this.body.setSize(32, 32);
        break;
      case 'SmallSoundTrigger':
        this.body.setSize(64, 64);
        break;
      default:
      case 'SoundTrigger':
        this.body.setSize(128, 128);
        break;
      case 'BigSoundTrigger':
        this.body.setSize(256, 256);
        break;
      case 'HugeSoundTrigger':
        this.body.setSize(512, 512);
        break;
      case 'TallSoundTrigger':
        this.body.setSize(64, 200);
        break;
      case 'WideSoundTrigger':
        this.body.setSize(200, 64);
        break;
    }

    scene.physics.add.overlap(scene.claw, this, () => {
      if (!this.activated) {
        if (this.times > 0) {
          this.times -= 1;
        }

        if (this.clawDialog) {
          this.attempt = this.scene.claw.attempt;
        }
        this.scene.sound.playAudioSprite(this.clawDialog ? 'voc' : 'sounds', this.sound);
        this.activated = true;

        if (this.times === 0) {
          this.destroy();
        } else {
          scene.sys.updateList.add(this);
        }
      }
    });
  }

  preUpdate(time: number, delta: number) {
    const claw = this.scene.claw;

    if (this.clawDialog) {
      if (this.attempt !== claw.attempt) {
        this.activated = false;
        this.attempt = claw.attempt;
        this.scene.sys.updateList.remove(this);
      }
    }
    else if (claw.body.right < this.body.left || claw.body.left > this.body.right
      || claw.body.bottom < this.body.top || claw.body.top > this.body.bottom) {
      this.activated = false;
      this.scene.sys.updateList.remove(this);
    }
  }
}