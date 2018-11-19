import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../scenes/MapDisplay";
import Tile from "../tilemap/Tile";

const DEFAULT_JUMP_HEIGHT = 500;
const RUNNING_LEAP_JUMP_HEIGHT = 525;

const DEFAULT_MOVING_SPEED = 180;
const RUNNING_LEAP_MOVING_SPEED = 200;

export default class CaptainClaw extends Phaser.Physics.Arcade.Sprite {
  inputs = {
    JUMP: false,
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
  };

  body: Phaser.Physics.Arcade.Body;

  climbing = false;
  climbingDown = false;
  climbingTop: number;
  touchingLadder = false;
  wasJumpPressed = false;
  wasRightPressed = false;
  wasLeftPressed = false;
  wasDownPressed = false;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, object.x, object.y, object.imageSet);
    this.depth = 4000;
    this.anims.play('stand');

    scene.claw = this;
    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);
    scene.physics.add.existing(this, false);
    scene.physics.add.collider(this, mainLayer);

    this.setCrouching(false);
    this.setMaxVelocity(200, 550);

    this.on('animationcomplete', this.animComplete, this);
  }

  jump() {
    this.setVelocityY(-DEFAULT_JUMP_HEIGHT);
    this.anims.play('jump');
    this.wasJumpPressed = true;
  }

  startClimbing(down?: boolean) {
    this.climbing = true;
    this.body.allowGravity = false;
    this.setVelocity(0, 0);
    if (down) {
      this.y += 20;
      this.setCrouching(false);
      this.anims.playReverse('climb');
      this.anims.pause();
      this.setFrame('CLAW_389');
      this.climbingDown = true;
    } else {
      this.anims.play('climb');
      this.anims.pause();
    }
  }

  setCrouching(on: boolean) {
    if (on) {
      this.setVelocityX(0);
      this.setSize(32, 50);
      this.setOffset(32, 63);
      this.setFrame('CLAW_67');
    } else {
      this.setSize(32, 112);
      this.setOffset(32, 1);
    }
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.climbing) {
      if (this.touchingLadder) {
        let velY = 0;

        if (this.inputs.UP) {
          velY = -150;
          if (this.climbingDown) {
            this.climbingDown = false;
            this.anims.play('climb', true, this.anims.currentFrame.index);
            this.anims.pause();
          }
        } else {
          if (!this.inputs.JUMP) {
            this.wasJumpPressed = false;
          }

          if (this.inputs.DOWN) {
            velY = 150;
            if (!this.climbingDown) {
              this.climbingDown = true;
              this.anims.playReverse('climb', true, this.anims.currentFrame.index);
            }
          }

          this.anims.pause();
        }

        if (this.body.top < this.climbingTop) {
          const frame = Math.min(383 + Math.floor((this.climbingTop - this.body.top) / 15.5), 389);
          this.setFrame('CLAW_' + frame);

          if (this.body.bottom <= this.climbingTop && !this.climbingDown) {
            this.climbing = false;
            this.body.allowGravity = true;
            this.setVelocityY(500);
            this.anims.play('stand');
            return;
          }
        } else if (velY) {
          this.anims.resume();
        } else {
          this.anims.pause();
        }

        if (this.inputs.JUMP && !this.wasJumpPressed) {
          this.climbing = false;
          this.body.allowGravity = true;
          this.jump();
        } else {
          this.setVelocityY(velY);
        }
      } else {
        if (!this.touchingLadder) {
          this.climbing = false;
          this.body.allowGravity = true;
          this.anims.play('fall');
          this.setVelocityY(500);
        }
      }

      this.touchingLadder = false;
    } else {
      if (this.body.blocked.down && (this.anims.currentAnim.key === 'jump' || this.anims.currentAnim.key === 'fall')) {
        this.anims.play('stand');
      }

      if (this.body.blocked.down && this.inputs.DOWN) {
        this.setCrouching(true);
        this.wasDownPressed = true;
      } else {
        if (this.wasDownPressed) {
          this.setCrouching(false);
          this.anims.play('stand');
          this.wasDownPressed = false;
        }

        if (this.inputs.LEFT && !this.wasRightPressed && !this.body.blocked.left) {
          this.setVelocityX(-DEFAULT_MOVING_SPEED);
          this.flipX = true;

          if (this.anims.currentAnim.key === 'stand') {
            this.anims.play('walk');
          }

          this.wasLeftPressed = true;
        } else if (this.inputs.RIGHT && !this.wasLeftPressed && !this.body.blocked.right) {
          this.setVelocityX(DEFAULT_MOVING_SPEED);
          this.flipX = false;

          if (this.anims.currentAnim.key === 'stand') {
            this.anims.play('walk');
          }

          this.wasRightPressed = true;
        } else {
          this.setVelocityX(0);
          if (!this.inputs.LEFT) {
            this.wasLeftPressed = false;
          }
          if (!this.inputs.RIGHT) {
            this.wasRightPressed = false;
          }

          if (this.anims.currentAnim.key === 'walk' && !this.inputs.LEFT && !this.inputs.RIGHT) {
            this.anims.play('stand');
          }
        }

        if (this.inputs.JUMP && !this.wasJumpPressed && this.body.blocked.down && (this.anims.currentAnim.key === 'walk' || this.anims.currentAnim.key === 'stand')) {
          this.jump();
        }
      }

      if (!this.inputs.JUMP) {
        if (this.body.velocity.y < 0) {
          this.setVelocityY(1);
        } else if (this.body.blocked.down) {
          this.wasJumpPressed = false;
        }
      }

      if (this.body.velocity.y > 0 && (this.anims.currentAnim.key === 'walk' || this.anims.currentAnim.key === 'stand')) {
        this.anims.play('fall');
      }
    }
  }

  animComplete(animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame)
  {
    if(animation.key === 'jump')
    {
      this.anims.play('fall');
    }
  }
}
