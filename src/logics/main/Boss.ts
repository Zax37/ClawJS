import { ObjectCreationData } from '../../model/ObjectData';
import { MapDisplay } from '../../scenes/MapDisplay';
import { Health } from '../abstract/Health';
import { BossStagger } from './BossStagger';
import { CaptainClawAttack } from './CaptainClawAttack';
import { HumanEnemy } from './HumanEnemy';

export class Boss extends HumanEnemy {
  private bossStagger: BossStagger;
  startedFight: boolean;
  attempt: number;

  constructor(protected scene: MapDisplay, mainLayer: Phaser.Tilemaps.DynamicTilemapLayer, protected object: ObjectCreationData) {
    super(scene, mainLayer, object);
    this.container.rawContents = [31];
    this.health = new Health(100, scene.time);
    this.attackSound = 'LEVEL_RAUX_00840003';
    this.deathSound = 'LEVEL_RAUX_00840005';
    this.strikeSound = 'LEVEL_LARASW';

    this.goingRight = false;
    this.walking = false;
    this.flipX = false;
    this.movingSpeed = 0.05;

    this.anims.stop();
    this.setFrame(object.image + 1);
    this.once('animationcomplete', () => this.setFrame(object.image + 1));
  }

  preUpdate(time: number, delta: number) {
    if (this.scene.transitioning) return;
    super.preUpdate(time, delta);

    if (this.startedFight) {
      if (this.attempt !== this.scene.claw.attempt) {
        this.health.reset();
        this.attempt = this.scene.claw.attempt;
        this.x = this.object.x;
        this.y = this.object.y;
        this.flipX = false;
        this.stand(time);
      }

      if (this.goingRight !== (this.scene.claw.x > this.x)) {
        this.patrolFlip(time);
      }
    } else {
      if (!this.bossStagger && this.isOnScreen()) {
        this.bossStagger = new BossStagger(this.scene, this);
        this.attempt = this.scene.claw.attempt;
      }
    }
  }

  protected stand(time: number) {
  }

  protected walk() {
    if (!this.startedFight) return;
    super.walk();
  }

  protected patrolFlip(time: number) {
    if (this.scene.claw.dead) {
      super.stand(time);
    }
    super.patrolFlip(time);
  }

  die(attackSource: CaptainClawAttack) {
    this.scene.cameras.main.stopFollow();
    this.scene.game.soundsManager.playSound('GAME_AMULETRISE');
    this.scene.claw.lock();
    super.die(attackSource);
  }

  staggerLine() {
    this.say('LEVEL_STAGING_ENEMY2');
    this.play(this.animations['STAND'].key);
  }
}