import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../scenes/MapDisplay";
import PhysicsObject from "./abstract/PhysicsObject";
import {PowerupType} from "../model/PowerupType";

const DEFAULT_JUMP_HEIGHT = 505;
const RUNNING_LEAP_JUMP_HEIGHT = DEFAULT_JUMP_HEIGHT * 1.15;
const CATNIP_JUMP_HEIGHT = RUNNING_LEAP_JUMP_HEIGHT;

const JUMP_TIME_BASE = 265;
const DEFAULT_JUMP_TIME = JUMP_TIME_BASE * 1.5;
const RUNNING_LEAP_JUMP_TIME = JUMP_TIME_BASE * 1.55;
const CATNIP_JUMP_TIME = JUMP_TIME_BASE * 1.8;

const DEFAULT_CLIMBING_SPEED = 200;

const DEFAULT_MOVING_SPEED = 240;
const RUNNING_LEAP_MOVING_SPEED = DEFAULT_MOVING_SPEED * 1.15;
const CATNIP_MOVING_SPEED = DEFAULT_MOVING_SPEED * 1.2;
const TWIN_TURBO_MOVING_SPEED = DEFAULT_MOVING_SPEED * 2;

const MAX_X_VELOCITY = 450;
const MAX_Y_VELOCITY = 900;

const RUNNING_LEAP_DELAY = 1700;

export const MAX_HEALTH = 100;

//const CLAW_MOVE_RECT = new Rect(-16, -52, 16, 60);
//const CLAW_MOVE_RECT_CROUCHING = new Rect(-16, 10, 16, 60);

export default class CaptainClaw extends PhysicsObject {
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

  jumpStartTime: number;
  runningLeapDelay: number;
  isOnGround = true;

  powerup?: PowerupType;
  powerupTime: number;

  spawnX: number;
  spawnY: number;

