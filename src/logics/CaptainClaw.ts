import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import { AttackType } from '../model/AttackType';
import { DEFAULTS } from '../model/Defaults';
import { DeathType } from '../model/LevelDefaults';
import { MinimalObjectCreationData } from '../model/ObjectData';
import { PowerupType } from '../model/PowerupType';
import MapDisplay from '../scenes/MapDisplay';
import Tile from '../tilemap/Tile';
import Health from './abstract/Health';
import PhysicsObject from './abstract/PhysicsObject';
import CaptainClawAttack from './CaptainClawAttack';
import Enemy from './abstract/Enemy';
import Splash from './Splash';
import StaticObject from '../object/StaticObject';
import Projectile from './Projectile';

const DEFAULT_JUMP_HEIGHT = 145;
const RUNNING_LEAP_JUMP_HEIGHT = 171;
const CATNIP_JUMP_HEIGHT = 195;

const DEFAULT_JUMP_TIME = 710;
const RUNNING_LEAP_JUMP_TIME = 730;
const CATNIP_JUMP_TIME = 740;

const DEFAULT_CLIMBING_SPEED = 200;

const DEFAULT_MOVING_SPEED = 255;
const RUNNING_LEAP_MOVING_SPEED = DEFAULT_MOVING_SPEED * 1.26;
const CATNIP_MOVING_SPEED = DEFAULT_MOVING_SPEED * 1.33;
const TWIN_TURBO_MOVING_SPEED = DEFAULT_MOVING_SPEED * 2;

const MAX_X_VELOCITY = 450;
const MAX_Y_VELOCITY = 750;

