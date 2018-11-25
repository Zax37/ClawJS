import MapDisplay from "../../scenes/MapDisplay";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import PhysicsObject from "./PhysicsObject";

export default class ElevatorLike extends Phaser.Physics.Arcade.Sprite {
  body: Phaser.Physics.Arcade.Body;
  objectStandingOnIt?: PhysicsObject;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, object.x, object.y, object.texture, object.image ? object.image + object.frame : undefined);

    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);
    scene.physics.add.existing(this, false);

    scene.physics.add.collider(scene.claw, this, function (standing: PhysicsObject, elevator: ElevatorLike) {
      elevator.objectStandingOnIt = standing;
      standing.body.blocked.none = false;
      standing.body.blocked.down = true;
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