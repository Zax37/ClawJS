import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../scenes/MapDisplay";
import PhysicsObject from "./abstract/PhysicsObject";
import {PowerupType} from "../model/PowerupType";
import Tile from "../tilemap/Tile";

const DEFAULT_JUMP_HEIGHT = 145;
const RUNNING_LEAP_JUMP_HEIGHT = 171;
const CATNIP_JUMP_HEIGHT = 195;

const DEFAULT_JUMP_TIME = 580;
const RUNNING_LEAP_JUMP_TIME = 610;
const CATNIP_JUMP_TIME = 630;

const DEFAULT_CLIMBING_SPEED = 200;

const DEFAULT_MOVING_SPEED = 243;
const RUNNING_LEAP_MOVING_SPEED = DEFAULT_MOVING_SPEED * 1.25;
const CATNIP_MOVING_SPEED = DEFAULT_MOVING_SPEED * 1.2;
const TWIN_TURBO_MOVING_SPEED = DEFAULT_MOVING_SPEED * 1.5;

const MAX_X_VELOCITY = 450;
const MAX_Y_VELOCITY = 675;

const RUNNING_LEAP_DELAY = 1500;

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
    ATTACK: false,
  };

  body: Phaser.Physics.Arcade.Body;
  scene: MapDisplay;

  attacking = false;
  climbing = false;
  jumping = false;

  climbingDown = false;
  climbingTop: number;
  touchingLadder = false;
  wasJumpPressed = false;
  wasRightPressed = false;
  wasLeftPressed = false;
  isCrouching = false;
  wasAttackPressed = false;

  jumpStartTime: number;
  runningLeapDelay: number;
  isOnGround = true;

  powerup?: PowerupType;
  powerupTime: number = 0;

  spawnX: number;
  spawnY: number;

  health = MAX_HEALTH;
  score = 0;
  attempt = 0;

  fixedX: number;
  jumpedFromY: number;
  fly: boolean = false;

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
    this.alignToGround();
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.fly) {
      this.body.enable = false;
      if (this.inputs.RIGHT) this.x += delta;
      else if (this.inputs.LEFT) this.x -= delta;
      if (this.inputs.DOWN) this.y += delta;
      else if (this.inputs.UP) this.y -= delta;

      return;
    } else {
      this.body.enable = true;
    }

    if (this.powerup !== undefined) {
      this.powerupTime -= delta;
      if (this.powerupTime <= 0) {
        this.powerup = undefined;
        this.powerupTime = 0;
        this.scene.game.musicManager.resumePaused();
      }
    }

    if (this.body.velocity.y === MAX_Y_VELOCITY) {
      this.setFrame('CLAW_401');
    }

    if (this.body.blocked.up) {
      this.setVelocityY(4);
      this.anims.play('ClawFall');
      this.jumping = false;
    }

    if (this.inputs.ATTACK && !this.wasAttackPressed) {
      this.wasAttackPressed = true;
      if (this.isOnGround && (this.anims.currentAnim.key === 'ClawStand' || this.anims.currentAnim.key === 'ClawWalk' || this.anims.currentAnim.key === 'ClawWalkCatnip')) {
        let attack = Math.floor(Math.random() * 4) + 1;
        this.anims.play('ClawStandAttack' + attack);
        this.attacking = true;
      }
    } else if (!this.inputs.ATTACK) {
      this.wasAttackPressed = false;
    }

    if (this.climbing) {
      this.processClimbing(time, delta);
    } else {
      if (this.body.blocked.down) {
        if (!this.isOnGround || this.anims.currentAnim.key === 'ClawJump' || this.anims.currentAnim.key === 'ClawFall') {
          this.anims.play('ClawStand');
          this.isOnGround = true;
        }
      }

      if (this.inputs.DOWN && this.body.blocked.down) {
        this.setCrouching(true);
      } else {
        if (this.isCrouching) {
          this.setCrouching(false);

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
        if (this.jumping) {
          this.setVelocityY(4);
          this.jumping = false;
        } else if (this.body.blocked.down) {
          this.wasJumpPressed = false;
        }
      } else if (this.jumping) {
        const jumpTop = this.jumpedFromY - this.getJumpHeight();
        const jumpHeightLeft = this.y - jumpTop;
        const timeFromJump = time - this.jumpStartTime;
        const timeLeft = this.getJumpTime() - timeFromJump;

        if (jumpHeightLeft > 8 && timeLeft > 25) {
          this.setVelocityY(-25);
          this.y -= Math.min(((jumpHeightLeft + 80) * delta / (timeLeft - 25) + (timeFromJump  * 0.012)), jumpHeightLeft - 1);
        } else {
          if (this.y > jumpTop) {
            this.y = jumpTop + 1;
            this.setVelocityY(15);
          } else {
            this.setVelocityY(30);
          }
          this.jumping = false;
        }
      }

      if (this.body.velocity.y > 0 && this.isOnGround && !this.body.blocked.down) {
        this.y += 6;
        this.body.velocity.y += 30;
        this.anims.play('ClawFall');
        this.isOnGround = false;
        this.isOnElevator = false;
        this.isBlockedTop = false;
        this.wasJumpPressed = true;
      }
    }
  }

  jump(time: number) {
    this.setVelocityY(-30);
    this.anims.play('ClawJump');
    this.wasJumpPressed = true;
    this.isOnGround = false;
    this.isOnElevator = false;
    this.jumpStartTime = time;
    this.jumping = true;
    this.jumpedFromY = this.y;
  }

  startClimbing(climbX: number, down?: boolean) {
    this.x = climbX;
    this.fixedX = climbX;
    this.jumping = false;
    this.climbing = true;
    this.isOnGround = false;
    this.body.allowGravity = false;
    this.setVelocity(0, 0);
    this.body.setAccelerationX(0);
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
    if(animation.key === 'ClawJump') {
      this.jumping = false;
      this.anims.play('ClawFall');
    } else {
      this.attacking = false;
      this.anims.play('ClawStand');
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
    return this.runningLeapDelay <= 0 && this.isOnGround ? RUNNING_LEAP_MOVING_SPEED : DEFAULT_MOVING_SPEED;
  }

  private processClimbing(time: number, delta: number) {
    this.x = this.fixedX;
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
          this.y = this.climbingTop - this.body.halfHeight;
          this.setVelocityY(MAX_Y_VELOCITY / 4);
          this.body.allowGravity = true;
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
        this.y += velY * delta / 1000;
        this.setVelocityY(4 * Math.sign(velY));
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
    if (!this.attacking && !this.isBlockedTop) {
      if (this.inputs.LEFT && !this.wasRightPressed) {
        vel = -this.getMovingSpeed();
        this.flipX = true;
        this.wasLeftPressed = true;
      } else if (this.inputs.RIGHT && !this.wasLeftPressed) {
        vel = this.getMovingSpeed();
        this.flipX = false;
        this.wasRightPressed = true;
      }
    }

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

    if ((vel > 0 && this.body.blocked.right) || (vel < 0 && this.body.blocked.left)) {
      vel = 0;
    } else {
      this.x += vel / 1000 * delta;
    }

    this.setVelocityX(Math.sign(vel));
  }

  private setCrouching(on: boolean) {
    if (on) {
      this.body.allowGravity = false;
      this.setSize(34, 50);
      this.setOffset(34, 52);
      this.body.allowGravity = true;
      this.setFrame('CLAW_67');
      this.body.velocity.x = 0;
      this.isCrouching = true;
      this.isBlockedTop = false;

      if (this.inputs.LEFT && !this.flipX) this.flipX = true;
      else if (this.inputs.RIGHT) this.flipX = false;
    } else {
      this.setSize(34, 114);
      this.setOffset(34, -12);
      this.isCrouching = false;
      this.isBlockedTop = false;
      if (this.isOnElevator) {
        const tlx = Math.floor(this.body.left / this.mainLayer.tilemap.tileWidth);
        const tly = Math.floor(this.body.top / this.mainLayer.tilemap.tileHeight);
        this.mainLayer.getTilesWithin(tlx, tly - 1, 2, 2).forEach(
          (tile: Tile) => {
            const l = tile.physics.rect ? tile.pixelX + tile.physics.rect.left + 14 :  tile.pixelX + 14;
            const r = tile.physics.rect ? tile.pixelX + tile.physics.rect.right - 13 :  tile.pixelX + tile.width - 14;
            const b = tile.physics.rect ? tile.pixelY + tile.physics.rect.bottom :  tile.pixelY + tile.height;
            if (tile.collides && !(this.body.left > r || this.body.right < l || this.y - 74 > b)) {
              this.isBlockedTop = true;
            }
          }
        )
      }
    }
  }

  addPowerup(powerup: PowerupType, time: number) {
    if (this.powerup != powerup) {
      if (this.powerup === undefined) {
        this.scene.game.musicManager.playPausingCurrent(this.scene.powerupMusic);
      }
      this.powerup = powerup;
      this.powerupTime = time;
      this.scene.events.emit('PowerupTimeChange', this.powerupTime);
    } else {
      this.powerupTime += time;
      this.scene.events.emit('PowerupTimeChange', this.powerupTime);
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