const RUNNING_LEAP_DELAY = 1500;
const IDLE_ANIMATION_DELAY = 15000;
const SLIPPED_DELAY = 80;

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
    SECONDARY_ATTACK: false,
  };

  attacking = false;
  climbing = false;
  dead = false;
  jumping = false;
  hurting = false;
  locked = false;

  climbingDown = false;
  climbingTop: number;
  touchingLadder = false;
  wasJumpPressed = false;
  wasRightPressed = false;
  wasLeftPressed = false;
  isCrouching = false;
  wasAttackPressed = false;

  jumpingPassively = false;
  jumpStartTime: number;
  jumpPrevY: number;
  runningLeapDelay: number;
  isOnGround = true;

  powerup?: PowerupType;

  spawnX: number;
  spawnY: number;

  health: Health;
  score = 0;
  attempt = 0;
  lives = 6;

  fixedX: number;
  jumpedFromY: number;
  passiveJumpHeight: number;
  touchingTile?: Tile;
  slippedFromTile?: Tile;
  slippedDelay = 0;
  fly = false;
  deathType: DeathType;

  attackRect: CaptainClawAttack;
  dialogLine?: StaticObject;
  hurtFrame?: string;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: MinimalObjectCreationData) {
    super(scene, mainLayer, object);
    this.anims.play('ClawStand');
    this.depth = DEFAULTS.CLAW.z;

    this.health = new Health(MAX_HEALTH, scene.time);
    this.health.on('change', () => this.scene.hud.updateHealth(this.health.value));

    const data = scene.game.dataManager.getPlayerData();
    if (data) {
      this.health.set(data.health.value);
      this.lives = data.lives;
      this.score = data.score;
    }

    scene.claw = this;
    this.alignToGround();
    this.spawnX = object.x;
    this.spawnY = object.y;

    const attacksCollider = this.scene.physics.add.overlap(scene.attackRects, this, (self, attackSource: Projectile) => {
      if (attackSource.attackType !== AttackType.PLAYER) {
        this.hit(attackSource);
        if (attackSource instanceof Projectile) {
          attackSource.collision();
        }
      }
    });

    const enemyCollider = scene.physics.add.overlap(this, scene.enemies, (self: CaptainClaw, enemy: Enemy) => {
      this.hit(enemy);
    });

    this.attackRect = new CaptainClawAttack(scene, this);

    this.setCrouching(false);
    this.setMaxVelocity(MAX_X_VELOCITY, MAX_Y_VELOCITY);

    this.on('animationcomplete', this.animComplete, this);
    this.on('animationupdate', this.animUpdate, this);
    this.runningLeapDelay = RUNNING_LEAP_DELAY;
    this.deathType = scene.getLevelData().DeathType;
    this.scene.game.soundsManager.playSound('GAME_FLAGWAVE');
    this.scene.transitioning = true;
    this.scene.cameras.main.fadeIn(1000, 0, 0, 0);
    setTimeout(() => this.scene.transitioning = false, 1000);
  }

  resetClawStatesData() {
    this.attackRect.setAttacking(this.attacking = false);
    this.climbing = false;
    this.hurting = false;
    this.dead = false;
    this.fixedX = 0;
    this.isOnElevator = false;
    this.isOnGround = false;
    this.jumping = false;
    this.jumpingPassively = false;
  }

  setFly(on: boolean) {
    this.fly = on;
    this.body.allowGravity = !on;
    this.body.enable = !on;
    this.resetClawStatesData();
    this.anims.play('ClawFall');
  }

  preUpdate(time: number, delta: number) {
    if (this.scene.transitioning) return;
    super.preUpdate(time, delta);

    if (this.dialogLine) {
      this.dialogLine.x = this.x;
      this.dialogLine.y = this.body.top - 30;
    }

    if (this.dead || this.locked) {
      return;
    }

    if (this.hurting) {
      this.setFrame(this.hurtFrame!);
      return;
    }

    if (this.fly) {
      if (this.inputs.RIGHT) this.x += delta;
      else if (this.inputs.LEFT) this.x -= delta;
      if (this.inputs.DOWN) this.y += delta;
      else if (this.inputs.UP) this.y -= delta;
      return;
    }

    if (this.slippedDelay > 0) {
      this.slippedDelay -= delta;
      if (this.slippedDelay <= 0 && this.slippedFromTile) {
        this.slippedFromTile = undefined;
      }
    }

    if (this.body.velocity.y === MAX_Y_VELOCITY) {
      this.setFrame('CLAW_401');
    }

    if (this.body.blocked.up) {
      this.setVelocityY(4);
      this.jumping = false;
      if (this.anims.currentAnim.key !== 'ClawJumpAttack') {
        this.anims.play('ClawFall');
      }
    }

    if (this.climbing) {
      this.processClimbing(time, delta);
    } else {
      if (this.body.blocked.down) {
        if (!this.isOnGround || this.anims.currentAnim.key === 'ClawJump' || this.anims.currentAnim.key === 'ClawFall') {
          this.anims.play('ClawStand');
          this.resetClawStatesData();
          this.isOnGround = true;
          if (!this.inputs.JUMP) {
            this.wasJumpPressed = false;
          }
          this.scene.game.soundsManager.playSound('CLAW_LEFTFOOT1');
          this.scene.game.soundsManager.playSound('CLAW_RIGHTFOOT1');
        } else if (this.anims.currentAnim.key === 'ClawJumpAttack') {
          this.anims.play('ClawStand');
          this.attackRect.setAttacking(this.attacking = false);
        }
      }

      this.processAttacks();

      if (this.inputs.DOWN && this.body.blocked.down) {
        if (!this.attacking) {
          this.setCrouching(true);
        }
      } else {
        if (this.isCrouching) {
          this.setCrouching(false);

          if (this.body.velocity.y === 0 || this.isOnElevator) {
            this.anims.play('ClawStand');
          }
        }

        this.processWalking(delta);

        if (this.inputs.JUMP && !this.wasJumpPressed && this.isOnGround) {
          this.jump(time);
        }
      }

      if (!this.inputs.JUMP && !this.jumpingPassively) {
        if (this.jumping) {
          this.jumping = false;
        } else if (this.body.blocked.down) {
          this.wasJumpPressed = false;
        }
      } else if (this.jumping) {
        this.isOnGround = false;
        this.isOnElevator = false;

        if (this.jumpPrevY) {
          if (this.y === this.jumpPrevY) {
            this.jumping = false;
            this.jumpPrevY = 0;
            this.setVelocityY(4);
            this.anims.play('ClawFall');

          } else {
            this.jumpPrevY = this.y;
          }
        } else {
          this.jumpPrevY = this.y;
        }

        const jumpTop = this.jumpedFromY - this.getJumpHeight();
        const jumpHeightLeft = this.y - jumpTop;
        const timeFromJump = time - this.jumpStartTime;
        const timeLeft = this.getJumpTime() - timeFromJump;

        if (jumpHeightLeft > 8 && timeLeft > 25) {
          this.setVelocityY(-25);
          this.y -= Math.min(((jumpHeightLeft + 80) * delta / (timeLeft - 25) + (timeFromJump * 0.012)), jumpHeightLeft - 1);
          if (this.body.blocked.up) {
            this.jumping = false;
          }
        } else {
          if (this.y > jumpTop) {
            this.y = jumpTop + 1;
            this.setVelocityY(15);
          } else {
            this.setVelocityY(30);
          }
          this.jumping = false;
          this.jumpingPassively = false;

          if (!this.inputs.JUMP) {
            this.wasJumpPressed = false;
          }
        }
      }

      if (this.body.velocity.y > 0 && this.isOnGround && !this.body.blocked.down) {
        this.slippedDelay = SLIPPED_DELAY;
        if (this.touchingTile) {
          this.slippedFromTile = this.touchingTile;
        }
        this.anims.play('ClawFall');
        this.isOnGround = false;
        this.isOnElevator = false;
        this.isBlockedTop = false;
        this.wasJumpPressed = true;
      }
    }
  }

  shootProjectile(image?: string, damage?: number) {
    return new Projectile(this.scene, this.mainLayer, AttackType.PLAYER, { x: this.x, y: this.body.center.y, image, damage, direction: this.flipX }, image !== 'GAME_BULLETS');
  }

  processAttacks() {
    if (this.inputs.SECONDARY_ATTACK) {
      this.shootProjectile('GAME_BULLETS', 8);
    }

    if (this.anims.currentAnim.key === 'ClawDuckSwipe') {
      if (this.inputs.LEFT && !this.flipX) this.flipX = true;
      else if (this.inputs.RIGHT) this.flipX = false;
      this.attackRect.updateRect(30, 19, 75, 18);
    }

    if (this.inputs.ATTACK && !this.wasAttackPressed && !this.attacking) {
      this.attackRect.isSpecial = false;
      this.attackRect.isHigh = false;
      if (this.isOnGround) {
        if ((this.anims.currentAnim.key === 'ClawStand' || this.anims.currentAnim.key === 'ClawWalk' || this.anims.currentAnim.key === 'ClawWalkCatnip')) {
          const attack = (this.powerup === PowerupType.FIRESWORD || this.attackRect.targetInSwordRange) ? 1 : Math.floor(Math.random() * 4) + 1;
          this.anims.play('ClawStandAttack' + attack);
          this.attackRect.damage = 5;
          switch (attack) {
            case 1:
              this.attackRect.updateRect(30, -2, 82, 21);
              this.scene.game.soundsManager.playSound('CLAW_SWORDSWISH', { delay: 0.05 });
              break;
            case 3:
              this.attackRect.isHigh = true;
              this.attackRect.updateRect(0, -19, 56, 38);
              this.scene.game.soundsManager.playSound('CLAW_UPPERCUT1', { delay: 0.035 });
              break;
            default:
              this.attackRect.updateRect(0, -2, 56, 21);
              if (attack === 2) {
                this.scene.game.soundsManager.playSound('CLAW_LEFTSWING1', { delay: 0.035 });
              } else {
                this.scene.game.soundsManager.playSound('CLAW_UPPERCUT1', { delay: 0.05 });
              }
              break;
          }
        } else if (this.anims.currentAnim.key === 'ClawDuck') {
          this.anims.play('ClawDuckSwipe');
          this.scene.game.soundsManager.playSound('CLAW_SWORDSWISH', { delay: 0.05 });
          this.attackRect.updateRect(30, 19, 75, 18);
          this.attackRect.damage = 2;
        }
      } else {
        this.attacking = true;
        this.anims.play('ClawJumpAttack');
        this.scene.game.soundsManager.playSound('CLAW_SWORDSWISH', { delay: 0.05 });
        this.attackRect.updateRect(30, -2, 82, 21);
        this.attackRect.damage = 5;
      }

      if (this.powerup === PowerupType.CATNIP) {
        this.attackRect.damage *= 2;
      } else if (this.powerup === PowerupType.FIRESWORD) {
        this.attackRect.damage = 20;
        this.attackRect.isSpecial = true;
        this.shootProjectile('GAME_PROJECTILES_FIRESWORD', 20);
      }

      this.attackRect.setAttacking(this.attacking = true);
      this.wasAttackPressed = true;
    } else if (!this.inputs.ATTACK) {
      this.wasAttackPressed = false;
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
    this.resetClawStatesData();
    this.x = climbX;
    this.fixedX = climbX;
    this.climbing = true;
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

  private getJumpHeight(): number {
    if (this.jumpingPassively) {
      return this.passiveJumpHeight;
    }
    if (this.powerup === PowerupType.CATNIP) {
      return CATNIP_JUMP_HEIGHT;
    }
    return this.runningLeapDelay <= 0 ? RUNNING_LEAP_JUMP_HEIGHT : DEFAULT_JUMP_HEIGHT;
  }

  private getJumpTime() {
    if (this.jumpingPassively) {
      return this.passiveJumpHeight * 1.5 + 50;
    }
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
    if ((!this.hurting && !this.attacking || (!this.isOnGround && !this.isOnElevator)) && !this.isBlockedTop) {
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
      this.anims.play('ClawDuck');
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
            const l = tile.physics.rect ? tile.pixelX + tile.physics.rect.left + 14 : tile.pixelX + 14;
            const r = tile.physics.rect ? tile.pixelX + tile.physics.rect.right - 13 : tile.pixelX + tile.width - 14;
            const b = tile.physics.rect ? tile.pixelY + tile.physics.rect.bottom : tile.pixelY + tile.height;
            if (tile.collides && tile.isSolid && !(this.body.left > r || this.body.right < l || this.y - 74 > b)) {
              this.isBlockedTop = true;
            }
          },
        );
      }
    }
  }

  addPowerup(powerup: PowerupType, time: number) {
    if (this.powerup !== powerup) {
      if (this.powerup === undefined) {
        this.scene.game.musicManager.playPausingCurrent(this.scene.powerupMusic);
      }
      if (powerup === PowerupType.FIRESWORD) {
        this.say('CLAW_FIRESWORD');
      } else if (powerup === PowerupType.INVISIBILITY) {
        this.alpha = 0.5;
      }
      this.powerup = powerup;
      this.scene.events.emit('PowerupTimeChange', time);
    } else {
      this.scene.events.emit('PowerupTimeChange', this.scene.hud.powerupTime + time);
    }
  }

  teleportTo(x: number, y: number) {
    this.lock();
    this.scene.game.soundsManager.playSound('GAME_WARP');
    this.scene.transitioning = true;
    this.scene.cameras.main.fadeOut(500);
    setTimeout(() => {
      this.resetClawStatesData();
      this.x = x;
      this.y = y;
      this.preUpdate(this.scene.time.now + 1, 1);
      if (this.isOnGround) {
        this.setCrouching(false);
      } else if (this.anims.currentAnim.key === 'ClawStand' || this.anims.currentAnim.key === 'ClawWalk' || this.anims.currentAnim.key === 'ClawWalkCatnip') {
        this.play('ClawFall');
      }
      this.scene.cameras.main.fadeIn(500, 0, 0, 0);
      setTimeout(() => {
        this.scene.transitioning = false;
        this.unlock();
      }, 500);
    }, 500);

  }

  backToSpawn() {
    this.resetClawStatesData();
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.attempt++;
    this.play('ClawStand');
  }

  setSpawn(x: number, y: number) {
    this.spawnX = x;
    this.spawnY = y;
  }

  deathTile() {
    this.lock();
    this.health.set(0);
    this.dead = true;
    this.anims.play('ClawSpikeDeath');

    if (this.powerup !== undefined) {
      if (this.powerup === PowerupType.INVISIBILITY) {
        this.alpha = 1;
      }
      this.powerup = undefined;
      this.scene.game.musicManager.resumePaused();
      this.scene.events.emit('PowerupTimeChange', 0);
    }

    if (this.deathType === DeathType.GOO) {
      this.visible = false;
      const splash = new Splash(this.scene, this.mainLayer, { x: this.x, y: this.y, z: this.z });
      this.scene.game.soundsManager.playSound('LEVEL_GOO_DEATH');
    } else {
      this.scene.game.soundsManager.playSound('LEVEL_SPIKES_DEATH');
    }
  }

  say(dialogLine: string) {
    if (!this.dialogLine) {
      this.dialogLine = new StaticObject(this.scene, this.mainLayer, {
        x: this.x,
        y: this.body.top - 30,
        z: this.depth + 1,
        logic: 'ClawDialog',
        texture: 'GAME',
        image: 'GAME_EXCLAMATION',
        frame: 1,
      });

      this.scene.game.soundsManager.playVocal(dialogLine).on('ended', () => {
        this.dialogLine!.destroy();
        this.dialogLine = undefined;
      });
    }
  }


  private animComplete(animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) {
    if (this.hurting) return;
    if (animation.key === 'ClawJump' && !this.attacking) {
      this.jumping = false;
      this.anims.play('ClawFall');
    } else if (animation.key === 'ClawSpikeDeath') {
      this.died();
    } else if (this.attacking && animation.key !== 'ClawDuck') {
      this.attackRect.setAttacking(this.attacking = false);
      if (this.inputs.DOWN && (this.isOnGround || this.isOnElevator)) {
        this.setCrouching(true);
      } else {
        this.setCrouching(false);
        if (animation.key === 'ClawJumpAttack' && !this.body.blocked.down) {
          this.anims.play('ClawFall');
          this.attackRect.setAttacking(this.attacking = false);
        } else {
          this.anims.play('ClawStand');
          this.attackRect.setAttacking(this.attacking = false);
        }
      }
    }
  }

  private animUpdate(animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) {
    if (animation.key === 'ClawWalk' || animation.key === 'ClawWalkCatnip') {
      if (frame.index === 5) {
        this.scene.game.soundsManager.playSound('CLAW_LEFTFOOT1');
      } else if (frame.index === 10) {
        this.scene.game.soundsManager.playSound('CLAW_RIGHTFOOT1');
      }
    } else if (this.attacking && frame.isLast) {
      this.attackRect.setAttacking(false);
    }
  }

  killFall() {
    if (!this.dead) {
      this.dead = true;
      this.lock();
      this.play('ClawFallDeath');
      this.scene.game.soundsManager.playSound('CLAW_FALLDEATH');
      setTimeout((self: CaptainClaw) => {
        self.scene.cameras.main.stopFollow();
        self.tilesCollider!.active = false;
        this.unlock();
        setTimeout(() => self.died(), 1000);
      }, 1000, this);
    }
  }

  died() {
    if (this.lives-- > 0) {
      this.scene.hud.updateLives(this.lives);
      this.scene.game.soundsManager.playSound('GAME_CIRCLEFADE');
      this.scene.cameras.main.fadeOut(1000);
      setTimeout(() => {
        this.resetClawStatesData();
        this.unlock();
        this.tilesCollider!.active = true;
        this.backToSpawn();
        this.anims.play('ClawStand');
        this.visible = true;
        this.health.reset();
        this.scene.game.soundsManager.playSound('GAME_FLAGWAVE');
        this.scene.cameras.main.startFollow(this, true);
        this.scene.cameras.main.fadeIn(1000, 0, 0, 0);
      }, 1500);
    } else {
      this.scene.game.goToMainMenu();
    }
  }

  lock() {
    this.body.allowGravity = false;
    this.body.enable = false;
    this.locked = true;
  }

  unlock() {
    this.body.allowGravity = true;
    this.body.enable = true;
    this.locked = false;
  }

  hit(attackSource: Enemy | Projectile) {
    if (!this.hurting && !this.dead && !this.health.isBeingHurt() && (attackSource instanceof Projectile || !attackSource.dead && this.body.bottom >= attackSource.y)) {
      this.jumping = false;
      this.climbing = false;
      this.hurting = true;
      this.body.allowGravity = false;
      this.health.hurt(attackSource.damage);
      this.scene.game.soundsManager.playSound('GAME_HIT' + (Math.floor(Math.random() * 4) + 1));
      if (this.health.isDead()) {
        this.killFall();
      } else {
        this.scene.game.soundsManager.playVocalHurtSound('CLAW_HIT' + (Math.floor(Math.random() * 4) + 1));
        this.hurtFrame = 'CLAW_2'+ Math.round(Math.random())*2;
        if (this.isOnGround) {
          const dir = Math.sign(this.x - attackSource.x);
          this.setVelocity(dir * 16, 0);
        } else {
          this.setVelocity(0, 0);
        }
      }
      setTimeout(() => {
        if (!this.dead) {
          this.hurting = false;
          this.body.allowGravity = true;
          if (this.isOnGround) {
            this.play('ClawStand');
          } else {
            this.play('ClawFall');
          }
        }
      }, 500);
    }
  }
}