  health = MAX_HEALTH;
  score = 0;
  attempt = 0;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object);
    this.anims.play('ClawStand');
    this.depth = 4000;

    scene.claw = this;
    this.spawnX = object.x;
    this.spawnY = object.y;

    this.setCrouching(false);
    this.setMaxVelocity(MAX_X_VELOCITY, MAX_Y_VELOCITY);

    this.on('animationcomplete', this.animComplete, this);
    this.runningLeapDelay = RUNNING_LEAP_DELAY;
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.powerup) {
      this.powerupTime -= delta;
      if (this.powerupTime <= 0) {
        this.powerup = undefined;
        this.powerupTime = 0;
      }
    }

    if (this.body.blocked.up) {
      this.setVelocityY(20);
      this.anims.play('ClawFall');
      this.jumpStartTime = -JUMP_TIME_BASE;
    }

    if (this.climbing) {
      this.processClimbing(time);
    } else {
      if (this.body.blocked.down && this.body.velocity.y === 0) {
        if (!this.isOnGround || this.anims.currentAnim.key === 'ClawFall') {
          this.anims.play('ClawStand');
          this.isOnGround = true;
        }
      }

      if (this.body.blocked.down && this.inputs.DOWN) {
        this.setCrouching(true);
        this.wasDownPressed = true;
      } else {
        if (this.wasDownPressed) {
          this.setCrouching(false);
          this.wasDownPressed = false;

          if (this.body.velocity.y === 0) {
            this.anims.play('ClawStand');
          }
        }

        this.processWalking(delta);

        if (this.inputs.JUMP && !this.wasJumpPressed && this.isOnGround) {
          this.jump(time);
        }
      }

      if (!this.inputs.JUMP) {
        if (this.body.velocity.y < 0) {
          this.setVelocityY(0);
          this.jumpStartTime = -JUMP_TIME_BASE;
        } else if (this.body.blocked.down) {
          this.wasJumpPressed = false;
        }
      } else if (time - this.jumpStartTime < this.getJumpTime()) {
        const timeSinceJump = time - this.jumpStartTime;
        if (timeSinceJump > JUMP_TIME_BASE) {
          this.setVelocityY(-this.getJumpHeight() * (this.getJumpTime() - time + this.jumpStartTime) / JUMP_TIME_BASE);
        } else {
          this.setVelocityY(-this.getJumpHeight());
        }
      }

      if (this.body.velocity.y > 0 && this.isOnGround) {
        this.anims.play('ClawFall');
        this.isOnGround = false;
        this.wasJumpPressed = true;
      }
    }
  }

  jump(time: number) {
    this.setVelocityY(-this.getJumpHeight());
    this.anims.play('ClawJump');
    this.wasJumpPressed = true;
    this.isOnGround = false;
    this.jumpStartTime = time;
  }

  startClimbing(down?: boolean) {
    this.climbing = true;
    this.isOnGround = false;
    this.body.allowGravity = false;
    this.setVelocity(0, 0);
    if (down) {
      this.y += 10;
      this.setCrouching(false);
      this.anims.playReverse('ClawClimb');
      this.anims.pause();
      this.setFrame('CLAW_389');
      this.climbingDown = true;
    } else {
      this.anims.play('ClawClimb');
      this.anims.pause();
    }
  }

  private animComplete(animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame)
  {
    if(animation.key === 'ClawJump')
    {
      this.anims.play('ClawFall');
    }
  }

  private getJumpHeight(): number {
    if (this.powerup === PowerupType.CATNIP) {
      return CATNIP_JUMP_HEIGHT;
    }
    return this.runningLeapDelay <= 0 ? RUNNING_LEAP_JUMP_HEIGHT : DEFAULT_JUMP_HEIGHT;
  }

  private getJumpTime() {
    if (this.powerup === PowerupType.CATNIP) {
      return CATNIP_JUMP_TIME;
    }
    return this.runningLeapDelay <= 0 ? RUNNING_LEAP_JUMP_TIME : DEFAULT_JUMP_TIME;
  }

  private getMovingSpeed(): number {
    if (this.powerup === PowerupType.CATNIP) {
      return CATNIP_MOVING_SPEED;
    }
    return this.runningLeapDelay <= 0 ? RUNNING_LEAP_MOVING_SPEED : DEFAULT_MOVING_SPEED;
  }

  private processClimbing(time: number) {
    if (this.touchingLadder) {
      let velY = 0;

      if (this.inputs.UP) {
        velY = -DEFAULT_CLIMBING_SPEED;
        if (this.climbingDown) {
          this.climbingDown = false;
          this.anims.play('ClawClimb', true, this.anims.currentFrame.index);
          this.anims.pause();
        }
      } else {
        if (!this.inputs.JUMP) {
          this.wasJumpPressed = false;
        }

        if (this.inputs.DOWN) {
          if (this.body.blocked.down) {
            this.climbing = false;
            this.body.allowGravity = true;
            this.anims.play('ClawStand');
            return;
          }

          velY = DEFAULT_CLIMBING_SPEED;
          if (!this.climbingDown) {
            this.climbingDown = true;
            this.anims.playReverse('ClawClimb', true, this.anims.currentFrame.index);
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
          this.setVelocityY(MAX_Y_VELOCITY);
          this.anims.play('ClawStand');
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
        this.jump(time);
      } else {
        this.setVelocityY(velY);
      }
    } else {
      if (!this.touchingLadder) {
        this.climbing = false;
        this.body.allowGravity = true;
        this.anims.play('ClawFall');
        this.setVelocityY(MAX_Y_VELOCITY / 4);
      }
    }

    this.touchingLadder = false;
  }

  private processWalking(delta: number) {
    let vel = 0;
    if (this.inputs.LEFT && !this.wasRightPressed) {
      vel = -this.getMovingSpeed();
      this.flipX = true;
      this.wasLeftPressed = true;
    } else if (this.inputs.RIGHT && !this.wasLeftPressed) {
      vel = this.getMovingSpeed();
      this.flipX = false;
      this.wasRightPressed = true;
    }

    this.setVelocityX(vel);

    if (vel) {
      if (this.isOnGround) {
        this.runningLeapDelay -= delta;
        if (this.anims.currentAnim.key === 'ClawStand') {
          this.anims.play('ClawWalk');
        }
        if (this.powerup === PowerupType.CATNIP && this.anims.currentAnim.key === 'ClawWalk') {
          this.anims.play('ClawWalkCatnip');
        }
      }
    } else {
      this.runningLeapDelay = RUNNING_LEAP_DELAY;

      if (!this.inputs.LEFT) {
        this.wasLeftPressed = false;
      }
      if (!this.inputs.RIGHT) {
        this.wasRightPressed = false;
      }

      if ((this.anims.currentAnim.key === 'ClawWalk' || this.anims.currentAnim.key === 'ClawWalkCatnip') && !this.inputs.LEFT && !this.inputs.RIGHT) {
        this.anims.play('ClawStand');
      }
    }
  }

  private setCrouching(on: boolean) {
    if (on) {
      this.setVelocityX(0);
      this.setSize(32, 50);
      this.setOffset(32, 54);
      this.setFrame('CLAW_67');

      if (this.inputs.LEFT && !this.flipX) this.flipX = true;
      else if (this.inputs.RIGHT) this.flipX = false;
    } else {
      this.setSize(32, 112);
      this.setOffset(32, -8);
    }
  }

  addPowerup(powerup: PowerupType, time: number) {
    if (this.powerup != powerup) {
      this.powerup = powerup;
      this.powerupTime = time;
    } else {
      this.powerupTime += time;
    }
  }

  backToSpawn() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.attempt++;
  }

  setSpawn(x: number, y: number) {
    this.spawnX = x;
    this.spawnY = y;
  }
}
