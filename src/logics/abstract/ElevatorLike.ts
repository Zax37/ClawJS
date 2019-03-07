import { DEFAULTS } from '../../model/Defaults';
import { ObjectCreationData } from '../../model/ObjectData';
import DynamicObject from '../../object/DynamicObject';
import MapDisplay from '../../scenes/MapDisplay';
import CaptainClaw from '../main/CaptainClaw';
import PhysicsObject from './PhysicsObject';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class ElevatorLike extends DynamicObject {
  body: Phaser.Physics.Arcade.Body;
  objectStandingOnIt?: PhysicsObject;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData, defaults?: {}) {
    super(scene, mainLayer, object, defaults ? Object.assign(DEFAULTS.ELEVATORLIKE, defaults) : DEFAULTS.ELEVATORLIKE);

    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);
    scene.physics.add.existing(this, false);

    scene.physics.add.collider(scene.claw, this, (standing: CaptainClaw, elevator: ElevatorLike) => {
      if (standing.body.bottom - 8 <= elevator.body.top && !standing.jumping && (standing.slippedDelay <= 0 || standing.slippedFromTile)) {
        elevator.objectStandingOnIt = standing;
        standing.body.blocked.none = false;
        standing.body.blocked.down = true;
        standing.isOnGround = true;
      }
    }, undefined);

    this.body.allowGravity = false;
    this.body.immovable = true;

    this.body.checkCollision = {
      none: false,
      up: true,
      left: false,
      right: false,
      down: false,
    };
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
  }

  postUpdate() {
    this.objectStandingOnIt = undefined;
  }
}
